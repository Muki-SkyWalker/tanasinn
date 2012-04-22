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

const CO_XTERM_256_COLOR_PROFILE = [
  /* 0       */ "#000000", // black
  /* 1       */ "#cd9988", // red
  /* 2       */ "#44cd44", // green
  /* 3       */ "#cdcd88", // yellow
  /* 4       */ "#8899ef", // blue
  /* 5       */ "#cd88cd", // magenta
  /* 6       */ "#66cdcd", // cyan
  /* 7       */ "#e5e5e5", // white
  /* 8       */ "#7f7f7f", // blight black
  /* 9       */ "#ff0000", // blight red
  /* 10      */ "#00ff00", // blight green
  /* 11      */ "#ffff00", // blight yellow
  /* 12      */ "#5c5cff", // blight blue
  /* 13      */ "#ff00ff", // blight magenta
  /* 14      */ "#00ffff", // blight cyan
  /* 15      */ "#ffffff", // blight white
  /* 16 -19  */ "#000000", "#00005f", "#000087", "#0000af", 
  /* 20 -23  */ "#0000d7", "#0000ff", "#005f00", "#005f5f",
  /* 24 -27  */ "#005f87", "#005faf", "#005fd7", "#005fff", 
  /* 28 -31  */ "#008700", "#00875f", "#008787", "#0087af",
  /* 32 -35  */ "#0087d7", "#0087ff", "#00af00", "#00af5f", 
  /* 36 -39  */ "#00af87", "#00afaf", "#00afd7", "#00afff",
  /* 40 -43  */ "#00d700", "#00d75f", "#00d787", "#00d7af", 
  /* 44 -47  */ "#00d7d7", "#00d7ff", "#00ff00", "#00ff5f",
  /* 48 -51  */ "#00ff87", "#00ffaf", "#00ffd7", "#00ffff", 
  /* 52 -55  */ "#5f0000", "#5f005f", "#5f0087", "#5f00af",
  /* 56 -59  */ "#5f00d7", "#5f00ff", "#5f5f00", "#5f5f5f", 
  /* 60 -63  */ "#5f5f87", "#5f5faf", "#5f5fd7", "#5f5fff",
  /* 64 -67  */ "#5f8700", "#5f875f", "#5f8787", "#5f87af", 
  /* 68 -71  */ "#5f87d7", "#5f87ff", "#5faf00", "#5faf5f",
  /* 72 -75  */ "#5faf87", "#5fafaf", "#5fafd7", "#5fafff", 
  /* 76 -79  */ "#5fd700", "#5fd75f", "#5fd787", "#5fd7af",
  /* 80 -83  */ "#5fd7d7", "#5fd7ff", "#5fff00", "#5fff5f", 
  /* 84 -87  */ "#5fff87", "#5fffaf", "#5fffd7", "#5fffff",
  /* 88 -91  */ "#870000", "#87005f", "#870087", "#8700af", 
  /* 92 -95  */ "#8700d7", "#8700ff", "#875f00", "#875f5f",
  /* 96 -99  */ "#875f87", "#875faf", "#875fd7", "#875fff", 
  /* 100-103 */ "#878700", "#87875f", "#878787", "#8787af",
  /* 104-107 */ "#8787d7", "#8787ff", "#87af00", "#87af5f", 
  /* 108-111 */ "#87af87", "#87afaf", "#87afd7", "#87afff",
  /* 112-115 */ "#87d700", "#87d75f", "#87d787", "#87d7af", 
  /* 116-119 */ "#87d7d7", "#87d7ff", "#87ff00", "#87ff5f",
  /* 120-123 */ "#87ff87", "#87ffaf", "#87ffd7", "#87ffff", 
  /* 124-127 */ "#af0000", "#af005f", "#af0087", "#af00af",
  /* 128-131 */ "#af00d7", "#af00ff", "#af5f00", "#af5f5f", 
  /* 132-135 */ "#af5f87", "#af5faf", "#af5fd7", "#af5fff",
  /* 136-139 */ "#af8700", "#af875f", "#af8787", "#af87af", 
  /* 140-143 */ "#af87d7", "#af87ff", "#afaf00", "#afaf5f",
  /* 144-147 */ "#afaf87", "#afafaf", "#afafd7", "#afafff",
  /* 148-151 */ "#afd700", "#afd75f", "#afd787", "#afd7af",
  /* 152-155 */ "#afd7d7", "#afd7ff", "#afff00", "#afff5f", 
  /* 156-159 */ "#afff87", "#afffaf", "#afffd7", "#afffff",
  /* 160-163 */ "#d70000", "#d7005f", "#d70087", "#d700af", 
  /* 164-167 */ "#d700d7", "#d700ff", "#d75f00", "#d75f5f",
  /* 168-171 */ "#d75f87", "#d75faf", "#d75fd7", "#d75fff", 
  /* 172-175 */ "#d78700", "#d7875f", "#d78787", "#d787af",
  /* 176-179 */ "#d787d7", "#d787ff", "#d7af00", "#d7af5f", 
  /* 180-183 */ "#d7af87", "#d7afaf", "#d7afd7", "#d7afff",
  /* 184-187 */ "#d7d700", "#d7d75f", "#d7d787", "#d7d7af", 
  /* 188-191 */ "#d7d7d7", "#d7d7ff", "#d7ff00", "#d7ff5f",
  /* 192-195 */ "#d7ff87", "#d7ffaf", "#d7ffd7", "#d7ffff", 
  /* 196-199 */ "#ff0000", "#ff005f", "#ff0087", "#ff00af",
  /* 200-203 */ "#ff00d7", "#ff00ff", "#ff5f00", "#ff5f5f", 
  /* 204-207 */ "#ff5f87", "#ff5faf", "#ff5fd7", "#ff5fff",
  /* 208-211 */ "#ff8700", "#ff875f", "#ff8787", "#ff87af", 
  /* 212-215 */ "#ff87d7", "#ff87ff", "#ffaf00", "#ffaf5f",
  /* 216-219 */ "#ffaf87", "#ffafaf", "#ffafd7", "#ffafff", 
  /* 220-223 */ "#ffd700", "#ffd75f", "#ffd787", "#ffd7af",
  /* 224-227 */ "#ffd7d7", "#ffd7ff", "#ffff00", "#ffff5f", 
  /* 228-231 */ "#ffff87", "#ffffaf", "#ffffd7", "#ffffff",
  /* 232-235 */ "#080808", "#121212", "#1c1c1c", "#262626", 
  /* 236-239 */ "#303030", "#3a3a3a", "#444444", "#4e4e4e",
  /* 240-243 */ "#585858", "#626262", "#6c6c6c", "#767676", 
  /* 244-247 */ "#808080", "#8a8a8a", "#949494", "#9e9e9e",
  /* 248-251 */ "#a8a8a8", "#b2b2b2", "#bcbcbc", "#c6c6c6", 
  /* 252-255 */ "#d0d0d0", "#dadada", "#e4e4e4", "#eeeeee"
]; // CO_XTERM_256_COLOR_PROFILE

