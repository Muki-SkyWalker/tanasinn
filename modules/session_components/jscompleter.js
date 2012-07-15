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
 * Portions created by the Initial Developer are Copyright (C) 2010 - 2011
 * the Initial Developer. All Rights Reserved.
 *
 * ***** END LICENSE BLOCK ***** */


/**
 * @class JsCompleter
 */
var JsCompleter = new Class().extends(Component);
JsCompleter.definition = {

  get id()
    "jscompleter",

  /*
   * Search for a given string and notify a listener (either synchronously
   * or asynchronously) of the result
   *
   * @param context - The completion context object. 
   */
  "[completer('js'), enabled]":
  function complete(context)
  {
    var autocomplete_result, pattern, match,
        settled, notation, current, context, 
        code, properties, lower_current;

    autocomplete_result = null; 
    pattern = /(.*?)(?:(\.|\[|\['|\[")(\w*))?$/;
    match = pattern.exec(context.source);

    if (match) {
      [, settled, notation, current] = match;
      dom = {
        window: this.request("get/root-element").ownerDocument.defaultView,
      };

      context = new function() void (this.__proto__ = dom.window);

      if (notation) {
        try {
          code = "with (arguments[0]) { return (" + settled + ");}";
          context = new Function(code) (context);
          if (!context) {
            this.sendMessage("event/answer-completion", null);
            return;
          }
        } catch (e) { 
          this.sendMessage("event/answer-completion", null);
          return;
        }
      } else {
        current = settled;
      }

      // enumerate and gather properties.
      properties = [ key for (key in context) ];

      if (true) {
        // add own property names.
        if (null !== context && typeof context !== "undefined") {
          Array.prototype.push.apply(
            properties, 
            Object.getOwnPropertyNames(context.__proto__)
              .map(function(key) key));
        }
      }

      lower_current = current.toLowerCase();

      properties = properties.filter(function(key)
      {
        if ("." === notation ) {
          if ("number" === typeof key) {
            // Number property after dot notation. 
            // etc. abc.13, abc.3
            return false; 
          }
          if (!/^[$_a-zA-Z]+$/.test(key)) {
            // A property consists of identifier-chars after dot notation. 
            // etc. abc.ab[a cde.er=e
            return false; 
          }
        }
        return -1 !== String(key)
          .toLowerCase()
          .indexOf(lower_current);
      }).sort(function(lhs, rhs) 
      {
        return String(lhs).toLowerCase().indexOf(current) ? 1: -1;
      });
      if (0 === properties.lenth) {
        this.sendMessage("event/answer-completion", null);
        return;
      }
      autocomplete_result = {
        type: "text",
        query: current, 
        data: properties.map(function(key)
        {
          var value, type;

          try {
            value = context[key];
            type = typeof value;
          } catch (e) { }
          return {
            name: context && notation ?
              ("string" === typeof key) ?
                (/^\["?$/.test(notation)) ?
                  <>{key.replace('"', '\\"')}"]</>
                : ("[\'" === notation) ?
                  <>{key.replace("'", "\\'")}']</>
                : key
              : key
            : key,
            value: ("function" === type) ?
                  "[Function " + value.name + "] "
                 : ("object" === type) ? // may be null
                   String(value)
                 : ("undefined" === type) ?
                   "undefined"
                 : ("string" === type) ?
                   <>"{value.replace('"', '\\"')}"</>.toString() 
                 : String(value)
          };
        }),
      };
    }

    this.sendMessage("event/answer-completion", autocomplete_result);
  },

};


/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new JsCompleter(broker);
}

// EOF
