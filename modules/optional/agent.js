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
 *  @class Agent
 */
var Agent = new Class().extends(Plugin)
                       .depends("cursorstate");
Agent.definition = {

  id: "agent",

  getInfo: function getInfo()
  {
    return {
      name: _("Agent (BETA)"),
      description: _("Display agent."),
      version: "0.1b",
    };
  },

  getTemplate: function getTemplate()
  {
    return {
      parentNode: "#tanasinn_outer_chrome",
      tagName: "html:div",
      id: "tanasinn_agent_layer",
      //hidden: true,
      style: {
        display: "-moz-box",
        position: "absolute",
      },
      childNodes: [
        {
          tagName: "image",
          src: this.getAgentImagePath(),
          style: {
            position: "absolute",
            marginTop: "-130px",
            marginRight: "-120px",
            marginLeft: "600px",
          },
        },
        {
          tagName: "html:div",
          style: {
            display: "-moz-box",
            position: "absolute",
            marginTop: "-350px",
            marginRight: "-0px",
            marginLeft: "0px",
            fontFamily: "Arial Black,Cooper Black",
          },
          childNodes: {
            tagName: "html:div",
            style: "-moz-stack",
            childNodes: [
              {
                tagName: "image",
                src: this.getBalloonImagePath(),
                style: {
                  opacity: "0.85",
                },
              },
              {
                tagName: "html:div",
                style: {
                  display: "-moz-box",
                  MozBoxOrient: "vertical",
                  color: "lightblue",
                  textShadow: "1px 1px 5px black",
                },
                childNodes: [
                  {
                    tagName: "label",
                    style: {
                      marginTop: "100px",
                      marginLeft: "160px",
                      fontSize: "40px",
                    },
                    value: "Take it easy !!!!!!"
                  },
                  {
                    tagName: "box",
                    style: {
                      marginTop: "-5px",
                      marginLeft: "130px",
                      fontSize: "28px",
                    },
                    childNodes: [
                      {
                        tagName: "label",
                        id: "tanasinn_agent_message",
                        style: {
                          color: "#faa",
                        },
                        value: "",
                      },
                      {
                        tagName: "label",
                        style: {
                          color: "lightblue",
                        },
                        value: " is correct?",
                      },
                      {
                        tagName: "label",
                        style: {
                          color: "white",
                        },
                        value: "[",
                      },
                      {
                        tagName: "label",
                        style: {
                          color: "lightpink",
                        },
                        value: "n,y,a,e",
                      },
                      {
                        tagName: "label",
                        style: {
                          color: "white",
                        },
                        value: "]",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      ],
    };
  },

  "[persistable] enabled_when_startup": false,

  "[persistable] balloon_image_file": "images/balloon.svg",
  "[persistable] agent_image_file": "images/agent.svg",

  _element: null,

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    var result = this.request("command/construct-chrome", this.getTemplate());

    this._element = result.tanasinn_agent_layer;
    this._message = result.tanasinn_agent_message;
    this.onBeforeInput.enabled = true;
    this.onCorrect.enabled = true;
  },

  /** Uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
    if (this._element) {
      this._element.parentNode.removeChild(this._element);
    }

    this.onBeforeInput.enabled = false;
    this.onCorrect.enabled = false;
  },

  "[subscribe('event/before-input')]":
  function onBeforeInput(data)
  {
    this._element.hidden = true;
  },

  "[subscribe('sequence/osc/206')]":
  function onCorrect(data)
  {
    this._element.hidden = false;
    this._message.setAttribute("value", data);
  },

  getAgentImagePath: function getAgentImagePath()
  {
    var path = coUtils.Runtime.getRuntimePath() + "/" + this.agent_image_file,
        file = coUtils.File.getFileLeafFromVirtualPath(path);

    return coUtils.File.getURLSpec(file);
  },

  getBalloonImagePath: function getBalloonImagePath()
  {
    var path = coUtils.Runtime.getRuntimePath() + "/" + this.balloon_image_file,
        file = coUtils.File.getFileLeafFromVirtualPath(path);

    return coUtils.File.getURLSpec(file);
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


} // class Agent


/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new Agent(broker);
}

// EOF
