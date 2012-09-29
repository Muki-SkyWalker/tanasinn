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

"use strict";

/** @package session
 *
 * [ Session overview ]
 *
 * tanasinn's "Session" is a concept that abstracts Terminal session and 
 * all resources associated with it.
 * It behaves as a mediator object, and be associated with following session-local 
 * objects: 
 * 
 * 1. Event Manager
 * 2. TTY driver object
 * 3. Environment service
 * 4. VT Emurator. 
 * 5. Output Parser
 * 6. Input Manager
 * 7. User interface
 * 8. Renderer
 *
 */

/**
 * @Trait Environment
 *
 */
var Environment = new Trait();
Environment.definition = {

// public properties

  /** @property bin_path */
  get bin_path()
  {
    return this._broker.bin_path;
  },

  set bin_path(value)
  {
    this._broker.bin_path = value;
  },

  /** @property runtime_path */
  get runtime_path()
  {
    return this._broker.runtime_path;
  },

  set runtime_path(value)
  {
    this._broker.runtime_path = value;
  },

  /** @property search_path */
  get search_path()
  {
    var broker = this._broker;

    return this._search_path || [ 
      "modules/shared_components",
      "modules/session_components",
      broker.runtime_path + "/modules/shared_components",
      broker.runtime_path + "/modules/session_components"
    ];

  },

  set search_path(value)
  {
    this._search_path = value;
  },

  get cygwin_root()
  {
    return this._broker.cygwin_root;
  },

}; // Environment

/**
 * @trait RouteKeyEvents
 */
var RouteKeyEvents = new Trait()
RouteKeyEvents.definition = {

  /** route double shift hotkey evnet */
  "[subscribe('event/hotkey-double-shift'), enabled]":
  function onDoubleShift() 
  {
    this.notify("event/hotkey-double-shift", this);
  },

  /** route ctrl key down evnet */
  "[subscribe('event/ctrl-key-down'), enabled]":
  function onCtrlKeyDown() 
  {
    this.notify("event/ctrl-key-down", this);
  },

  /** route ctrl key up evnet */
  "[subscribe('event/ctrl-key-up'), enabled]":
  function onCtrlKeyUp() 
  {
    this.notify("event/ctrl-key-up", this);
  },

  /** route alt key down evnet */
  "[subscribe('event/alt-key-down'), enabled]":
  function onAltKeyDown() 
  {
    this.notify("event/alt-key-down", this);
  },

  /** route alt key up evnet */
  "[subscribe('event/alt-key-up'), enabled]":
  function onAltKeyUp() 
  {
    this.notify("event/alt-key-up", this);
  },

  /** route shift key down evnet */
  "[subscribe('event/shift-key-down'), enabled]":
  function onShiftKeyDown() 
  {
    this.notify("event/shift-key-down", this);
  },

  /** route shift key up evnet */
  "[subscribe('event/shift-key-up'), enabled]":
  function onShiftKeyUp() 
  {
    this.notify("event/shift-key-up", this);
  },

};

/**
 *
 * @class Session
 *
 */
var Session = new Class().extends(Component)
                         .mix(Environment)
                         .mix(RouteKeyEvents)
                         .mix(EventBroker);
Session.definition = {

  id: "session",

  get request_id()
    this._request_id,

  get window()
    this._window,

  get document()
    this.window.document,

  get root_element()
    this._root_element,

  get command()
    this._command,

  get term()
    this._term,

  get process()
    this._broker,

  get parent()
    this._broker,

  "[persistable] profile_directory": "session_profile",
  "[persistable] batch_directory": "batches",
  "[persistable] cgi_directory": "cgi-bin",
  "[persistable] rcfile": "tanasinnrc",
  "[persistable] profile": "default",
  "[persistable] initial_focus_delay": 100,
  "[persistable] default_term": "xterm",
  "[persistable] debug_flag": false,

  _stopped: false,
  _request_id: null,

  /** constructor */
  initialize: function initialize(broker)
  {
    this.load(this, this.search_path, new broker._broker.default_scope);
  },

  "[subscribe('command/send-command'), enabled]":
  function sendCommand(command) 
  {
    this.notify("command/eval-commandline", command);
  },

  "[subscribe('command/send-keys'), enabled]":
  function sendKeys(expression) 
  {
    this.notify("command/input-expression-with-remapping", expression);
  },

  "[subscribe('event/disabled'), enabled]":
  function onDisabled() 
  {
    this.notify("command/detach", this);
  },

  /** Create terminal UI and start tty session. */ 
  initializeWithRequest: function initializeWithRequest(request) 
  {
    var id = coUtils.Uuid.generate().toString();

    // register stop topic
    this.subscribe(
      "command/stop", 
      function()
      { 
        this.stop();
      }, this, id);

    // register getter topic.
    this.subscribe(
      "get/bin-path", 
      function()
      {
        return this.request("get/bin-path");
      }, this, id);

    this.subscribe(
      "get/python-path", 
      function()
      { 
        return this.request("get/python-path");
      }, this, id);

    this.subscribe(
      "get/root-element", 
      function()
      { 
        return request.parent;
      }, this, id);

    this.subscribe(
      "get/runtime-path", 
      function()
      { 
        return request.parent;
      }, this, id);

    this._request_id = id;
    this._window = request.parent.ownerDocument.defaultView;
    this._root_element = request.parent;
    this._command = request.command;
    this._term = request.term || this.default_term;

    this.sendMessage("initialized/session", this);

    this.notify("command/load-settings", this.profile);
    this.notify("event/broker-started", this);
    
    //coUtils.Timer.setTimeout(
    //  function timerProc()
    //  {
    this.notify("command/focus");
    //this.notify("command/focus");
    //this.notify("command/focus");
    //  }, this.initial_focus_delay, this);
    this.notify("event/session-initialized");

    return this;
  },

  /** Send event/broker-stopping message. */
  "[subscribe('event/shutdown'), enabled]":
  function stop() 
  {
    if (this._stopped) {
      return;
    }

//    this.unsubscribe(this._request_id);
    this._stopped = true
    this.stop.enabled = false;
    this.notify("event/broker-stopping", this);
    this.notify("event/broker-stopped", this);
    this.clear();

    this._root_element = null;
    this._window = null;

    //if (coUtils.Runtime.app_name.match(/tanasinn/)) {
    //  this.window.close(); // close window

    //  var application = Components
    //    .classes["@mozilla.org/fuel/application;1"]
    //    .getService(Components.interfaces.fuelIApplication);
    //  application.quit();
    //}
  },

}; // class Session


/**
 * @fn main
 * @brief Module entry point.
 * @param {Desktop} desktop The Desktop object.
 */
function main(desktop) 
{
  desktop.subscribe(
    "event/session-requested", 
    function(request) 
    {
      new Session(desktop).initializeWithRequest(request);
    });
}

// EOF
