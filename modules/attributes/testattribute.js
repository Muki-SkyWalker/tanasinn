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

function make_managed_handler(self, handler)
{
  var wrapped_handler = function()
  {
    return handler.apply(self, arguments);
  };

  return wrapped_handler;
}

function apply_attribute(self, broker, key, expressions, attribute)
{
  var handler = self[key],
      id = self.id + "." + key,
      wrapped_handler;

  if (handler.id) {
    wrapped_handler = handler;
  } else {
    wrapped_handler = make_managed_handler(self, handler);
    wrapped_handler.id = id;
    self[key] = wrapped_handler;
  }
  wrapped_handler.description = attribute.description;
  wrapped_handler.expressions = expressions;

  broker.subscribe("get/tests",
                   function get()
                   {
                     return {
                       id: self.id + "." + wrapped_handler.expressions,
                       summary: wrapped_handler.description,
                       func: wrapped_handler,
                     };
                   });

}

/**
 * @Attribute TestAttribute
 *
 */
var TestAttribute = new Attribute("test");
TestAttribute.definition = {

  /** constructor
   *  @param {EventBroker} broker Parent broker object.
   */
  initialize: function initialize(broker)
  {
    var attributes,
        key,
        attribute,
        expressions;

    attributes = this.__attributes;

    for (key in attributes) {
      attribute = attributes[key];
      expressions = attribute["test"];

      if (!expressions) {
        continue;
      }

      apply_attribute(this,
                      broker,
                      key,
                      expressions,
                      attribute);
    }
  },
}; // TestAttribute

/**
 * @fn main
 * @brief Module entry point
 * @param {target_class} target_class The Class object.
 */
function main(target_class)
{
  target_class.mix(TestAttribute);
}


// EOF
