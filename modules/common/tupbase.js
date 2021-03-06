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
 * @class Trait
 */
function Trait()
{
  return this.initialize.apply(this, arguments);
}

Trait.prototype = {

  id: null,
  _definition: null,

  /** constructor */
  initialize: function initialize()
  {
  },

  /** @property {Object} prototype */
  get prototype()
  {
    return this._definition;
  },

  /** @property {Object} definition */
  get definition()
  {
    return this._definition;
  },

  set definition(value)
  {
    this.define(value);
  },

  /** define members.
   * @param {Object} definition.
   */
  define: function define(definition)
  {
    if (definition) {
      this._definition = definition;
    }
  },

  /* override */
  toString: function toString()  // override
  {
    return "[Trait " + this.id + "]";
  }

}; // class Trait


/**
 * @class AttributeContext
 */
function AttributeContext()
{
  return this.initialize.apply(this, arguments);
}
AttributeContext.prototype = {

  _target: null,
  _attributes_map: [], // static

  /** constructor */
  initialize: function initialize(target)
  {
    this._target = target;
  },

  get enabled()
  {
    this._target["enabled"] = true;
  },

  _: function __underscore(description)
  {
    this._target["description"] = _(description);
  },

  /** Parses and evaluate annotation string with default JS parser.
   *  @param {String} annotation A annotation string.
   */
  parse: function parse(annotation)
  {
    try {
      // push "this" into activation context and evaluate annotation string.
      new Function("with(arguments[0]) { return (" + annotation + ");}")(this);
    } catch(e) {
      coUtils.Debug.reportError(
        _("Failed to parse annotation string: '%s'."), annotation);
      throw e;
    }
  },

  /** Define new attribute.
   *  @param {String} id
   */
  define: function define(id, attribute)
  {
    // store attribute object with id string.
    this._attributes_map[id] = attribute;

    // define id in attribute context.
    this.__defineGetter__(
      id,
      function getter()
      {
        this._target[id] = [true];
        return function()
        {
          this._target[id] = Array.slice(arguments);
        }
      });
  },

  /** Return the information of this object */
  toString: function toString() // override
  {
    return "[AttributeContext]";
  },

}; // class AttributeContext

var ConceptContext = {

  "Object": function(value)
  {
    return "object" === typeof value;
  },

  "Array": function(value)
  {
    return Array.isArray(value);
  },

  "Action": function(value)
  {
    return "function" === typeof value
      || "undefined" === typeof value
      ;
  },

  "Uint16": function(value)
  {
    return "number" === typeof value
      && 0 <= value
      && value < (1 << 16)
      && 0 === value % 1
      ;
  },

  "Uint32": function(value)
  {
    return "number" === typeof value
      && 0 <= value
      && value < (1 << 32)
      && 0 === value % 1
      ;
  },

  "Char": function(value)
  {
    return "string" === typeof value && 1 === value.length;
  },

  "String": function(value)
  {
    return "string" === typeof value;
  },

  "Undefined": function(value)
  {
    return undefined === value;
  },

  "Boolean": function(value)
  {
    return true === value || false === value;
  },

}; // ConceptContext

/**
 * @class Prototype
 */
