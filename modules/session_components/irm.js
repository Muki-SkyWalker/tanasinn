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
 * @class IRMSwitch
 *
 * IRM — Insert/Replace Mode
 *
 * This control function selects how the terminal adds characters to page 
 * memory. The terminal always adds new characters at the cursor position.
 *
 * Default: Replace.
 *
 * Format
 *
 * CSI    4    h
 * 9/11   3/4  6/8
 *
 * Set: insert mode.
 * 
 *
 * CSI    4    l
 * 9/11   3/4  6/12   
 *
 * Reset: replace mode.
 *
 * Description
 *
 * If IRM mode is set, then new characters move characters in page memory 
 * to the right. Characters moved past the page's right border are lost.
 *
 * If IRM mode is reset, then new characters replace the character at the
 * cursor position.
 *
 */
var IRMSwitch = new Class().extends(Plugin);
IRMSwitch.definition = {

  get id()
    "irm_switch",

  get info()
    <module>
        <name>{_("IRM Switch")}</name>
        <version>0.1</version>
        <description>{
          _("Switch Insert/Replace mode(IRM) with escape seqnence.")
        }</description>
    </module>,


  "[persistable] enabled_when_startup": true,

  /** Activate auto-repeat feature.
   */
  "[subscribe('sequence/sm/4'), pnp]":
  function activate() 
  { 
    // enable insert mode.
    this.sendMessage("command/enable-insert-mode");
  },

  /** Deactivate auto-repeat feature
   */
  "[subscribe('sequence/rm/4'), pnp]":
  function deactivate() 
  {
    // disable insert mode.
    this.sendMessage("command/disable-insert-mode");
  },

}; // class IRMSwitch

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new IRMSwitch(broker);
}