//////////////////////////////////////////////////////////////////////////////
//
// Concepts
//

/**
 * @Concept PersistentConcept
 *
 */
let PersistentConcept = new Concept();
PersistentConcept.definition = {

  get id()
    "PersistentConcept",

  "<@command/backup> :: Object -> Undefined": 
  _("Serialize and persist current state."),

  "<@command/restore> :: Object -> Undefined": 
  _("Deserialize and restore stored state."),

}; // concept PersistentConcept

/**
 * @trait PersistentTrait
 */
let PersistentTrait = new Trait();
PersistentTrait.definition = {

  /**
   * Serialize snd persist current state.
   */
  "[subscribe('@command/backup'), type('Object -> Undefined')]": 
  function backup(context) 
  {
    let broker = this._broker;
    context[this.id] = {
      line_height: this.line_height,
      font_family: this.font_family,
      font_size: this.font_size,
      force_precious_rendering: this.force_precious_rendering,
      reverse: this.reverse,
      color: this.color,
    };
    let path = broker.runtime_path 
             + "/persist/" 
             + broker.request_id 
             + ".png";
    let file = coUtils.File.getFileLeafFromVirtualPath(path);
    coUtils.IO.saveCanvas(this._source_canvas, file, true);
  },

  /**
   * Deserialize snd restore stored state.
   */
  "[subscribe('@command/restore'), type('Object -> Undefined')]": 
  function restore(context) 
  {
    let data = context[this.id];
    if (data) {
      this.force_monospace_rendering = data.force_precious_rendering;
      this.line_height = data.line_height;
      this.font_family = data.font_family;
      this.font_size = data.font_size;
      this._reverse = data.reverse;
      this.color = data.color;
      let broker = this._broker;
      broker.notify("command/draw");
    } else {
      coUtils.Debug.reportWarning(
        _("Cannot restore last state of renderer: data not found."));
    }
  },

}; // trait PersistentTrait