function Prototype(definition, base_class, dependency_list)
{
  var intercept,
      copy,
      decorated_key;

  /** Parses decorated key and sets attributes. */
  intercept = function intercept(key)
  {
    var match = key.match(/^([\w-@]+)$|^\[(.+)\]\s*(.*)\s*$/),
        annotation,
        name,
        attributes,
        target_attribute;

    if (!match) {
      throw coUtils.Debug.Exception(
        _("Ill-formed property name: '%s'."), key)
    }

    annotation = match[2];
    name = match[3];

    if (annotation) {
      if (!name)
        name = definition[key].name || coUtils.Uuid.generate().toString();
      if (!this.hasOwnProperty("__attributes")) {
        this.__attributes = {};
      }
      attributes = this.__attributes;
      target_attribute = attributes[name];
      if (!target_attribute) {
        attributes[name] = target_attribute = {};
      }
      new AttributeContext(target_attribute).parse(annotation);
      return name;
    }
    return key;
  };

  copy = function copy(definition, decorated_key, base_class)
  {
    var getter = definition.__lookupGetter__(decorated_key),
        setter = definition.__lookupSetter__(decorated_key),
        key,
        value;

    try {
      key = intercept.call(this, decorated_key);

      if (getter) { // has getter
        this.__defineGetter__(key, getter);
      }
      if (setter) { // has setter
        this.__defineSetter__(key, setter);
      }
      if (!getter && !setter) { // member variable or function
        value = definition[decorated_key];
        if ("initialize" === key && base_class && base_class.prototype.initialize) {
          // makes constructor chain.
          this.initialize = function initialize()
          {
            base_class.prototype.initialize.apply(this, arguments);
            value.apply(this, arguments);
          }
        } else {
          this[key] = value;
        }
      }
    } catch (e) {
      coUtils.Debug.reportError(e);
    }
  };

  for (decorated_key in definition) {
    copy.call(this, definition, decorated_key, base_class);
  }

  if (dependency_list) {
    this.__dependency = dependency_list.slice(0);
  }

  if (base_class) {
    // attribute chain.
    if (this.__attributes && base_class.prototype.__attributes) {
      this.__attributes.__proto__ = base_class.prototype.__attributes;
    }

    // prototype chain.
    this.__proto__ = base_class.prototype;
  }

}; // Prototype


/**
 * @constructor Class
 *
 * The meta class constructor in tupbase.
 *
 * example 1:
 * ----
 *
 * var A = new Class();
 *
 * ----
 *
 * It creates a new class constructor.
 *
 *
 * example 2:
 * ----
 *
 * var B = new Class().extends(A);
 *
 * ----
 *
 * It creates a new class constructor derived from class A.
 *
 *
 * example 3:
 * ----
 *
 * var C = new Class().extends(B).mix(Trait1).requires(Concept2);
 *
 * ----
 *
 * It creates a new class constructor derived from class B, mixed Trait1,
 * and requires Concept2.
 *
 *
 */
