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
 * @class Scrollbar
 * @brief Shows scrollbar interface.
 */
var Scrollbar = new Class().extends(Plugin);
Scrollbar.definition = {

  id: "scrollbar",

  /** plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("Scroll Bar"),
      version: "0.1",
      description: _("Shows scrollbar interface.")
    };
  },

  "[persistable] enabled_when_startup": true,

  "[persistable] active_opacity": 0.3,
  "[persistable] inner_width": 24,
  "[persistable] border_width": 4,
  "[persistable] transition_duration": 500,
  "[persistable] color": "white",
  "[persistable] background_color": "white",

  /** provides UI template */
  getTemplate: function getTemplate()
  {
    return {
      parentNode: "#tanasinn_content",
      tagName: "vbox",
      id: "tanasinn_scrollbar_overlay",
      align: "right",
      childNodes: {
        tagName: "vbox",
        flex: 1,
        id: "tanasinn_scrollbar",
        style: {
          opacity: "0.00",
          transitionProperty: "opacity",
          transitionDuration: this.transition_duration + "ms",
          borderRadius: (this.inner_width + this.border_width * 2) + "px",
          border: this.border_width + "px solid " + this.color,
          width: (this.inner_width + this.border_width * 2) + "px",
          margin: "8px",
          height: "100%",
        },
        childNodes: [
          {
            tagName: "box",
            id: "tanasinn_scrollbar_before",
            listener: [
              {
                type: "click",
                context: this,
                handler: function onclick(event)
                {
                  var before_position = Number(this._before.flex);

                  event.stopPropagation();
                  this.changePosition(before_position - 10);
                }
              },
            ],
          },
          {
            tagName: "box",
            id: "tanasinn_scrollbar_current",
            height: this.inner_width * 2,
            style: {
              borderRadius: (this.inner_width / 2) + "px",
              backgroundColor: this.color,
            },
          },
          {
            tagName: "box",
            id: "tanasinn_scrollbar_after",
            listener: {
              type: "click",
              context: this,
              handler: function onclick(event)
              {
                var before_position = Number(this._before.flex);

                event.stopPropagation();
                this.changePosition(before_position + 10);
              },
            },
          },
        ],
      },
    };
  },

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    var result = this.request("command/construct-chrome", this.getTemplate());

    this._scrollbar_overlay = result.tanasinn_scrollbar_overlay;
    this._scrollbar = result.tanasinn_scrollbar;
    this._before = result.tanasinn_scrollbar_before;
    this._current = result.tanasinn_scrollbar_current;
    this._after = result.tanasinn_scrollbar_after;
  },

  /** Unnstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
    // remove scrollbar element
    if (null !== this._scrollbar_overlay) {
      this._scrollbar_overlay.parentNode.removeChild(this._scrollbar_overlay);
      this._scrollbar_overlay = null;
    }
    this._scrollbar = null;
    this._before = null;
    this._current = null;
    this._after = null;
  },

  "[subscribe('command/scrollbar-hide'), pnp]":
  function onScrollbarHide()
  {
    if (this._scrollbar_overlay) {
      this._scrollbar_overlay.hidden = true;
    }
  },

  "[subscribe('command/scrollbar-show'), pnp]":
  function onScrollbarShow()
  {
    if (this._scrollbar_overlay) {
      this._scrollbar_overlay.hidden = false;
    }
  },

  changePosition: function changePosition(position)
  {
    var before_position = Number(this._before.flex),
        after_position = Number(this._after.flex),
        min_position = 0,
        max_position = before_position + after_position;

    if (position < min_position) {
      position = min_position;
    } else if (position > max_position) {
      position = max_position;
    }

    if (position !== before_position) {
      this.sendMessage("command/set-scroll-position", position);
      this.sendMessage("command/draw");
    }
  },

  "[subscribe('event/scroll-position-changed'), pnp]":
  function onScrollPositionChanged(scroll_info)
  {
    var scrollbar = this._scrollbar,
        before = this._before,
        current = this._current,
        after = this._after;

    if (0 === Number(scrollbar.style.opacity)) {
      scrollbar.style.opacity = this.active_opacity;
    }
    before.flex = scroll_info.start;
    current.flex = scroll_info.end - scroll_info.start;
    after.flex = scroll_info.size - scroll_info.end;
    if (0 === Number(after.flex) && !this._dragging) {
      if (0.00 !== Number(scrollbar.style.opacity)) {
        scrollbar.style.opacity = 0.00;
      }
    }
  },

  "[listen('dblclick', '#tanasinn_scrollbar'), pnp]":
  function ondblclick(event)
  {
    event.stopPropagation();
  },

  "[listen('mouseover', '#tanasinn_scrollbar'), pnp]":
  function onmouseover(event)
  {
    var scrollbar = this._scrollbar;

    if (0 === Number(this._after.flex) &&
        0 === Number(scrollbar.style.opacity)) {
      this.sendMessage("command/update-scroll-information");
      scrollbar.style.opacity = this.active_opacity;
    }
  },

  "[listen('mouseout', '#tanasinn_scrollbar'), pnp]":
  function onmouseout(event)
  {
    var scrollbar = this._scrollbar;

    if (0 === Number(this._after.flex) &&
        !this._dragging &&
        0.00 !== scrollbar.style.opacity) {
      scrollbar.style.opacity = 0.00;
    }
  },

  "[listen('dragstart', '#tanasinn_scrollbar'), pnp]":
  function ondragstart_scrollbar(event)
  {
    event.stopPropagation();
  },

  "[listen('dragstart', '#tanasinn_scrollbar_current'), pnp]":
  function ondragstart(dom_event)
  {
    var initial_y,
        dom_document,
        radius,
        height,
        before_flex,
        current_flex,
        after_flex,
        flex,
        flex_per_height,
        initial_view_top;

    this._dragging = true;
    dom_event.stopPropagation();
    //dom_event.preventDefault();

    initial_y = dom_event.screenY;
    dom_document = this.request("get/root-element").ownerDocument; // managed by DOM

    radius = this.inner_width + this.border_width;
    height = this._scrollbar.boxObject.height - radius * 2;

    before_flex = Number(this._before.flex);
    current_flex = Number(this._current.flex);

    after_flex = Number(this._after.flex);

    flex = before_flex + current_flex + after_flex;
    flex_per_height = flex / height;
    initial_view_top = before_flex;

    // register mousemove listener.
    this.sendMessage(
      "command/add-domlistener",
      {
        type: "mousemove",
        id: "_DRAGGING",
        target: dom_document,
        context: this,
        handler: function onmousemove(event)
        {
          var delta,
              position;

          delta = event.screenY - initial_y;
          position = Math.round(initial_view_top + flex * delta / height);
          this.changePosition(position);
        },
      });

    // register mouseup listener.
    this.sendMessage(
      "command/add-domlistener",
      {
        type: "mouseup",
        id: "_DRAGGING",
        target: dom_document,
        capture: true,
        context: this,
        handler: function onmouseup(event)
        {
          this._dragging = false;
          this.sendMessage("command/remove-domlistener", "_DRAGGING");
          if (0 === Number(this._after.flex)) {
            this._scrollbar.style.opacity = 0.00;
          }
        },
      });

    // to prevent leak.
    dom_document = null;
    dom_event = null;
  },

  /** test */
  "[test]":
  function()
  {
    var enabled = this.enabled;

    //try {
    //  this.enabled = false;
    //  this.enabled = true;
    //  this.enabled = false;
    //} finally {
    //  this.enabled = enabled;
    //}
  },


} // class Scrollbar

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new Scrollbar(broker);
}

// EOF
