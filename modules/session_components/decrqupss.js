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
 *  @class UPSSRequest
 *
 *  DECRQUPSS User-Preferred Supplemental Set
 *
 * Applications can ask for the current user-preferred supplemental
 * set. The terminal responds with the user-preferred supplemental
 * set (DECAUPSS) sequence.
 *
 * Host Request (DECRQUPSS)
 *
 * The host requests the current user-preferred supplemental set by
 * sending the following sequence:
 *
 * Format
 * CSI     &       u
 * 9/11    2/6     7/5
 *
 * Terminal Responses
 *
 * The terminal uses the DECAUPSS device control string to report
 * the current user-preferred supplemental set (UPSS).
 * The terminal sends DECAUPSS in response to a DECRQUPSS sequence.
 * The terminal can send one of the following reports:
 *
 * Control Sequence        UPSS
 * DCS 0 ! u % 5 ST        The user-preferred supplemental set is
 *                         DEC Supplemental Graphic.
 * DCS 1 ! u A ST          The user-preferred supplemental set is
 *                         ISO Latin-1 supplemental.
 */
var UPSSRequest = new Class().extends(Plugin);
UPSSRequest.definition = {

  id: "upss_request",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("UPSS Request"),
      version: "0.1",
      description: _("Handle DECRQUPSS and report DECAUPSS.")
    };
  },

  "[persistable] enabled_when_startup": true,

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

  "[profile('vt100'), sequence('CSI & u')]":
  function onUPSSRequest()
  {
    var reply = "0!uA";
    //var reply = "0!u%5";

    this.sendMessage(
      "command/send-sequence/dcs", reply);
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

} // class DRCSBuffer

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new UPSSRequest(broker);
}

// EOF
