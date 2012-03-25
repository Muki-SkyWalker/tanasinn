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
 *  @class CommandlineIme
 *  
 *  This plugin makes it enable to supports IME mode.
 *  It watches the value of main inputbox element with polling. 
 *  (NOTE that Mozilla's inputbox at IME editing mode does not fires ANY DOM 
 *  events!)
 *  object. and shows a line on editing as an watermark/overlay object. 
 *
 */ 
let CommandlineIme = new Class().extends(Plugin)
                                .depends("commandline");
CommandlineIme.definition = {

  get id()
    "commandline_ime",

  get info()
    <plugin>
        <name>{_("Commandline IME")}</name>
        <description>{
          _("Make you enable to input with IME at the commandline field.")
        }</description>
        <version>0.1</version>
    </plugin>,

  "[persistable] enabled_when_startup": true,

  "[persistable] polling_interval": 500, // in milliseconds

  _timer: null,
  _ime_input_flag: false,

  /** Installs plugin 
   *  @param {Session} session A session object.
   */ 
  "[subscribe('install/commandline_ime'), enabled]":
  function install(session) 
  {
    let textbox = this.dependency["commandline"].getInputField();
    textbox.style.width = "0%";
    textbox.style.imeMode = "inactive"; // disabled -> inactive
    textbox.style.border = "none"; // hide border
    // enables session event handlers.
    let version_comparator = Components
      .classes["@mozilla.org/xpcom/version-comparator;1"]
      .getService(Components.interfaces.nsIVersionComparator);
    if (version_comparator.compare(coUtils.Runtime.version, "10.0") <= 0)
    {
      this.startPolling.enabled = true;
      this.endPolling.enabled = true;
    }
    this.oninput.enabled = true;
    this.oncompositionupdate.enabled = true;

    let document = session.window.document;
    let focusedElement = document.commandDispatcher.focusedElement;
    if (focusedElement && focusedElement.isEqualNode(textbox)) {
      this.startPolling();
    }
      
  }, // install

  /** Uninstall plugin 
   *  @param {Session} session A session object.
   */
  "[subscribe('uninstall/commandline_ime'), enabled]":
  function uninstall(session) 
  {
    this.endPolling(); // stops polling timer. 
    let textbox = this.dependency["commandline"].getInputField();
    if (null !== textbox) {
      textbox.style.width = "";
      textbox.style.imeMode = "disabled";
      textbox.style.border = "";  
      textbox.style.position = ""; 
    }

    // disables session event handlers.
    this.startPolling.enabled = false;
    this.endPolling.enabled = false;
    this.oninput.enabled = false;
    this.oncompositionupdate.enabled = false;
  },

  "[subscribe('command/input-text')]": 
  function oninput(value) 
  {
    this._disableImeMode(); // closes IME input session.
  },

  /** Starts the polling timer. */
  "[subscribe('event/got-focus')]":
  function startPolling() 
  {
    if (this._timer) {
      this._timer.cancel();
    }
    this._ime_input_flag = false;
    this._timer = coUtils.Timer
      .setInterval(this.onpoll, this.polling_interval, this);
  },

  /** Stops the polling timer. */
  "[subscribe('event/lost-focus')]":
  function endPolling() 
  {
    if (this._timer) {
      this._timer.cancel();
      this._timer = null;
    }
  },
 
  /** input event handler. 
   *  @param {Event} event A event object.
   *  @notify event/input Notifies that a input event is occured.
   */
  "[listen('input', '#tanasinn_default_input')]":
  function oninput(event) 
  {
    this.dependency["commandline"].commit();
    this._disableImeMode();
  },
 
  /** compositionend event handler. 
   *  @{Event} event A event object.
   */
  "[listen('compositionupdate', '#tanasinn_commandline')]":
  function oncompositionupdate(event) 
  {
    this.onpoll();
  },
 
  /** compositionstart event handler. 
   *  @{Event} event A event object.
   */
  "[listen('compositionstart', '#tanasinn_commandline'), enabled]":
  function oncompositionstart(event) 
  {
      let version_comparator = Components
        .classes["@mozilla.org/xpcom/version-comparator;1"]
        .getService(Components.interfaces.nsIVersionComparator);
      if (version_comparator.compare(coUtils.Runtime.version, "10.0") >= 0)
      {
        this.oninput.enabled = false;
      }
  },
  
  /** compositionend event handler. 
   *  @{Event} event A event object.
   */
  "[listen('compositionend', '#tanasinn_commandline'), enabled]":
  function oncompositionend(event) 
  {
      let version_comparator = Components
        .classes["@mozilla.org/xpcom/version-comparator;1"]
        .getService(Components.interfaces.nsIVersionComparator);
      if (version_comparator.compare(coUtils.Runtime.version, "10.0") >= 0)
      {
        this.oninput.enabled = true;
        this.oninput(event);
      }
  },

  /** A interval timer handler function that observes the textbox content
   *  value and switches IME enabled/disabled state. 
   */  
  onpoll: function onpoll() 
  {
    let text = this.dependency["commandline"].getInputField().value;
    if (text) { // if textbox contains some text data.
      if (!this._ime_input_flag) {
        this._enableImeMode(); // makes the IME mode enabled.
      }
    } else {   // if textbox is empty.
      if (this._ime_input_flag) {
        this._disableImeMode(); // makes the IME mode disabled.
      }
    }
  },

  /** Shows textbox element. */
  _enableImeMode: function _enableImeMode() 
  {
    let commandline = this.dependency["commandline"];
    let textbox = this.dependency["commandline"].getInputField();
    let top = 0; // cursor.positionY * line_height + -4;
    let left = commandline.getCaretPosition(); // cursor.positionX * char_width + -2;
    textbox.style.opacity = 1.0;
    this._ime_input_flag = true;
    let session = this._broker;
    session.notify("command/ime-mode-on", this);
  },

  _disableImeMode: function _disableImeMode() 
  {
    let commandline = this.dependency["commandline"];
    let textbox = this.dependency["commandline"].getInputField();
    textbox.style.opacity = 0.0;
    this._ime_input_flag = false;
    let session = this._broker;
    session.notify("command/ime-mode-off", this);
  }
};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new CommandlineIme(broker);
}
