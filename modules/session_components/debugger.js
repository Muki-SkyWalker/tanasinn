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

/**
 *
 * @class Tracer
 *
 */
var Tracer = new Class().extends(Component);
Tracer.definition = {

  id: "tracer",

  _mode: "vt100",

  "[subscribe('command/change-emulation-mode'), enabled]":
  function onChangeMode(mode) 
  { 
    if (this.onBeforeInput.enabled) {
      this.disable();
      this._mode = mode;
      this.enable();
    } else {
      this._mode = mode;
    }
  },

  "[subscribe('command/debugger-trace-on'), enabled]":
  function enable() 
  {
    var sequences = this.sendMessage("get/sequences/" + this._mode),
        i = 0,
        information;

    this.onBeforeInput.enabled = true;

    // get sequence handlers

    // backup them
    this._backup_sequences = sequences;

    this.sendMessage("command/reset-sequences");

    for (; i < sequences.length; ++i) {
      information = sequences[i];
      this._registerControlHandler(information);
    }
  },

  "[subscribe('command/debugger-trace-off'), enabled]":
  function disable() 
  {
    var sequences = this.sendMessage("get/sequences/" + this._mode),
        i = 0,
        information;

    this.onBeforeInput.enabled = false;

    this.sendMessage("command/reset-sequences");

    for (; i < sequences.length; ++i) {
      information = sequences[i];
      this.sendMessage("command/add-sequence", information);
    }
  },

  "[subscribe('command/send-to-tty')]":
  function onBeforeInput(message) 
  {
    var info;

    info = {
      type: coUtils.Constant.TRACE_INPUT, 
      name: undefined,
      value: [message],
    };
    this.sendMessage(
      "command/debugger-trace-sequence", 
      [info, undefined]); 
  },

  _registerControlHandler: function _registerControlHandler(information)
  {
    var handler = information.handler,
        delegate;


    try {

      delegate = function()
      {
        handler.apply(this, arguments);

        return {
          type: coUtils.Constant.TRACE_CONTROL,
          name: handler.name, 
          value: Array.slice(arguments),
        };
      };

      this.sendMessage(
        "command/add-sequence",
        {
          expression: information.expression, 
          handler: delegate, 
          context: information.context,
        });

    } catch (e) {
      coUtils.Debug.reportError(e);
    }
  },

}; // class Tracer

/**
 *
 * @class Hooker
 *
 */
var Hooker = new Class().extends(Component).depends("parser");
Hooker.definition = {

  id: "hooker",

  _buffer: null, 
  _hooked: false,
  _step_mode: false,

  /** Constructor */
  initialize: function initialize(broker) 
  {
    this._buffer = [];
  },

  /** Suspend TTY and enter debug session. */
  "[subscribe('command/debugger-pause'), enabled]":
  function pause() 
  {
    this._step_mode = true;
  },

  /** Resume TTY and close debug session */
  "[subscribe('command/debugger-resume'), enabled]":
  function resume()  
  {
    var buffer = this._buffer,
        action,
        result;

    this._step_mode = false;

    // drain queued actions.
    while (0 !== buffer.length) {
      action = buffer.shift();
      result = action();
      this.sendMessage("command/debugger-trace-sequence", result);
    }
    this.sendMessage("command/flow-control", true);
    this.sendMessage("command/draw"); // redraw
  },

  /** Execute 1 command. */
  "[subscribe('command/debugger-step'), enabled]":
  function step()
  {
    var buffer,
        action,
        result;

    if (this._hooked) {
      buffer = this._buffer;
      action = buffer.shift();
      if (action) {
        result = action();
        this.sendMessage("command/debugger-trace-sequence", result);
        this.sendMessage("command/draw"); // redraw
      } else {
        this.sendMessage("command/flow-control", true);
      }
    }
  },

  "[subscribe('command/debugger-trace-on'), enabled]":
  function set() 
  {
    var parser,
        buffer,
        self,
        action,
        result_cache,
        result,
        sequence;

    function make_action(sequence, action)
    {
      buffer.push(
        function do_action()
        {
          var result = action();
          return [result, sequence];
        });
    }

    if (!this._hooked) {

      parser = this.dependency["parser"];
      buffer = this._buffer;
      self = this;
      this._hooked = true;

      // hook parser
      parser.parse = function parse_alternative(data) 
        {
          if (self._step_mode) {
            this.sendMessage("command/flow-control", false);
          }
          for (action in parser.__proto__.parse.call(parser, data)) {
            sequence = parser._scanner.getCurrentToken();
            make_action(sequence, action);
          }

          // do action
          if (!self._step_mode) {
            while (buffer.length) {
              action = buffer.shift();
              result_cache = [];
              this.sendMessage("command/debugger-trace-sequence", result_cache);
              result = action();
              result_cache[0] = result[0];
              result_cache[1] = result[1];
            }
          }
        };
    };
  },

  "[subscribe('command/debugger-trace-off'), enabled]":
  function unset() 
  {
    var parser;

    if (this._hooked) {
      parser = this.dependency["parser"];
      delete parser.parse; // uninstall hook
      this._hooked = false;
    }
  },
}

