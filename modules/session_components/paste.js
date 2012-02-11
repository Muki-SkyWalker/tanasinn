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
 *  @class Paste
 */
let Paste = new Class().extends(Plugin);
Paste.definition = {

  get id()
    "paste",

  get info()
    <plugin>
        <name>{_("Paste")}</name>
        <version>0.1</version>
        <description>{
          _("Paste a string from clipboard.")
        }</description>
    </plugin>,

  /** Install itself. */
  "[subscribe('install/paste'), enabled]":
  function install(session) 
  {
    this.paste.enabled = true;
    this.onContextMenu.enabled = true;
  },

  /** Uninstall itself. */
  "[subscribe('uninstall/paste'), enabled]":
  function uninstall(session) 
  {
    this.paste.enabled = false;
    this.onContextMenu.enabled = false;
  },
  
  /** Context menu handler. */
  "[subscribe('get/contextmenu-entries')]": 
  function onContextMenu() 
  {
    return {
      tagName: "menuitem",
      label: _("paste"), 
      listener: {
        type: "command", 
        context: this,
        handler: function() this.paste()
      }
    };
  },

  /** */
  "[command('paste'), nmap('<M-v>', '<C-S-V>'), _('Paste from clipboard.')]": 
  function paste() 
  {
    let clipboard = Components
      .classes["@mozilla.org/widget/clipboard;1"]
      .getService(Components.interfaces.nsIClipboard)
    let trans = Components
      .classes["@mozilla.org/widget/transferable;1"]
      .createInstance(Components.interfaces.nsITransferable);
    trans.addDataFlavor("text/unicode");
    clipboard.getData(trans, clipboard.kGlobalClipboard);
	  let str = {};
	  let strLength = {};
	  trans.getTransferData("text/unicode", str, strLength);
    if (str.value && strLength.value) {
      let text = str.value
        .QueryInterface(Components.interfaces.nsISupportsString)
        .data
        .substring(0, strLength.value / 2);

      // Encodes the text message and send it to the tty device.
      let session = this._broker;
      session.notify("command/input-text", text);
    }
    return true; /* prevent default action */
  }

};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  broker.subscribe(
    "@initialized/broker", 
    function(broker) new Paste(broker));
}

