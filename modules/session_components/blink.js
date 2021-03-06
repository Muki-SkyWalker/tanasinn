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


/**
 * @class CursorBlink
 *
 * XT_CBLINK - Cursor Blinking Mode (att610)
 *
 * This control function makes the cursor blinking or no-blinking.
 *
 * Default: No-blinking
 *
 * Format
 *
 * CSI   ?     1     2     h
 * 9/11  3/15  3/1   3/2   6/8
 *
 * Set: makes the cursor blinking.
 *
 *
 * CSI   ?     1     2     l
 * 9/11  3/15  3/1   3/2   6/12
 *
 * Reset: makes the cursor no-blinking.
 *
 */
var CursorBlink = new Class().extends(Plugin)
                             .depends("cursorstate");
CursorBlink.definition = {

  id: "cursor_blink",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("Cursor Blink"),
      version: "0.1",
      description: _("Controls cursor blink switching.")
    };
  },

  "[persistable] enabled_when_startup": true,
  "[persistable] default_value": false,

  _mode: null,
  _cursor: null,

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    this._mode = this.default_value;
    this._cursor = context["cursorstate"];
    this.reset();
  },

  /** Uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
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
//
//    coUtils.Debug.reportMessage(
//      _("DECSET - 12 (enable cursor blink) was called."));
  },

  /** Stop Blinking Cursor (att610).
   */
  "[subscribe('sequence/decrst/12'), pnp]":
  function deactivate()
  {
    var cursor = this._cursor;

    this._mode = false;

    cursor.blink = false;
//
//    coUtils.Debug.reportMessage(
//      _("DECSET - 12 (disable cursor blink) was called."));
  },

  /** Report mode
   */
  "[subscribe('sequence/decrqm/12'), pnp]":
  function report()
  {
    var mode = this._mode ? 1: 2,
        message = "?12;" + mode + "$y";

    this.sendMessage("command/send-sequence/csi", message);
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

  /** test */
  "[test]":
  function()
  {
    var enabled = this.enabled;

    try {
      this.enabled = false;
      this.enabled = true;
      this.enabled = false;
    } finally {
      this.enabled = enabled;
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
