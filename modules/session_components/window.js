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

/** @file Window
 *
 */

/**
 * @class WindowWatcher
 *
 */
var WindowWatcher = new Class().extends(Plugin);
WindowWatcher.definition = {

  get id()
    "windowwatcher",

  get info()
    <module>
        <name>{_("Window watcher")}</name>
        <version>0.1</version>
        <description>{
          _("Handler window events.")
        }</description>
    </module>,

  "[persistable] enabled_when_startup": true,

  /** Installs itself. 
   *  @param {Broker} a broker object.
   */
  "[install]":
  function install(broker)
  {
  },

  /** Uninstalls itself. 
   *  @param {Broker} a broker object.
   */
  "[uninstall]":
  function uninstall(broker)
  {
  },

  /** publish ratate gesture event message 
   *
   * @param event {Event} An gesture event object.
   *
   */
  "[listen('MozRotateGesture', undefined, true), pnp]":
  function onRotateGesture(event) 
  {
    var origninal_target, relation;

    original_target = event.explicitOriginalTarget;

    relation = this.request("get/root-element")
      .compareDocumentPosition(original_target);

    if ((relation & original_target.DOCUMENT_POSITION_CONTAINED_BY)) {
      event.preventDefault();
      event.stopPropagation();

      this.sendMessage("event/rotate-gesture", event.direction);

      event.direction = 0;
    }
  },

  /** publish swipe gesture event message 
   *
   * @param event {Event} An gesture event object.
   *
   */
  "[listen('MozSwipeGesture', undefined, true), pnp]":
  function onSwipeGesture(event) 
  {
    var origninal_target, relation;

    event.preventDefault();
    event.stopPropagation();

    original_target = event.explicitOriginalTarget;

    relation = this.request("get/root-element")
      .compareDocumentPosition(original_target);

    if ((relation & original_target.DOCUMENT_POSITION_CONTAINED_BY)) {
      this.sendMessage("event/swipe-gesture", event.direction);
    }
    event.direction = 0;
  },

  /** publish magnify gesture event message 
   *
   * @param event {Event} An gesture event object.
   *
   */
  "[listen('MozMagnifyGesture', undefined, true), pnp]":
  function onMagnifyGesture(event) 
  {
    var origninal_target, relation;

    original_target = event.explicitOriginalTarget;

    relation = this.request("get/root-element")
      .compareDocumentPosition(original_target);

    if ((relation & original_target.DOCUMENT_POSITION_CONTAINED_BY)) {

      this.sendMessage("event/magnify-gesture", event.delta);

      event.preventDefault();
      event.stopPropagation();
      event.direction = 0;
    }
  },
  
  /** Handles window resize event. 
   *
   * @param event {Event} An resize event object.
   *
   */
  "[listen('resize', undefined, true), pnp]":
  function onresize(event) 
  {
    this.sendMessage("event/window-resized", event);
  },

  /** Handles window close event. 
   *
   * @param event {Event} An resize event object.
   *
   */
  "[listen('close'), pnp]":
  function onclose(event) 
  {
    this.sendMessage("event/window-closing", event);
  }

};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new WindowWatcher(broker);
}

// EOF