function Class()
{
  return this.initialize.apply(this, arguments);
}
Class.prototype = {

  _base: null,
  _dependency_list: null,
  _mixin_list: null,
  _concept_list: null,
  _defined: false,

  /** constructor
   * @param {Class} base_class A Class object.
   */
  initialize: function initialize()
  {
    var constructor;

    // initialize attribute lists.
    this._mixin_list = [];
    this._dependency_list = [];
    this._concept_list = [];

    constructor = function()
    {
      if (this.initialize) {
        return this.initialize.apply(this, arguments);
      }
      return this;
    };

    constructor.watch(
      "prototype",
      function(name, oldval, newval)
      {
        return this.applyDefinition(newval);
      });

    constructor.__proto__ = this;

    return constructor;
  },

  /** Makes it to be derived from base class.
   * @param {Class} base_class A Class object.
   */
  extends: function _extends(base_class)
  {
    this._base = base_class;
    this.prototype.__proto__ = base_class.prototype;
    return this;
  },

  /** Applys concept.
   * @param {String} name A Concept name string.
   */
  requires: function _requires(name)
  {
    var concept;

    if (!(name in ConceptContext)) {
      throw coUtils.Debug.Exception(
        _("Specified concept name '%s' is not defined."), name);
    }

    concept = ConceptContext[name];

    if (this._defined) {
      ConceptContext[name](this.definition);
    } else {
      this._concept_list.push(name);
    }
    return this;
  },

  /** Mixes specified trait.
   * @param {Trait} trait
   */
  mix: function mix(trait)
  {
    if (this._defined) {
      this.applyTrait(this.definition, new Prototype(trait.definition));
    } else {
      this._mixin_list.push(trait);
    }
    return this;
  },

  /** Stores a id to dependency_list. */
  depends: function depends(id)
  {
    this._dependency_list.push(id);
    return this;
  },

  /** @property definition
   *  It is same to "prototype" property.
   */
  get definition()
  {
    // returns prototype object.
    return this.prototype;
  },

  /** Stores a definition object as "prototype". */
  set definition(definition)
  {
    // set the argument to prototype object, and raise global event.
    this.prototype = definition;
  },

  /** The watcher method of "prototype" property.
   *  @param {Object} definition A definition object which is set to "prototype"
   *         property.
   *  @return {Object} New prototype object.
   */
  applyDefinition: function applyDefinition(definition)
  {
    var trait,
        concept_name,
        i = 0,
        mixin_list = this._mixin_list,
        concept_list = this._concept_list,
        prototype = new Prototype(
          definition,
          this._base,
          this._dependency_list);

    // Apply traits.
    for (; i < mixin_list.length; ++i) {
      trait = mixin_list[i];
      this.applyTrait(prototype, new Prototype(trait.prototype));
    }

    // Apply concepts.
    for (i = 0; i < concept_list.length; ++i) {
      concept_name = concept_list[i];
      if (!(concept_name in ConceptContext)) {
        throw coUtils.Debug.Exception(
          _("Specified concept name '%s' is not defined."), concept_name);
      }
      ConceptContext[concept_name](prototype);
    }

    this._defined = true;
    return prototype;
  },

  /** Apply specified Trait.
   *  @param {Object} prototype A prototype object.
   *  @param {Object} trait A trait object.
   */
  applyTrait: function applyTrait(prototype, trait)
  {
    var key,
        getter,
        setter,
        value,
        name,
        attribute,
        keys,
        i;

    for (key in trait) {
      // Detects whether the property specified by given key is
      // a getter or setter. NOTE that we should NOT access property
      // by ordinaly way, like "trait.<property-neme>".
      getter = trait.__lookupGetter__(key);
      setter = trait.__lookupSetter__(key);
      // if key is a getter method...
      if (getter) {
        prototype.__defineGetter__(key, getter);
      }
      // if key is a setter method...
      if (setter) {
        prototype.__defineSetter__(key, setter);
      }
      // if key is a generic property or method...
      if (!getter && !setter) {
        if ("initialize" === key && trait.initialize) {
          value = prototype.initialize;

          // makes constructor chain.
          prototype.initialize = function initialize()
          {
            trait.initialize.apply(this, arguments);
            value.apply(this, arguments);
          };
        } else if ("__attributes" === key) {
          if (prototype.__attributes) {
            keys = Object.keys(trait.__attributes);
            for (i = 0; i < keys.length; ++i) {
              name = keys[i];
              attribute = trait.__attributes[name];
              prototype.__attributes[name] = attribute;
            }
          } else {
            prototype.__attributes = trait.__attributes;
          }
        } else {
          prototype[key] = trait[key];
        }
      }
    }

  }, // applyTrait

  /** Load *.js files from specified directories.
   *  @param {String} search path
   */
  loadAttributes: function loadAttributes(search_path, scope)
  {
    var paths = coUtils.File.getFileEntriesFromSearchPath(search_path),
        entry,
        url,
        module_scope,
        i = 0;

    for (; i < paths.length; ++i) {

      entry = paths[i];

      module_scope = new function()
      {
      };

      module_scope.prototype = scope;

      try {
        // make URI string such as "file://....".
        url = coUtils.File.getURLSpec(entry);
        coUtils.Runtime.loadScript(url, module_scope);
        if (module_scope.main) {
          module_scope.main(this);
        } else {
          throw coUtils.Debug.Exception(
            _("Component scope symbol 'main' ",
              "required by module loader was not defined. \n",
              "file: '%s'."),
            url.split("/").pop());
        }
      } catch (e) {
        coUtils.Debug.reportError(e);
      }
    }
  }, // loadAttributes

};

/**
 * @constructor Abstruct
 */
function Abstruct()
{
  return this.initialize.apply(this, arguments);
}
Abstruct.prototype = {

  __proto__: Class.prototype,

  /** Enumerates stored traits and apply them. */
  applyDefinition: function applyDefinition(definition)
  {
    var prototype = new Prototype(definition, this._base, this._dependency_list),
        i = 0,
        trait,
        mixin_list = this._mixin_list;

    for (; i < mixin_list.length; ++i) {
      trait = mixin_list[i];
      this.applyTrait(prototype, new Prototype(trait.definition));
    }

    this._defined = true;

    return prototype;

  }, // applyDefinition

}; // Abstruct


/**
 * @abstruct Component
 * The base class of component node in tupbase2.
 */