/**
 * @trait SlowBlinkTrait
 */
let SlowBlinkTrait = new Trait();
SlowBlinkTrait.definition = {

  /**
   *
   */
  createSlowBlinkLayer: function createSlowBlinkLayer()
  {
    let broker = this._broker;
    this._slow_blink_layer = new Layer(broker);
    this._slow_blink_layer.canvas.width = this._main_layer.canvas.width;
    this._slow_blink_layer.canvas.height = this._main_layer.canvas.height;
    coUtils.Timer.setTimeout(function() {
      this._slow_blink_layer.canvas.style.opacity 
        = 1 - this._slow_blink_layer.canvas.style.opacity;
      if (this._slow_blink_layer) {
        coUtils.Timer.setTimeout(arguments.callee, this.slow_blink_interval, this);
      }
    }, this.slow_blink_interval, this);

  }, // createSlowBlinkLayer

}; // SlowBlinkTrait

/**
 * @trait RapidBlinkTrait
 */
let RapidBlinkTrait = new Trait();
RapidBlinkTrait.definition = {

  /**
   * 
   */
  createRapidBlinkLayer: function createRapidBlinkLayer()
  {
    let broker = this._broker;
    this._rapid_blink_layer = new Layer(broker);
    this._rapid_blink_layer.canvas.width = this._main_layer.canvas.width;
    this._rapid_blink_layer.canvas.height = this._main_layer.canvas.height;

    coUtils.Timer.setTimeout(function() {
      this._rapid_blink_layer.canvas.style.opacity 
        = 1 - this._rapid_blink_layer.canvas.style.opacity;
      if (this._rapid_blink_layer) {
        coUtils.Timer.setTimeout(arguments.callee, this.rapid_blink_interval, this);
      }
    }, this.rapid_blink_interval, this);

  }, // createRapidBlinkLayer

}; // RapidBlinkTrait


/**
 * @trait ReverseVideoTrait
 */
let ReverseVideoTrait = new Trait();
ReverseVideoTrait.definition = {

  _reverse: false,

  "[subscribe('command/reverse-video'), enabled]": 
  function reverseVideo(value) 
  {
    if (this._reverse != value) {
      this._reverse = value;
      let maps = [this.color, this.color, this.color];
      for (let [, map] in Iterator(maps)) {
        for (let i = 0; i < map.length; ++i) {
          let value = (parseInt(map[i].substr(1), 16) ^ 0x1ffffff)
            .toString(16)
            .replace(/^1/, "#");
          map[i] = value;
        }
      }
      let broker = this._broker;
      broker.notify("command/draw", true);
    }
  },

}; // ReverseVideoTrait


/**
 * @trait DRCSStateTrait
 */
let DRCSStateTrait = new Trait();
DRCSStateTrait.definition = {

  _drcs_state: null, 

  "[subscribe('event/drcs-state-changed/g0')]": 
  function onDRCSStateChangedG0(state) 
  {
    if (state) {
      this._drcs_state = state;
    }
  },

  "[subscribe('event/drcs-state-changed/g1')]": 
  function onDRCSStateChangedG1(state) 
  {
    if (state) {
      this._drcs_state = state;
    }
  },

}; // DRCSStateTrait


/**
 * @trait PalletManagerTrait
 */
let PalletManagerTrait = new Trait();
PalletManagerTrait.definition = {
  
  // color map (index No. is spacified by SGR escape sequences)
  
  /** color map for Normal characters. */
  "[watchable, persistable] color": CO_XTERM_256_COLOR_PROFILE.slice(0),       

  _reverse: false,

  "[subscribe('sequence/osc/4'), enabled]": 
  function changeColor(value) 
  {
    let [number, spec] = value.split(";");

    let pattern = /^(\?)$|^#([0-9a-fA-F]{6})$|rgb:([0-9a-fA-F]{2})\/([0-9a-fA-F]{2})\/([0-9a-fA-F]{2})$|rgb:([0-9a-fA-F]{4})\/([0-9a-fA-F]{4})\/([0-9a-fA-F]{4})$/;
    let match = spec.match(pattern);
    let [query, rgb, r2, g2, b2, r4, g4, b4] = match;
    if ("?" == spec) {
      let broker = this._broker;
      let rgb = this.color[number];
      let message = "4" + number + ";" + rgb;
      broker.notify("command/send-to-tty", message);
    } else if (r2) {

    } else if (r4) {

    } else {
      coUtils.Debug.reportError(_("Invalid spec string: %s."), spec);
    }
  },

}; // PalletManagerTrait


