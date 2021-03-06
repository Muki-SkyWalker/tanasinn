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
 * @class SecondaryDA
 *
 * DA2 - Secondary Device Attributes
 *
 * In this DA exchange, the host requests the terminal's
 * identification code, firmware version level, and hardware options.
 * Host Request
 *
 * The host uses the following sequence to send this request:
 *
 * CSI    >      c     or   CSI    >      0     c
 * 9/11   3/14   6/3   or   9/11   3/14   3/0   6/3
 *
 * Terminal Response
 *
 * The terminal with a VT keyboard uses the following sequence to respond:
 *
 * CSI    >      6     1     ;      Pv    ;      0     c
 * 9/11   3/14   3/6   3/1   3/11   3/n   3/11   3/0   6/3
 *
 * DA2R for terminal with STD keyboard.
 *
 * CSI    >      6     1     ;      Pv    ;      1     c
 * 9/11   3/14   3/6   3/1   3/11   3/n   3/11   3/1   6/3
 *
 * DA2R for terminal with PC keyboard.
 *
 * Parameters
 *
 * 61
 * indicates the identification code of the terminal for the secondary
 * device attributes command.
 *
 * Pv
 * indicates the version level of the firmware implementing the terminal
 * management functions, for example, editing, as shown in the following
 * table.
 *
 * Pv   Version
 * 10   V1.0 (released version 1.0)
 * 20   V2.0 (released version 2.0)
 *
 * Secondary DA Example
 *
 * The following is a typical secondary DA exchange:
 *
 * Request (Host to VT510)
 * CSI > c or CSI > 0 c
 * The host asks for the terminal's identification, firmware version,
 * current hardware options.
 *
 * Response (VT510 to host)
 * CSI > 61; 20; 1 c
 * The terminal identifies itself as a VT510 that uses version 2.0
 * firmware, and has a PC keyboard option.
 */
var SecondaryDA = new Class().extends(Plugin);
SecondaryDA.definition = {

  id: "secondary_da",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("Secondary Device Attribute"),
      version: "0.1",
      description: _("Reply Secondary device attribute message against requests.")
    };
  },

  "[persistable] enabled_when_startup": true,

  //
  // 0;  terminal ID
  // 277: Firmware version (for xterm, this is the XFree86 patch
  //      number, starting with 95).
  // 0:   DEC Terminal"s ROM cartridge registration number,
  //      always zero.
  //
  "[persistable] response": ">0;277;0c",

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
  },

  /** Uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
  },

  /** handle DA2 request. */
  "[profile('vt100'), sequence('CSI > Ps c'), pnp]":
  function DA2(n)
  { // Secondary DA (Device Attributes)
    if (n !== undefined && n !== 0) {
      coUtils.Debug.reportWarning(
        _("%s sequence [%s] was ignored."),
        "DA2",
        Array.slice(arguments));
    } else { //
      this.sendMessage("sequence/DA2");
    }
  },

  /** retuns Device Attribute message */
  "[subscribe('sequence/DA2'), pnp]":
  function reply()
  {
    this.sendMessage(
      "command/send-sequence/csi",
      this.response);
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


};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new SecondaryDA(broker);
}

// EOF