var Component = new Abstruct();
Component.definition = {

  dependency: null,

  /** constructor */
  initialize: function initialize(broker)
  {
    var install_trigger;

    this._broker = broker;

    if (null !== this.__dependency) {
      this.dependency = {};
      if (this.__dependency.length > 0) {
        install_trigger = "initialized/{" + this.__dependency.join("&") + "}";
      } else {
        install_trigger = "@event/broker-started";
      }
      broker.subscribe(
        install_trigger,
        function onLoad()
        {
          var args = arguments,
              i = 0,
              dependency = this.__dependency,
              key;

          for (; i < dependency.length; ++i) {
            key = dependency[i];
            this.dependency[key] = args[i];
          }

          this.enabled = this.enabled_when_startup;
        },
        this);
    }

    broker.subscribe(
      "get/components",
      function getInstance(instances)
      {
        return this;
      }, this);
  },

  sendMessage: function sendMessage(topic, data)
  {
    var broker = this._broker;

    if (!broker) {
      coUtils.Debug.reportError(topic + " " + data.toSource());
    }
    return broker.notify(topic, data);
  },

  postMessage: function postMessage(topic, data)
  {
    var broker = this._broker;

    coUtils.Timer.setTimeout(
      function timerProc()
      {
        broker.notify(topic, data);
      }, 0)
  },

  request: function request(topic, data)
  {
    var broker = this._broker;

    return broker.callSync(topic, data);
  },

  getVariable: function getVariable(topic)
  {
    var broker = this._broker,
        result = broker.notify(topic),
        length = result.length;

    if (0 === length) {
      return null;
    }

    if (1 !== length) {
      coUtils.Debug.reportWarning(
        _("Too many subscriber is found: %s"),
        topic);
    }

    return result[0];
  },

  /** This method is expected to run test methods.
   *  It should return result information of test. */
  test: function test()
  {
    throw coUtils.Debug.Exception(_("Method 'test' is not implemented."))
  },

  /** Overrids text format expression. */
  toString: function toString()  // override
  {
    return String("[Component " + this.id + "]");
  }

}; // class Component


/**
 * @class Plugin
 * The plugin base class that inherits class "Molude".
 * It has "enabled" property and derived classes are expected to implements
 * following methods:
 *
 *  - function install(context)    Install itself.
 *  - function uninstall(context)  Uninstall itself.
 */
var Plugin = new Abstruct().extends(Component);
Plugin.definition = {

  __enabled: false,

//  "[persistable] enabled_when_startup": true,

  /** constructor */
  initialize: function initialize(broker)
  {
    function wait(span)
    {
      var end_time = Date.now() + span,
          current_thread = coUtils.Services.getThreadManager().currentThread;

      do {
        current_thread.processNextEvent(true);
      } while ((current_thread.hasPendingEvents()) || Date.now() < end_time);
    };

    broker.subscribe(
      "command/set-enabled/" + this.id,
      function setEnabled(value)
      {
        this.enabled = value;
      }, this);

    broker.subscribe(
      "@event/broker-stopping",
      function setDisabled()
      {
        coUtils.Timer.setTimeout(
          function timerProc()
          {
            this.enabled = false;
          }, 20000 * Math.random(), this);
      },
      this);
  },

  /**
   * @property {Boolean} enabled Boolean flag that indicates install/uninstall
   *                     state of plugin object.
   */
  getEnabled: function getEnabled()
  {
    return this.__enabled;
  },

  set enabled(flag)
  {
    var id = this.id,
        broker = this._broker,
        value = Boolean(flag);

    if (value !== this.__enabled) {
      if (value) {
        try {
          broker.notify("install/" + id, this.dependency);
        } catch (e) {
          coUtils.Debug.reportError(e);
          coUtils.Debug.reportError(
            _("Failed to enable plugin: %s"),
            this.id);
          throw e;
        }
        broker.notify("initialized/" + this.id, this);
      } else {
        broker.notify("uninstall/" + id);
      }
      this.__enabled = value;
      this.enabled_when_startup = value;
    }
  },

  /** Overrids toString */
  toString: function toString()
  {
    return "[Plugin " + this.id + "]";
  },

};   // class Plugin

/**
 * @class Attribute
 */