/**
 * @class Layer
 */
let Layer = new Class();
Layer.definition = {

  canvas: null,
  context: null,

  get width()
  {
    return this.canvas.width;
  },

  set width(value)
  {
    this.canvas.width = value;
  },

  get height()
  {
    return this.canvas.height;
  },

  set height(value)
  {
    this.canvas.height = value;
  },

  get smoothing()
  {
    return this.context.mozImageSmoothingEnabled;
  },

  set smoothing(value)
  {
    this.context.mozImageSmoothingEnabled = value;
  },

  /** Constructor */
  initialize: function initialize(broker) 
  {
    let { canvas } = broker.uniget(
      "command/construct-chrome", 
      {
        parentNode: "#tanasinn_center_area",
        tagName: "html:canvas",
        id: "canvas",
      });

    this.canvas = canvas;
    this.context = canvas.getContext("2d");
  },

  /** Release and destroy DOM resources. */
  destroy: function destroy()
  {
    this.canvas.parentNode.removeChild(this.canvas);
    this.canvas = null;
    this.context = null;
  },

}; // class Layer


/** 
 * @class Renderer
 * @brief Scan screen state and render it to canvas element.
 */ 
let Renderer = new Class().extends(Plugin)
                          .mix(PersistentTrait)
                          .mix(SlowBlinkTrait)
                          .mix(RapidBlinkTrait)
                          .mix(ReverseVideoTrait)
                          .mix(DRCSStateTrait)
                          .mix(PalletManagerTrait)
                          .depends("screen")
                          .requires("PersistentConcept");