/**
 * @class Debugger
 */
var Debugger = new Class().extends(Plugin);
Debugger.definition = {

  id: "debugger",

  getInfo: function getInfo()
  {
    return {
      name: _("Debugger"),
      version: "0.1",
      description: _("Enables you to run terminal emurator step-by-step and ", 
                     "observe input/output character sequence.")
    };
  },

  "[persistable] enabled_when_startup": true,

  "[persistable] auto_scroll": true,
  "[persistable] update_interval": 100,

  _timer_id: null,

  getTemplate: function getTemplate()
  {
    return {
      tagName: "hbox",
      flex: 1,
      childNodes: [
        {
          tagName: "vbox",
          childNodes: [
            {
              tagName: "checkbox",
              id: "tanasinn_debugger_attach",
              label: _("attach"),
              listener: {
                type: "command",
                context: this,
                handler: this.doAttach,
              }
            },
            {
              tagName: "button",
              id: "tanasinn_debugger_break",
              label: _("break"),
              disabled: true,
              listener: {
                type: "command",
                context: this,
                handler: this.doBreak,
              }
            },
            {
              tagName: "button",
              id: "tanasinn_debugger_resume",
              label: _("resume"),
              disabled: true,
              listener: {
                type: "command",
                context: this,
                handler: this.doResume,
              }
            },
            {
              tagName: "button",
              id: "tanasinn_debugger_step",
              label: _("step"),
              disabled: true,
              listener: {
                type: "command",
                context: this,
                handler: this.doStep,
              }
            },
          ],
        },
        {
          tagName: "vbox",
          flex: 1,
          style: "width: 100%; height: 100%;",
          childNodes: {
            tagName: "vbox",
            flex: 1,
            id: "tanasinn_trace",
            style: "padding: 5px; overflow-y: auto;"
          },
        },
      ]
    };
  },

  /** Installs itself. 
   *  @param {Broker} broker A Broker object.
   */
  "[install]": 
  function install(broker) 
  {
    this._queue = [];
  },

  /** Uninstalls itself 
   *  @param {Broker} broker A Broker object.
   */
  "[uninstall]":
  function uninstall(broker)
  {
    this.trace.enabled = false;

    if (this._timer) {
      this._timer.cancel();
    }

    this._timer = null;
    this._queue = null;
    this.sendMessage("command/remove-panel", this.id);
  },

  "[subscribe('@get/panel-items'), pnp]": 
  function onPanelItemRequested(panel) 
  {
    var template = this.getTemplate(),
        item = panel.alloc(this.id, _("Debugger")),
        result;

    template.parentNode = item;

    result = this.request("command/construct-chrome", template);

    this._trace_box = result.tanasinn_trace;
    this._checkbox_attach = result.tanasinn_debugger_attach;
    this._checkbox_break = result.tanasinn_debugger_break;
    this._checkbox_resume = result.tanasinn_debugger_resume;
    this._checkbox_step = result.tanasinn_debugger_step;
    this.trace.enabled = true;

    return item;
  },

  doAttach: function doAttach() 
  {
    try {
      if (this._checkbox_attach.checked) {
        this.enableDebugger();
      } else {
        this.disableDebugger();
      }
    } catch (e) {
      coUtils.Debug.reportError(e);
    }
  },

  "[command('enabledebugger/eg'), _('Attach the debugger and trace incoming sequences.'), pnp]": 
  function enableDebugger()
  {
    if (!this._trace_box) {
      this.select();
    }
    this.enableDebugger.enabled = false;
    this.disableDebugger.enabled = true;
    this.doBreak.enabled = true;
    this._checkbox_attach.checked = true;
    this._checkbox_break.setAttribute("disabled", !this._checkbox_attach.checked);
    this.sendMessage("command/debugger-trace-on");
    if (this._timer) {
      this._timer.cancel();
    }
    this._timer = coUtils.Timer.setInterval(function() 
    {
      var updated = false,      // update flag
          queue = this._queue,  // queue object
          trace_box;            // trace box UI eleemnt

      if (!queue && this._timer) {
        this._timer.cancel();
        this._timer = null;
        return;
      }

      // detect changes
      updated = 0 !== queue.length;

      while (0 !== queue.length) {
        this.update(queue.shift());
      }
      if (updated && this.auto_scroll) {
        trace_box = this._trace_box;
        trace_box.scrollTop = trace_box.scrollHeight;
      }
    }, this.update_interval, this);
  },
 
  "[command('disabledebugger'), _('Detach the debugger.'), pnp]": 
  function disableDebugger()
  {
    if (!this._trace_box) {
      this.select();
    }
    this.doBreak.enabled = false;
    this.doResume.enabled = false;
    this.doStep.enabled = false;
    this._checkbox_attach.checked = false;
    this._checkbox_break.setAttribute("disabled", !this._checkbox_attach.checked);
    this._checkbox_break.setAttribute("disabled", true);
    this._checkbox_resume.setAttribute("disabled", true);
    this._checkbox_step.setAttribute("disabled", true);
    if (this._timer) {
      this._timer.cancel();
    }
    this._timer = null;
    this.sendMessage("command/debugger-trace-off");
    this.sendMessage("command/debugger-resume");
  },

  "[command('breakdebugger'), _('Break debugger.'), pnp]": 
  function doBreak() 
  {
    if (!this._trace_box) {
      this.select();
    }
    if (!this._checkbox_attach.checked) {
      this.enableDebugger();
    }
    this.doBreak.enabled = false;
    this.doResume.enabled = true;
    this.doStep.enabled = true;
    this._checkbox_break.setAttribute("disabled", true);
    this._checkbox_resume.setAttribute("disabled", false);
    this._checkbox_step.setAttribute("disabled", false);
    this.sendMessage("command/debugger-pause");
  },

  "[command('resumedebugger'), _('Resume terminal.')]": 
  function doResume() 
  {
    if (!this._trace_box) {
      this.select();
    }
    this.doBreak.enabled = true;
    this.doResume.enabled = false;
    this.doStep.enabled = false;
    this._checkbox_resume.setAttribute("disabled", true);
    this._checkbox_step.setAttribute("disabled", true);
    this._checkbox_break.setAttribute("disabled", false);
    this.sendMessage("command/debugger-resume");
  },

  "[command('step'), _('Do step over.')]":
  function doStep() 
  {
    if (!this._trace_box) {
      this.select();
    }
    this.sendMessage("command/debugger-step");
  },
/*
  "[command('breakpoint/bp'), pnp]": 
  function breakpoint(arguments_string) 
  {
    if (!this._trace_box) {
      this.select();
    }
    this._pattern = new RegExp(arguments_string);
    this.watchSequence.enabled = true;
  },
*/
  _pattern: null,

  "[subscribe('command/debugger-trace-sequence')] watchSequence": 
  function watchSequence(trace_info) 
  {
    if (this._pattern.test(trace_info.sequence)) {
      this.watchSequence.enabled = false;
      this.doBreak();
    }
  },

  "[subscribe('command/debugger-trace-sequence')]": 
  function trace(trace_info) 
  {
    if (this._queue) {
      this._queue.push(trace_info);
    }
  },

  _escape: function _escape(str) 
  {
    return str.replace(/[\u0000-\u001f]/g, function(c) 
    {
      return "<" + (0x100 + c.charCodeAt(0)).toString(16).substr(1, 2) + ">";
    });
  },

  update: function update(trace_info) 
  {
    var [info, sequence] = trace_info;

    var {type, name, value} = info || {
      type: coUtils.Constant.TRACE_OUTPUT,
      name: undefined,
      value: [sequence.slice(0, -1)],
    };

    value = value || ["dfkjskl"];
    var child;
    switch (type) {
      case coUtils.Constant.TRACE_CONTROL: 
        child = [
          {
            tagName: "label",
            value: ">",
            style: "padding: 3px; color: darkred;",
          },
          {
            tagName: "box",
            width: 120,
            childNodes:
            {
              tagName: "label",
              value: this._escape(sequence),
              style: "color: red; background: lightblue; border-radius: 6px; padding: 3px;",
            },
          },
          {
            tagName: "label",
            value: "-",
            style: "color: black; padding: 3px;",
          },
          {
            tagName: "box",
            style: "background: lightyellow; border-radius: 6px; margin: 2px; padding: 0px;",
            childNodes: [
              {
                tagName: "label",
                value: name,
                style: "color: blue; padding: 1px;",
              },
              {
                tagName: "label",
                value: this._escape(value.toString()),
                style: "color: green; padding: 1px;",
              }
            ],
          },
        ]
        break;

      case coUtils.Constant.TRACE_OUTPUT: 
        child = [
          {
            tagName: "label",
            value: ">",
            style: "padding: 3px; color: darkred;",
          },
          {
            tagName: "label",
            value: this._escape(value.shift()),
            style: "color: darkcyan; background: lightgray; border-radius: 6px; padding: 3px;",
          },
        ]
        break;

      default:
        child = [
          {
            tagName: "label",
            value: "<",
            style: "padding: 3px; color: darkblue;",
          },
          {
            tagName: "label",
            value: value && this._escape(value.shift()),
            style: "color: darkcyan; background: lightpink; border-radius: 6px; padding: 3px;",
          },
        ]
    }
    this.request("command/construct-chrome", {
      parentNode: "#tanasinn_trace",
      tagName: "hbox",
      style: "width: 400px; max-width: 400px; font-weight: bold; text-shadow: 0px 0px 2px black; font-size: 20px; ",
      childNodes: child,
    });
  },


  /** select this panel */
  "[command('debugger'), nmap('<M-d>', '<C-S-d>'), _('Open debugger.'), pnp]":
  function select() 
  {
    this.sendMessage("command/select-panel", this.id);
    return true;
  },
};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new Debugger(broker);
  new Hooker(broker);
  new Tracer(broker);
}

// EOF