function Attribute()
{
  return this.initialize.apply(this, arguments);
}
Attribute.prototype = {

  __proto__: Trait.prototype,

  /** constructor */
  initialize: function initialize(id)
  {
    AttributeContext.prototype.define(id, this);
  },

  toString: function toString()
  {
    return "[Attribute]";
  },

}; // Attribute

Component.loadAttributes(
  ["modules/attributes"],
  {
    ConceptContext: ConceptContext,
    Attribute: Attribute,
    coUtils: coUtils,
    _: _,
  });

/**
 * @class Concept
 */
function Concept()
{
  return this.initialize.apply(this, arguments);
}
Concept.prototype = {

  __proto__: Trait.prototype,

  /** constructor */
  initialize: function initialize(broker)
  {
  },

  /** */
  check: function check(target)
  {
    var attributes = target.__attributes,
        subscribers = Object
      .getOwnPropertyNames(attributes)
      .reduce(function(map, key) {
        var value = attributes[key],
            tokens,
            i,
            k;
        if (value.subscribe) {
          tokens = value.subscribe.toString().split("/");
          for (i = 0; i < tokens.length; ++i) {
            k = tokens.slice(0, i + 1).join("/");
            map[k] = value;
          }
        }
        return map;
      }, {});

    this._checkImpl(target, subscribers);
    return true;

  }, // check;

  _checkImpl: function _checkImpl(target, subscribers)
  {
    var definition = this._definition,
        rules = Object.keys(definition),
        rule,
        getter,
        setter,
        match,
        message,
        identifier,
        type,
        key,
        i;

    for (i = 0; i < rules.length; ++i) {
      rule = rules[i];
      if ("id" === rule) {
        continue;
      }
      getter = definition.__lookupGetter__(rule);
      setter = definition.__lookupSetter__(rule);
      if (!getter && !setter) {
        match = rule.match(/^(?:<(.+?)>|(.+?)) :: (.+)$/);
        if (null === match) {
          throw coUtils.Debug.Exception(
            _("Ill-formed concept rule expression is specified: %s."),
            rule);
        }

        message = match[1];
        identifier = match[2];
        type = match[3];

        if (message) {
          key = message.replace(/\/\*$/, "");
          if (undefined === subscribers[key]) {
            throw coUtils.Debug.Exception(
              _("Component '%s' does not implement required ",
                "message-concept: %s."),
              target.id, rule);
          }
          if (subscribers[key].type) {
            if (type !== subscribers[key].type.toString()) {
              throw coUtils.Debug.Exception(
                _("Component '%s' does not implement required ",
                  "message-concept: %s. - ill-typed."),
                target.id, rule);
            }
          }
          subscribers[key].description = definition[rule];
        }

        if (identifier) {
          getter = target.__lookupGetter__(rule);
          setter = target.__lookupSetter__(rule);

          if (!getter && !setter && undefined === target[identifier]) {
            throw coUtils.Debug.Exception(
              _("Component '%s' does not implement required ",
                "signature-concept: %s."),
              target.id, rule);

            if (target[message].type) {
              if (type !== subscribers[message].type.toString()) {
                throw coUtils.Debug.Exception(
                  _("Component '%s' does not implement required ",
                    "signature-concept: %s - ill-typed."),
                  target.id, rule);
              }
            }
            target[message].description = definition[rule];
          }
        }
      }
    }
  }, // _checkImpl

  /** define members.
   * @param {Object} definition.
   */
  define: function define(definition) // definition
  {
    var self = this;

    ConceptContext[definition.id] = function(target)
    {
      return self.check(target);
    };
    this._definition = definition;
  },

  /** override */
  toString: function toString()
  {
    return "[Trait Concept]";
  },

}; // Concept

/**
 * @concept CompletionContextConcept
 */
var CompletionContextConcept = new Concept();
CompletionContextConcept.definition = {

  id: "CompletionContext",

}; // CompletionContextConcept


/**
 * @concept CompleterConcept
 */
var CompleterConcept = new Concept();
CompleterConcept.definition = {

  id: "Completer",

  // signature concept
  "<command/query-completion/*> :: CompletionContext -> Undefined":
  _("Allocates n cells at once."),

}; // CompleterConcept

// EOF
