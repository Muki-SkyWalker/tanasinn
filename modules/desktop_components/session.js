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

  /** @property search_path */
  get search_path()
  {
    var runtimepath = coUtils.Runtime.getRuntimePath();

    return this._search_path || [
      "modules/shared_components",
      "modules/session_components",
      runtimepath + "/modules/shared_components",
      runtimepath + "/modules/session_components"
    ];

  },

  set search_path(value)
  {
    this._search_path = value;
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

}; // RouteKeyEvents

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

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("Session"),
      version: "0.1",
      description: _("A Broker module which manages TTY session.")
    };
  },

  /** provide requested session id */
  get request_id()
  {
    return this._request_id;
  },

  /** provide chrome window object */
  get window()
  {
    return this._window;
  },

  /** provide start-up command string */
  get command()
  {
    return this._command;
  },

  /** provide $TERM environment */
  get term()
  {
    return this._term;
  },

  /** provide cygwin root */
  get cygwin_root()
  {
    return this._cygwin_root;
  },

  /** provide python path */
  get python_path()
  {
    return this._python_path;
  },

  /** provide process object */
  get process()
  {
    return this._broker;
  },

  get parent()
  {
    return this._broker;
  },

  "[persistable] enabled_when_startup": true,

  "[persistable] profile_directory": "session_profile",
  "[persistable] batch_directory": "batches",
  "[persistable] cgi_directory": "cgi-bin",
  "[persistable] rcfile": "tanasinnrc",
  "[persistable] profile": "default",
  "[persistable] initial_focus_delay": 200,
  "[persistable] default_term": "xterm",
  "[persistable] debug_flag": false,

  _stopped: false,
  _request_id: null,

  /** send a command line string to command manager */
  "[subscribe('command/send-command'), enabled]":
  function sendCommand(command)
  {
    this.notify("command/eval-commandline", command);
  },

  /** send a key expression to input manager */
  "[subscribe('command/send-keys'), enabled]":
  function sendKeys(expression)
  {
    this.notify(
      "command/input-expression-with-remapping",
      expression);
  },

  /** detach from session */
  "[subscribe('event/disabled'), enabled]":
  function onDisabled()
  {
    this.notify("command/detach", this);
  },

  /** Create terminal UI and start tty session. */
  initializeWithRequest:
  function initializeWithRequest(request)
  {
    var id = coUtils.Uuid.generate().toString();

    this.load(this,
              this.search_path,
              new this._broker._broker.default_scope);

    // register getter topic.
    this.subscribe(
      "get/root-element",
      function()
      {
        return request.parent;
      }, this, id);

    this._request_id = id;
    this._window = request.parent.ownerDocument.defaultView;
    this._command = request.command;
    this._term = request.term || this.default_term;
    this._python_path = request.python_path;
    this._cygwin_root = request.cygwin_root;

    this.sendMessage("initialized/session", this);

    this.notify("command/load-settings", this.profile);
    this.notify("event/broker-started", this);

    this.notify("event/session-initialized", this);

    this.sendMessage(
      "command/add-domlistener",
      {
        type: "close",
        id: id,
        target: this._window,
        context: this,
        handler: this.onDisabled,
      });

    coUtils.Timer.setTimeout(
      function timerProc()
      {
        this.notify("command/show");
        this.notify("command/focus");
        coUtils.Timer.setTimeout(
          function timerProc2()
          {
            this.notify("command/focus");
          }, this.initial_focus_delay, this);
      }, this.initial_focus_delay, this);

    return this;
  },

  /** Send event/broker-stopping message. */
  "[subscribe('event/shutdown'), enabled]":
  function stop()
  {
    if (this._stopped) {
      return;
    }

    this._stopped = true
    this.stop.enabled = false;

    function wait(span)
    {
      var end_time = Date.now() + span,
          current_thread = coUtils
                  .Services
                  .getThreadManager()
                  .currentThread;

      do {
        current_thread.processNextEvent(true);
      } while ((current_thread.hasPendingEvents()) || Date.now() < end_time);
    };


    this.notify("event/before-broker-stopping", this);
    this.notify("event/broker-stopping", this);

    coUtils.Timer.setTimeout(
      function timerProc()
      {
        this.notify("event/broker-stopped", this);
        this.unsubscribe(this._request_id);
        this.clear();
      }, 30000, this)

    this._window = null;
  },

}; // class Session


/**
 * @class SessionFactory
 */
var SessionFactory = new Class().extends(Plugin)
SessionFactory.definition = {

  id: "session-factory",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("Session Factory"),
      version: "0.1",
      description: _("Create TTY sessions on demand")
    };
  },

  /** provide UI template */
  getTemplate: function getTemplate()
  {
    var root = this.request("get/root-element");
    return {
      parentNode: root,
      id: "message-bar",
      flex: 1,
      style: {
        position: "fixed",
        border: "solid 1px red",
        left: "30px",
        top: "30px",
        height: "30px",
      },
      tagName: "vbox",
    };
  },

  "[subscribe('event/session-requested'), enabled]":
  function onSessionRequested(request)
  {
    //var result = this.request(
    //                "command/construct-chrome",
    //                this.getTemplate());
    var session = new Session(this._broker);

    session.initializeWithRequest(request);
    return session;
  },

}; // class SessionFactory


/**
 * @fn main
 * @brief Module entry point.
 * @param {Desktop} desktop The Desktop object.
 */
function main(desktop)
{
  new SessionFactory(desktop);
}

// EOF
