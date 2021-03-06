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
 * @class SendReceiveMode
 *
 * SRM - Local Echo: Send/Receive Mode
 *
 * This control function turns local echo on or off. When local echo is on,
 * the terminal sends keyboard characters to the screen. The host does not
 * have to send (echo) the characters back to the terminal display. When
 * local echo is off, the terminal only sends characters to the host. It is
 * up to the host to echo characters back to the screen.
 *
 * Default: No local echo
 *
 * Format
 *
 * CSI    1    2    h
 * 9/11   3/1  3/2  6/8
 *
 * Set: local echo off.
 *
 *
 * CSI    1    2    l
 * 9/11   3/1  3/2  6/12
 *
 * Reset: local echo on.
 *
 * Description
 *
 * When the SRM function is set, the terminal sends keyboard characters to
 * the host only. The host can echo the characters back to the screen.
 *
 * When the SRM function is reset, the terminal sends keyboard characters to
 * the host and to the screen. The host does have to echo characters back to
 * the terminal.
 *
 */
var SendReceiveMode = new Class().extends(Plugin);
SendReceiveMode.definition = {

  id: "send_receive_mode",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("SRM Switch"),
      version: "0.1",
      description: _("Switch local echo mode(SRM) with escape seqnence.")
    };
  },

  "[persistable] enabled_when_startup": true,
  "[persistable] default_value": true,

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

  /** set new line.
   */
  "[subscribe('sequence/sm/12'), pnp]":
  function activate()
  {
    this._mode = true;

    // enable insert mode.
    this.sendMessage("set/local-echo-mode", false);
  },

  /** set line feed.
   */
  "[subscribe('sequence/rm/12'), pnp]":
  function deactivate()
  {
    this._mode = false;

    // disable insert mode.
    this.sendMessage("set/local-echo-mode", true);
  },

  /** Report mode
   */
  "[subscribe('sequence/rqm/12'), pnp]":
  function report()
  {
    var mode = this._mode ? 1: 2,
        message = "12;" + mode + "$y";

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



}; // class SendReceiveMode

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new SendReceiveMode(broker);
}

// EOF
