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
 * @class Utf8MouseMode
 *
 * XT_MSE_UTF - utf8 mouse mode
 *
 * Default: off
 *
 * Format
 *
 * CSI   ?     1     0     0     5     h
 * 9/11  3/15  3/1   3/0   3/0   3/5   6/8
 *
 * Set: enable utf8 mouse mode.
 *
 *
 * CSI   ?     1     0     0     5     l
 * 9/11  3/15  3/1   3/0   3/0   3/5   6/12
 *
 * Reset: disable utf8 mouse mode.
 *
 */
var Utf8MouseMode = new Class().extends(Plugin);
Utf8MouseMode.definition = {

  id: "utf8_mouse_mode",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("UTF8 1005 Mouse Mode"),
      version: "0.1",
      description: _("Switch the utf8 mouse mode state.")
    };
  },

  "[persistable] enabled_when_startup": true,
  "[persistable] default_value": false,

  _mode: false,

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    this._mode = this.default_value;
  },

  /** Uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
    this._mode = null;
  },

  /** Enable utf8-style mouse reporting.
   */
  "[subscribe('sequence/decset/1005'), pnp]":
  function activate()
  {
    this._mode = true;

    this.sendMessage("event/mouse-tracking-type-changed", "utf8");
    coUtils.Debug.reportMessage(
      _("DECSET 1005 - Enable utf8-style mouse reporting, was set."));
  },

  /** Disable utf8-style mouse reporting.
   */
  "[subscribe('sequence/decrst/1005'), pnp]":
  function deactivate()
  {
    this._mode = false;

    this.sendMessage("event/mouse-tracking-type-changed", null);
    coUtils.Debug.reportMessage(
      _("DECRST 1005 - Disable utf8-style mouse reporting, was reset."));
  },

  /** Report mode
   */
  "[subscribe('sequence/decrqm/1005'), pnp]":
  function report()
  {
    var mode = this._mode ? 1: 2,
        message = "?1005;" + mode + "$y";

    this.sendMessage("command/send-sequence/csi", message);
  },

  /** on hard / soft reset
   */
  "[subscribe('command/{soft | hard}-terminal-reset'), pnp]":
  function reset(broker)
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
    var data = context[this.id];

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



}; // class Utf8MouseMode

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new Utf8MouseMode(broker);
}

// EOF