Renderer.definition = {

  get id()
    "renderer",

  get info()
    <plugin>
        <name>{_("Renderer")}</name>
        <description>{
          _("Handles draw event and render output data to main canvas.")
        }</description>
        <version>0.2.0</version>
    </plugin>,

  "[persistable] enabled_when_startup": true,

  _context: null,
  _canvas: null,

  // cell geometry (in pixel)
  "[watchable, persistable] line_height": 16,
  "[watchable] char_width": 6.5, 
  "[watchable] char_height": 4, 
  "[watchable] char_offset": 11, 
  "[persistable] slow_blink_interval": 800, 
  "[persistable] rapid_blink_interval": 400, 

  _text_offset: 10, 

  _offset: 0,

  _slow_blink_layer: null,
  _rapid_blink_layer: null,

  // font
  "[watchable, persistable] font_family": 
    "Monaco,Menlo,Lucida Console,monospace",

  "[watchable, persistable] font_size": 14,

  "[persistable] force_precious_rendering": false,
  "[persistable] normal_alpha": 0.80,
  "[persistable] halfbright_alpha": 0.40,
  "[persistable] bold_alpha": 1.00,
  "[persistable] bold_as_blur": false,
//  "[persistable] enable_text_shadow": false,
//  "[persistable] enable_render_bold_as_textshadow": false,
  "[persistable] shadow_color": "white",
  "[persistable] shadow_offset_x": 0.50,
  "[persistable] shadow_offset_y": 0.00,
  "[persistable] shadow_blur": 0.50,
  "[persistable] transparent_color": 0,
  "[persistable, watchable] smoothing": true,

  /** Installs itself.
   *  @param broker {Broker} A broker object.
   */
  "[subscribe('install/renderer'), enabled]":
  function install(broker) 
  {
    this._main_layer = new Layer(broker);

    // set smoothing configuration
    this._main_layer.smoothing = this.smoothing;

    this._calculateGlyphSize();
    this.onWidthChanged();
    this.onHeightChanged();

    this.onWidthChanged.enabled = true;
    this.onHeightChanged.enabled = true;
    this.onFontChanged.enabled = true;
    this.setFontSize.enabled = true;
    this.setFontFamily.enabled = true;
    this.changeFontSizeByOffset.enabled = true;
    this.draw.enabled = true;
    this.backup.enabled = true;
    this.restore.enabled = true;
    this.captureScreen.enabled = true;
    this.onDRCSStateChangedG0.enabled = true;
    this.onDRCSStateChangedG1.enabled = true;
  },

  /** Uninstalls itself.
   *  @param broker {Broker} A Broker object.
   */
  "[subscribe('uninstall/renderer'), enabled]":
  function uninstall(broker) 
  {
    this.onWidthChanged.enabled = false;
    this.onHeightChanged.enabled = false;
    this.onFontChanged.enabled = false;
    this.setFontSize.enabled = false;
    this.setFontFamily.enabled = false;
    this.changeFontSizeByOffset.enabled = false;
    this.draw.enabled = false;
    this.backup.enabled = false;
    this.restore.enabled = false;
    this.captureScreen.enabled = false;
    this.onDRCSStateChangedG0.enabled = false;
    this.onDRCSStateChangedG1.enabled = false;

    this._main_layer.destroy();
    this._main_layer = null;

    if (this._slow_blink_layer) {
      this._slow_blink_layer.destroy();
      this._slow_blink_layer = null;
    }

    if (this._rapid_blink_layer) {
      this._rapid_blink_layer.destroy();
      this._rapid_blink_layer = null;
    }
  },

  /** Take screen capture and save it in png format. */
  "[subscribe('command/capture-screen')]": 
  function captureScreen(info) 
  {
    coUtils.IO.saveCanvas(this._main_layer.canvas, info.file, info.thumbnail);
  },

  "[subscribe('variable-changed/renderer.smoothing'), enabled]": 
  function onSmoothingChanged(value) 
  {
    if (this._main_layer) {
      this._main_layer.smoothing = value;
    }
    if (this._slow_blink_layer) {
      this._slow_blink_layer.smoothing = value;
    }
    if (this._rapid_blink_layer) {
      this._rapid_blink_layer.smoothing = value;
    }
  },

  "[subscribe('set/font-size')]": 
  function setFontSize(font_size) 
  {
    this.line_height += font_size - this.font_size;
    this.font_size = font_size;
    let broker = this._broker;
    broker.notify("event/font-size-changed", this.font_size);
  },

  "[subscribe('set/font-family')]": 
  function setFontFamily(font_family) 
  {
    this.font_family = font_family;
  },

  "[subscribe('variable-changed/renderer.font_{size | family}')]": 
  function onFontChanged(font_size) 
  {
    this.dependency["screen"].dirty = true;
    this._calculateGlyphSize();
  },

  "[subscribe('command/change-fontsize-by-offset')]":
  function changeFontSizeByOffset(offset) 
  {
    this.font_size = Number(this.font_size) + offset;
    this.line_height = Number(this.line_height) + offset;
    let broker = this._broker;
    broker.notify("event/font-size-changed", this.font_size);
  },

  "[subscribe('variable-changed/{screen.width | renderer.char_width}')]":
  function onWidthChanged(width, char_width) 
  {
    width = width || this.dependency["screen"].width;
    char_width = char_width || this.char_width;
    let canvas_width = 0 | (width * char_width);
    this._main_layer.canvas.width = canvas_width;
    if (this._slow_blink_layer) {
      this._slow_blink_layer.width = canvas_width;
    }
    if (this._rapid_blink_layer) {
      this._rapid_blink_layer.width = canvas_width;
    }
    let broker = this._broker;
    broker.notify("event/screen-width-changed", canvas_width);
  },

  "[subscribe('variable-changed/{screen.height | renderer.line_height}')]":
  function onHeightChanged(height, line_height)
  {
    height = height || this.dependency["screen"].height;
    line_height = line_height || this.line_height;
    let canvas_height = 0 | (height * line_height);
    this._main_layer.canvas.height = canvas_height;
    if (this._slow_blink_layer) {
      this._slow_blink_layer.canvas.height = canvas_height;
    }
    if (this._rapid_blink_layer) {
      this._rapid_blink_layer.canvas.height = canvas_height;
    }
    let broker = this._broker;
    broker.notify("event/screen-height-changed", canvas_height);
  },

  _drawNormalText: 
  function _drawNormalText(codes, row, column, end, attr, size)
  {
    let context = this._main_layer.context;
    let line_height = this.line_height;
    let char_width = this.char_width;
    let font_size = this.font_size;
    let font_family = this.font_family;
    let text_offset = this._text_offset;

    let left, top, width, height;
    left = char_width * column;
    top = line_height * row;
    width = (char_width * (end - column));
    height = line_height;

    this._drawBackground(
      context, 
      left | 0, 
      top, 
      width + Math.ceil(left) - left, 
      height, 
      attr);

    context.font = font_size + "px " + font_family;
    if (attr.italic) {
      context.font = "italic " + context.font;
    }

    this._drawWord(
      context, 
      codes, 
      left, 
      top + text_offset, 
      char_width, 
      end - column, 
      height, 
      attr, size);

  },

  _drawDoubleHeightTextTop: 
  function _drawDoubleHeightTextTop(codes, row, column, end, attr, size)
  {
    let context = this._main_layer.context;
    let line_height = this.line_height;
    let char_width = this.char_width;
    let font_size = this.font_size;
    let font_family = this.font_family;
    let text_offset = this._text_offset;

    let left, top, width, height;

    left = char_width * 2 * column;
    top = line_height * (row + 1);
    width = char_width * 2 * (end - column);
    height = line_height;

    context.font = (font_size * 2) + "px " + font_family;
    if (attr.italic) {
      context.font = "italic " + context.font;
    }

    this._drawBackground(
      context, 
      left | 0, 
      line_height * row, 
      width + Math.ceil(left) - left, 
      height, 
      attr);

    context.save();
    context.beginPath();
    context.rect(left, line_height * row, width, height);
    context.clip();

    this._drawWord(
      context, 
      codes, 
      left, 
      top + text_offset, 
      char_width * 2, 
      end - column, 
      height, 
      attr, 
      size);

    context.restore();

  },

  _drawDoubleHeightTextBottom: 
  function _drawDoubleHeightTextBottom(codes, row, column, end, attr, size)
  {
    let context = this._main_layer.context;
    let line_height = this.line_height;
    let char_width = this.char_width;
    let font_size = this.font_size;
    let font_family = this.font_family;
    let text_offset = this._text_offset;

    let left, top, width, height;

    left = char_width * 2 * column;
    top = line_height * row;
    width = char_width * 2 * (end - column);
    height = line_height;

    context.font = (font_size * 2) + "px " + font_family;
    if (attr.italic) {
      context.font = "italic " + context.font;
    }

    this._drawBackground(
      context, 
      left | 0, 
      line_height * row, 
      width + Math.ceil(left) - left, 
      height, 
      attr);

    context.save();
    context.beginPath();
    context.rect(left, line_height * row, width, height);
    context.clip();

    this._drawWord(
      context, 
      codes, 
      left, 
      top + text_offset, 
      char_width * 2, 
      end - column, 
      height, 
      attr, 
      size);

    context.restore();

  },

  _drawDoubleWidthText: 
  function _drawDoubleWidthText(codes, row, column, end, attr, size)
  {
    let context = this._main_layer.context;
    let line_height = this.line_height;
    let char_width = this.char_width;
    let font_size = this.font_size;
    let font_family = this.font_family;
    let text_offset = this._text_offset;

    let left, top, width, height;

    context.font = (font_size * 2) + "px " + font_family;
    if (attr.italic) {
      context.font = "italic " + context.font;
    }

    left = char_width * 2 * column;
    top = line_height * row;
    width = char_width * 2 * (end - column);
    height = line_height;

    this._drawBackground(
      context, 
      left | 0, 
      line_height * row, 
      width + Math.ceil(left) - left, 
      height, 
      attr);

    context.save();
    context.beginPath();
    context.rect(left, line_height * row, width, height);
    context.transform(1, 0, 0, 0.5, 0, (top + text_offset) / 2);
    context.clip();

    this._drawWord(
      context, 
      codes, 
      left, 
      top + text_offset, 
      char_width * 2, 
      end - column, 
      height, 
      attr, 
      size);

    context.restore();

  },

  /** Draw to canvas */
  "[subscribe('command/draw')]": 
  function draw(redraw_flag)
  {
    let screen = this.dependency["screen"];

    if (redraw_flag) {
      screen.dirty = true;
    }

    for (let { codes, row, column, end, attr, size } in screen.getDirtyWords()) {

      let cells = codes;
      let codes1 = [];
      for (let i = 0; i < cells.length; ++i) {
        let cell = cells[i];
        let code = cell.c;
        if (code > 0xffff) {
          // emit 16bit + 16bit surrogate pair.
          code -= 0x10000;
          codes1.push(
            (code >> 10) | 0xD800, 
            (code & 0x3FF) | 0xDC00);
        } else {
          codes1.push(code);
        }
      }


      if (end == column) {
        continue;
      }

      let left, top, width, height;

      switch (size) {

        case 0:
          this._drawNormalText(codes1, row, column, end, attr, size);
          break;

        case 1:
          this._drawDoubleHeightTextTop(codes1, row, column, end, attr, size);
          break;

        case 2:
          this._drawDoubleHeightTextBottom(codes1, row, column, end, attr, size);
          break;

        case 3:
          this._drawDoubleWidthText(codes1, row, column, end, attr, size);
          break;

        default:
          throw coUtils.Debug.Exception(
            _("Invalid double height mode was detected: %d."), 
            size);
      }
    }
  }, // draw

  /** Render background attribute. 
   *
   */
  _drawBackground: 
  function _drawBackground(context, x, y, width, height, attr)
  {
    if (attr.blink) {
      if (null === this._slow_blink_layer) {
        this.createSlowBlinkLayer(this.slow_blink_interval);
      }
      this._drawBackgroundImpl(context, x, y, width, height, attr);
      this._drawBackgroundImpl(this._slow_blink_layer.context, x, y, width, height, attr);
    } else if (attr.rapid_blink) {
      if (null === this._rapid_blink_layer) {
        this.createRapidBlinkLayer(this.rapid_blink_interval);
      }
      this._drawBackgroundImpl(context, x, y, width, height, attr);
      this._drawBackgroundImpl(this._rapid_blink_layer.context, x, y, width, height, attr);
    } else {
      this._drawBackgroundImpl(context, x, y, width, height, attr);
      if (null !== this._slow_blink_layer) {
        this._slow_blink_layer.context.clearRect(x, y, width, height);
      }
      if (null !== this._rapid_blink_layer) {
        this._rapid_blink_layer.context.clearRect(x, y, width, height);
      }
    }
  },

  _drawBackgroundImpl: 
  function _drawBackgroundImpl(context, x, y, width, height, attr) 
  {
    if (!this._reverse && this.transparent_color == attr.bg) {
      context.clearRect(x, y, width, height);
    } else {
      /* Get hexadecimal formatted background color (#xxxxxx) 
       * form given attribute structure. */
      let back_color = this.color[attr.bg];
      context.globalAlpha = 1.0;

      /* Draw background */
      context.fillStyle = back_color;
      context.fillRect(x, y, width, height);
    }
    context = null;
  },

  /** Render text in specified cells.
   */
  _drawWord: 
  function _drawWord(context, 
                     codes, 
                     x, y, 
                     char_width, 
                     length, 
                     height, 
                     attr, size)
  {
    if (attr.blink) {
      if (null === this._slow_blink_layer) {
        this.createSlowBlinkLayer(this.slow_blink_interval);
      }
      context = this._slow_blink_layer.context;
      context.font = this._main_layer.context.font;
    }

    if (attr.rapid_blink) {
      if (null === this._rapid_blink_layer) {
        this.createRapidBlinkLayer(this.rapid_blink_interval);
      }
      context = this._rapid_blink_layer.context;
      context.font = this._main_layer.context.font;
    }

    if (attr.bold) {
      context.globalAlpha = this.bold_alpha;
    } else if (attr.halfbright) {
      context.globalAlpha = this.halfbright_alpha;
    } else {
      context.globalAlpha = this.normal_alpha;
    }

    // Get hexadecimal formatted text color (#xxxxxx) 
    // form given attribute structure. 
    let fore_color_map = this.color;
    let fore_color = fore_color_map[attr.fg];

    context.fillStyle = fore_color;

    if (attr.underline) {
      this._drawUnderline(context, x, y, char_width * length, fore_color);
    }

    if (null === this._drcs_state || !attr.drcs) {
      let text = String.fromCharCode.apply(String, codes);
      //if (this.enable_render_bold_as_textshadow && attr.bold) {
      //  context.shadowColor = this.shadow_color;
      //  context.shadowOffsetX = this.shadow_offset_x;
      //  context.shadowOffsetY = this.shadow_offset_y;
      //  context.shadowBlur = this.shadow_blur;
      //} else {
      //  context.shadowOffsetX = 0;
      //  context.shadowBlur = 0;
      //}
      context.fillText(text, x, y, char_width * length);
      if (attr.bold && this.bold_as_blur) {
        context.fillText(text, x + 1, y, char_width * length - 1);
      }
    } else {
      let drcs_state = this._drcs_state;
      for (let index = 0; index < codes.length; ++index) {
        let code = codes[index] - this._offset;
        if (drcs_state.start_code <= code && code <= drcs_state.end_code) {
          //let glyph = drcs_state.glyphs[code - drcs_state.start_code];
          //context.putImageData(glyph, 0, 0)
          let glyph_index = code - drcs_state.start_code;
          let source_top, source_left, source_width, source_height;
          let destination_top, destination_left, destination_width, destination_height;
          switch (size) {

            case 0:
              source_left = glyph_index * drcs_state.drcs_width;
              source_top = 0;
              source_width = drcs_state.drcs_width;
              source_height = drcs_state.drcs_height;
              destination_left = x + index * char_width;
              destination_top = y - this._text_offset;
              destination_width = Math.round(char_width);
              destination_height = this.line_height;
              break;

            case 1:
              source_left = glyph_index * drcs_state.drcs_width;
              source_top = 0;
              source_width = drcs_state.drcs_width;
              source_height = drcs_state.drcs_height / 2;
              destination_left = x + index * char_width;
              destination_top = y - this._text_offset - this.line_height;
              destination_width = Math.round(char_width);
              destination_height = this.line_height;
              break;

            case 2:
              source_left = glyph_index * drcs_state.drcs_width;
              source_top = drcs_state.drcs_height / 2;
              source_width = drcs_state.drcs_width;
              source_height = drcs_state.drcs_height / 2;
              destination_left = x + index * char_width;
              destination_top = y - this._text_offset;
              destination_width = Math.round(char_width);
              destination_height = this.line_height;
              break;

            case 3:
              source_left = glyph_index * drcs_state.drcs_width;
              source_top = 0;
              source_width = drcs_state.drcs_width;
              source_height = drcs_state.drcs_height;
              destination_left = x + index * char_width;
              destination_top = y - this._text_offset 
              destination_width = Math.round(char_width);
              destination_height = this.line_height;
              break;
          }
          context.drawImage(
            drcs_state.drcs_canvas, 
            source_left,            // source left
            source_top,             // source top
            source_width,           // source width
            source_height,          // source height
            destination_left,       // destination left
            destination_top,        // destination top
            destination_width,      // destination width
            destination_height);    // destination height
          
          context.globalCompositeOperation = "source-atop";
          context.fillRect(
            x,
            Math.ceil(y - this._text_offset + 0.5), 
            char_width + 1, 
            this.line_height);
          context.globalCompositeOperation = "source-over";
          
        }
      }
    }
  },

  /** Rnder underline at specified position.
   * @param {nsIRenderingContext} context  a rendering context object.
   * @param {Number} x  the horizontal start position.
   * @param {Number} y  the vertical base-line position.
   * @param {String} fore_color  the stroke color of underline.
   */
  _drawUnderline: function _drawUnderline(context, x, y, width, fore_color)
  {
     // Render underline 
     context.lineWidth = 1;
     context.strokeStyle = fore_color;
     context.beginPath();
     context.moveTo(x, y + 2);
     context.lineTo(x + width, y + 2);
     context.stroke();
  },

  /** Do test rendering and calculate glyph width with current font and font size.
   */
  _calculateGlyphSize: function _calculateGlyphSize() 
  {
    let font_size = this.font_size;
    let font_family = this.font_family;
    let [char_width, char_height, char_offset] 
      = coUtils.Font.getAverageGlyphSize(font_size, font_family);
    // store result
    this.char_width = char_width;
    this.char_offset = char_offset;
    this.char_height = char_height;
    this._text_offset = ((this.line_height + char_height + char_offset / 2) / 2 - 3);
  },

};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new Renderer(broker);
}

