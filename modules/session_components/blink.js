/* -*- Mode: JAVASCRIPT; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 4 -*-
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
 * Portions created by the Initial Developer are Copyright (C) 2010 - 2011
 * the Initial Developer. All Rights Reserved.
 *
 * ***** END LICENSE BLOCK ***** */


/**
 * @class CursorBlink
 *
 */
var CursorBlink = new Class().extends(Plugin)
                             .depends("cursorstate");
CursorBlink.definition = {

  get id()
    "cursor_blink",

  get info()
    <module>
        <name>{_("Cursor Blink")}</name>
        <version>0.1</version>
        <description>{
          _("Controls cursor blink switching.")
        }</description>
    </module>,

  "[persistable] enabled_when_startup": true,
  "[persistable] default_value": false,

  _mode: null,
  _cursor: null,

  /** installs itself. 
   *  @param {Broker} broker A Broker object.
   */
  "[install]":
  function install(broker) 
  {
    this._mode = this.default_value;
    this._cursor = this.dependency["cursorstate"];
    this.reset();
  },

  /** Uninstalls itself.
   *  @param {Broker} broker A broker object.
   */
  "[uninstall]":
  function uninstall(broker) 
  {
    this._mode = null;
    this._cursor = null;
  },

  /** Start Blinking Cursor (att610).
   */
  "[subscribe('sequence/decset/12'), pnp]":
  function activate() 
  { 
    var cursor = this._cursor;

    this._mode = true;

    cursor.blink = true;

    coUtils.Debug.reportMessage(
      _("DECSET - 12 (enable cursor blink) was called."));
  },

  /** Stop Blinking Cursor (att610).
   */
  "[subscribe('sequence/decrst/47'), pnp]":
  function deactivate() 
  {
    var cursor = this._cursor;

    this._mode = false;

    cursor.blink = false;

    coUtils.Debug.reportMessage(
      _("DECSET - 12 (disable cursor blink) was called."));
  },

  /** handle terminal reset event.
   */
  "[subscribe('command/{soft | hard}-terminal-reset'), pnp]":
  function reset() 
  {
    if (this.default_value) {
      this.activate();
    } else {
      this.deactivate();
    }
  },

  /**
   * Serialize snd persist current state.
   */
  "[subscribe('@command/backup'), type('Object -> Undefined'), pnp]": 
  function backup(context) 
  {
    // serialize this plugin object.
    context[this.id] = {
      mode: this._mode,
    };
  },

  /**
   * Deserialize snd restore stored state.
   */
  "[subscribe('@command/restore'), type('Object -> Undefined'), pnp]": 
  function restore(context) 
  {
    var data;

    data = context[this.id];
    if (data) {
      this._mode = data.mode;
    } else {
      coUtils.Debug.reportWarning(
        _("Cannot restore last state of renderer: data not found."));
    }
  },


}; // class ReverseVideo

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new CursorBlink(broker);
}

// EOF