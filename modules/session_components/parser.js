/* -*- Mode: JAVASCRIPT; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*-
 *
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is tanasinn
 *
 * The Initial Developer of the Original Code is
 * Hayaki Saito.
 * Portions created by the Initial Developer are Copyright (C) 2010 - 2013
 * the Initial Developer. All Rights Reserved.
 *
 * ***** END LICENSE BLOCK ***** */

"use strict";

var _PARSESTATE_PRINTABLE = 0;
var _PARSESTATE_CONTROL = 1;

/**
 * @class Parser
 * @brief Parse byte sequence emitted by TTY device.
 */
var Parser = new Class().extends(Plugin)
                        .depends("screen")
                        .depends("decoder")
                        .depends("drcs_converter")
                        .depends("scanner");
Parser.definition = {

  id: "parser",

  /** provide plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("Parser"),
      version: "0.1",
      description: _("Parse control sequences.")
    };
  },

  "[persistable] enabled_when_startup": true,
  "[persistable] initial_grammar": "vt100",
  "[persistable, watchable] ambiguous_as_wide": false,
  "[persistable, watchable] emoji_width_fix": false,

  _grammar: null,
  _screen: null,
  _decoder: null,
  _scanner: null,
  _timer: null,

  _wcwidth: null,
  _state: 0,

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    this._scanner = context["scanner"];
    this._screen = context["screen"];
    this._decoder = context["decoder"];
    this._drcs_converter = context["drcs_converter"];

    this.onChangeAmbiguousCharacterWidth(this.ambiguous_as_wide);
    this.onChangeAmbiguousCharacterWidth(this.emoji_width_fix);
  },

  /** uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
    this._scanner = null;
    this._screen = null;
    this._decoder = null;
    this._drcs_converter = null;
  },

  /** called when the broker object is initialized */
  "[subscribe('event/session-initialized'), pnp]":
  function onSessionInitialized(session)
  {
    var grammars = this.sendMessage("get/grammars"),
        grammar,
        i;

    this._grammars = {};

    for (i = 0; i < grammars.length; ++i) {
      grammar = grammars[i];
      this._grammars[grammar.id] = grammar;
    }

    this._grammar = this._grammars[this.initial_grammar];
  },

  /** called when East Asian ambiguous width settings is changed */
  "[subscribe('variable-changed/parser.ambiguous_as_wide'), pnp]":
  function onChangeAmbiguousCharacterWidth(is_wide)
  {
    if (is_wide) {
      if (this.emoji_width_fix) {
        this._wcwidth = wcwidth_amb_as_double_with_emoji_fix;
      } else {
        this._wcwidth = wcwidth_amb_as_double;
      }
    } else {
      if (this.emoji_width_fix) {
        this._wcwidth = wcwidth_amb_as_single_with_emoji_fix;
      } else {
        this._wcwidth = wcwidth_amb_as_single;
      }
    }
  },

  /** called when Emoji width settings is changed */
  "[subscribe('variable-changed/parser.emoji_width_fix'), pnp]":
  function onChangeEmojiCharacterWidth(fix)
  {
    if (fix) {
      if (this.ambiguous_as_wide) {
        this._wcwidth = wcwidth_amb_as_double_with_emoji_fix;
      } else {
        this._wcwidth = wcwidth_amb_as_single_with_emoji_fix;
      }
    } else {
      if (this.ambiguous_as_wide) {
        this._wcwidth = wcwidth_amb_as_double;
      } else {
        this._wcwidth = wcwidth_amb_as_single;
      }
    }
  },

  /** called when emulation mode is changed */
  "[subscribe('command/change-emulation-mode'), pnp]":
  function onChangeMode(mode)
  {
    var grammars = this._grammars,
        value;

    if (grammars.hasOwnProperty(mode)) {
      if (this._grammar === grammars[mode]) {
        // nothing to do
      } else {
        this._grammar = grammars[mode];
        value = this._scanner.drain();
        this.drive(value);
      }
    } else {
      coUtils.Debug.reportError(
        _("Specified mode '%s' was not found."),
        mode);
    }
  },

  /** enable default (VT-compatible) parser */
  "[subscribe('command/enable-default-parser'), pnp]":
  function enableDefaultParser()
  {
  },

  /** disable default (VT-compatible) parser */
  "[subscribe('command/disable-default-parser'), pnp]":
  function disableDefaultParser()
  {
  },

  /** Parse and evaluate control codes and text pieces from the scanner.
   *  @param {String} data incoming data in text format.
   */
  "[subscribe('event/data-arrived'), pnp]":
  function drive(data)
  {
    var grammar = this._grammar,
        scanner = this._scanner,
        action;

    scanner.assign(data);

    this.parse(scanner);

    if (grammar.is_ground()) {
      this.sendMessage("command/draw"); // fire "draw" event.
    } else {
      coUtils.Timer.setTimeout(
        function timerProc()
        {
          if (!grammar.is_ground()) {
            this.sendMessage("command/draw");
          }
        },100, this);
    }
  },

  /** Parse and evaluate control codes and text pieces from the scanner.
   *  @param {String} data incoming data in text format.
   */
  "[subscribe('event/data-arrived-recursively'), pnp]":
  function onDataArrivedRecursively(data)
  {
    var scanner = new Scanner(broker),
        action;

    scanner.assign(data);

    this.parse(scanner);
    this.sendMessage("command/draw"); // fire "draw" event.
  },

  /** Parse control codes and text pieces from the scanner.
   *  @param {String} data incoming data in text format.
   */
  parse: function parse(scanner)
  {
    var grammar = this._grammar,
        screen = this._screen,
        drcs_converter = this._drcs_converter,
        decoder = this._decoder,
        codes;

    while (true) {
      if (_PARSESTATE_PRINTABLE === this._state) {
        grammar.parse(scanner)
        if (scanner.isEnd) {
          break;
        }
        this._state = _PARSESTATE_CONTROL;
      } else {
        codes = this._decode(scanner);
        if (0 !== codes.length) {
          screen.write(drcs_converter.convert(codes));
          if (scanner.isEnd) {
            break;
          }
        }
        this._state = _PARSESTATE_PRINTABLE;
      }
    }
  },

  /** decode given output stream and return the result as byte array */
  _decode: function _decode(scanner)
  {
    var decoder = this._decoder,
        generator = decoder.decode(scanner),
        codes = [],
        c,
        base;

    if (null === generator) {
      return [ 0x3f ]; // ?
    }

    for (c in generator) {

      if (c < 0xa1) {
        codes.push(c);
      } else {

        /** Pads NULL characters before each of wide characters.
         *
         *  example:
         *
         *  +--------+--------+--------+--------+--------+--------+-
         *  | 0x0041 | 0x0042 | 0x0043 | 0x3042 | 0x0044 | 0x3044 |
         *  +--------+--------+--------+--------+--------+--------+-
         *                        ^                          ^
         *                       wide                       wide
         *
         *  Above character sequence will to be converted as follows.
         *
         *  +--------+--------+--------+--------+--------+--------+--------+--------+-
         *  | 0x0041 | 0x0042 | 0x0043 | 0x0000 | 0x3042 | 0x0044 | 0x0000 | 0x3044 |
         *  +--------+--------+--------+--------+--------+--------+--------+--------+-
         *                                 ^                          ^
         *                              inserted                   inserted
         */
        switch (this._wcwidth(c)) {

          case 1:
            codes.push(c);
            break;

          case 2:
            codes.push(0, c);
            break;

          default: // 0
            if (0 === codes.length) {
              codes.push([0x20, c]);
            } else {
              base = codes[codes.length - 1];
              if ("number" === typeof base) {
                codes[codes.length - 1] = [base, c];
              } else {
                base.push(c);
              }
            }
        }

      }
    }
    return codes;
  },

  /** test */
  "[test]":
  function()
  {
    var enabled = this.enabled;

    try {
      if (enabled) {
        coUtils.Debug.assert(this._scanner);
        coUtils.Debug.assert(this._screen);
        coUtils.Debug.assert(this._decoder);
        coUtils.Debug.assert(this._drcs_converter);
        coUtils.Debug.assert(this._wcwidth);
      } 
    } finally {
    }
  },


}; // Parser

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new Parser(broker);
}

// EOF
