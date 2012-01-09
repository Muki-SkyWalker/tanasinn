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
 * The Original Code is coTerminal
 *
 * The Initial Developer of the Original Code is
 * Hayaki Saito.
 * Portions created by the Initial Developer are Copyright (C) 2010 - 2011
 * the Initial Developer. All Rights Reserved.
 *
 * ***** END LICENSE BLOCK ***** */

const CO_XTERM_256_COLOR_PROFILE = [
  /* 0   */ "#000000", // black
  /* 1   */ "#cd0000", // red
  /* 2   */ "#00cd00", // green
  /* 3   */ "#cdcd00", // yellow
  /* 4   */ "#0000ee", // blue
  /* 5   */ "#cd00cd", // magenta
  /* 6   */ "#00cdcd", // cyan
  /* 7   */ "#e5e5e5", // white
  /* 8   */ "#7f7f7f", // blight black
  /* 9   */ "#ff0000", // blight red
  /* 10  */ "#00ff00", // blight green　　
  /* 11  */ "#ffff00", // blight yellow
  /* 12  */ "#5c5cff", // blight blue
  /* 13  */ "#ff00ff", // blight magenta
  /* 14  */ "#00ffff", // blight cyan
  /* 15  */ "#ffffff", // blight white
  /* 16 -23  */ "#000000", "#00005f", "#000087", "#0000af", "#0000d7", "#0000ff", "#005f00", "#005f5f",
  /* 24 -31  */ "#005f87", "#005faf", "#005fd7", "#005fff", "#008700", "#00875f", "#008787", "#0087af",
  /* 32 -39  */ "#0087d7", "#0087ff", "#00af00", "#00af5f", "#00af87", "#00afaf", "#00afd7", "#00afff",
  /* 40 -47  */ "#00d700", "#00d75f", "#00d787", "#00d7af", "#00d7d7", "#00d7ff", "#00ff00", "#00ff5f",
  /* 48 -55  */ "#00ff87", "#00ffaf", "#00ffd7", "#00ffff", "#5f0000", "#5f005f", "#5f0087", "#5f00af",
  /* 56 -63  */ "#5f00d7", "#5f00ff", "#5f5f00", "#5f5f5f", "#5f5f87", "#5f5faf", "#5f5fd7", "#5f5fff",
  /* 64 -71  */ "#5f8700", "#5f875f", "#5f8787", "#5f87af", "#5f87d7", "#5f87ff", "#5faf00", "#5faf5f",
  /* 72 -79  */ "#5faf87", "#5fafaf", "#5fafd7", "#5fafff", "#5fd700", "#5fd75f", "#5fd787", "#5fd7af",
  /* 80 -87  */ "#5fd7d7", "#5fd7ff", "#5fff00", "#5fff5f", "#5fff87", "#5fffaf", "#5fffd7", "#5fffff",
  /* 88 -95  */ "#870000", "#87005f", "#870087", "#8700af", "#8700d7", "#8700ff", "#875f00", "#875f5f",
  /* 96 -103 */ "#875f87", "#875faf", "#875fd7", "#875fff", "#878700", "#87875f", "#878787", "#8787af",
  /* 104-111 */ "#8787d7", "#8787ff", "#87af00", "#87af5f", "#87af87", "#87afaf", "#87afd7", "#87afff",
  /* 112-119 */ "#87d700", "#87d75f", "#87d787", "#87d7af", "#87d7d7", "#87d7ff", "#87ff00", "#87ff5f",
  /* 120-127 */ "#87ff87", "#87ffaf", "#87ffd7", "#87ffff", "#af0000", "#af005f", "#af0087", "#af00af",
  /* 128-135 */ "#af00d7", "#af00ff", "#af5f00", "#af5f5f", "#af5f87", "#af5faf", "#af5fd7", "#af5fff",
  /* 136-143 */ "#af8700", "#af875f", "#af8787", "#af87af", "#af87d7", "#af87ff", "#afaf00", "#afaf5f",
  /* 144-151 */ "#afaf87", "#afafaf", "#afafd7", "#afafff", "#afd700", "#afd75f", "#afd787", "#afd7af",
  /* 152-159 */ "#afd7d7", "#afd7ff", "#afff00", "#afff5f", "#afff87", "#afffaf", "#afffd7", "#afffff",
  /* 160-167 */ "#d70000", "#d7005f", "#d70087", "#d700af", "#d700d7", "#d700ff", "#d75f00", "#d75f5f",
  /* 168-175 */ "#d75f87", "#d75faf", "#d75fd7", "#d75fff", "#d78700", "#d7875f", "#d78787", "#d787af",
  /* 176-183 */ "#d787d7", "#d787ff", "#d7af00", "#d7af5f", "#d7af87", "#d7afaf", "#d7afd7", "#d7afff",
  /* 184-191 */ "#d7d700", "#d7d75f", "#d7d787", "#d7d7af", "#d7d7d7", "#d7d7ff", "#d7ff00", "#d7ff5f",
  /* 192-199 */ "#d7ff87", "#d7ffaf", "#d7ffd7", "#d7ffff", "#ff0000", "#ff005f", "#ff0087", "#ff00af",
  /* 200-207 */ "#ff00d7", "#ff00ff", "#ff5f00", "#ff5f5f", "#ff5f87", "#ff5faf", "#ff5fd7", "#ff5fff",
  /* 208-215 */ "#ff8700", "#ff875f", "#ff8787", "#ff87af", "#ff87d7", "#ff87ff", "#ffaf00", "#ffaf5f",
  /* 216-223 */ "#ffaf87", "#ffafaf", "#ffafd7", "#ffafff", "#ffd700", "#ffd75f", "#ffd787", "#ffd7af",
  /* 224-231 */ "#ffd7d7", "#ffd7ff", "#ffff00", "#ffff5f", "#ffff87", "#ffffaf", "#ffffd7", "#ffffff",
  /* 232-239 */ "#080808", "#121212", "#1c1c1c", "#262626", "#303030", "#3a3a3a", "#444444", "#4e4e4e",
  /* 240-247 */ "#585858", "#626262", "#6c6c6c", "#767676", "#808080", "#8a8a8a", "#949494", "#9e9e9e",
  /* 248-255 */ "#a8a8a8", "#b2b2b2", "#bcbcbc", "#c6c6c6", "#d0d0d0", "#dadada", "#e4e4e4", "#eeeeee"
]; // CO_XTERM_256_COLOR_PROFILE

/** 
 * @class Renderer
 * @brief Scan screen state and render it to canvas element.
 */ 
let Renderer = new Class().extends(Component);
Renderer.definition = {

  get id()
    "renderer",

  get info()
    <module>
        <name>{_("Renderer")}</name>
        <description>{
          _("Handles draw event and render output data to main canvas.")
        }</description>
        <version>0.1</version>
    </module>,

  _context: null,

  // color map (index No. is spacified by SGR escape sequences)
  
  /** color map for Normal characters. */
  "[watchable, persistable] normal_color": CO_XTERM_256_COLOR_PROFILE.slice(0),       

  /** color map for Bold characters. */
  "[watchable, persistable] bold_color": CO_XTERM_256_COLOR_PROFILE.slice(0),         

  /** color map for background. */
  "[watchable, persistable] background_color": CO_XTERM_256_COLOR_PROFILE.slice(0),   

  // cell geometry (in pixel)
  "[watchable, persistable] line_height": 13,
  "[watchable] char_width": 6.5, 
  "[watchable] char_height": 4, 
  "[watchable] char_offset": 11, 
  "_text_offset": 10, 

  // font
  "[watchable, persistable] font_family"       : "monospace",
  "[persistable]            font_family@Linux" : "monospace",
  "[persistable]            font_family@Darwin": "Menlo",
  "[persistable]            font_family@WINNT" : "Lucida Console",
  "[watchable, persistable] font_size": 13,

  "[subscribe('@initialized/{screen & chrome}'), enabled]": 
  function onLoad(screen, chrome) 
  {
    this.font_family = this["font_family@" + coUtils.Runtime.os] || this.font_family;
    this._screen = screen;
    this.install(this._broker);
  },

  /** Installs itself.
   *  @param session {Session} A session object.
   */
  install: function install(session) 
  {
    let {foreground_canvas} = session.uniget(
      "command/construct-chrome", 
      {
        parentNode: "#coterminal_center_area",
        tagName: "html:canvas",
        id: "foreground_canvas",
      });

    this._canvas = foreground_canvas;
    this._context = this._canvas.getContext("2d");
    this._calculateGryphWidth();
    this.onWidthChanged();
    this.onHeightChanged();

    this.onWidthChanged.enabled = true;
    this.onHeightChanged.enabled = true;
    this.onFontChanged.enabled = true;
    this.setFontSize.enabled = true;
    this.setFontFamily.enabled = true;
    this.changeFontSizeByOffset.enabled = true;
    this.draw.enabled = true;
    session.notify("initialized/renderer", this);
  },

  /** Uninstalls itself.
   *  @param session {Session} A session object.
   */
  uninstall: function uninstall(session) 
  {
    this.onWidthChanged.enabled = false;
    this.onHeightChanged.enabled = false;
    this.onFontChanged.enabled = false;
    this.setFontSize.enabled = false;
    this.setFontFamily.enabled = false;
    this.changeFontSizeByOffset.enabled = false;
    this.draw.enabled = false;
    this._canvas.parentNode.removeChild(this._canvas);
  },

  "[subscribe('set/font-size')]": 
  function setFontSize(font_size) 
  {
    this.line_height += font_size - this.font_size;
    this.font_size = font_size;
    let session = this._broker;
    session.notify("event/font-size-changed", this.font_size);
  },

  "[subscribe('set/font-family')]": 
  function setFontFamily(font_family) 
  {
    this.font_family = font_family;
  },

  "[subscribe('variable-changed/renderer.font_{size | family}')]": 
  function onFontChanged(font_size) 
  {
    this._screen.dirty = true;
    this._calculateGryphWidth();
  },

  "[subscribe('command/change-fontsize-by-offset')]":
  function changeFontSizeByOffset(offset) 
  {
    this.font_size += offset;
    this.line_height += offset;
    let session = this._broker;
    session.notify("event/font-size-changed", this.font_size);
  },

  "[subscribe('variable-changed/{screen.width | renderer.char_width}')]":
  function onWidthChanged(width, char_width) 
  {
    width = width || this._screen.width;
    char_width = char_width || this.char_width;
    let canvas_width = 0 | (width * char_width);
    this._canvas.width = canvas_width;

    let session = this._broker;
    session.notify("event/screen-width-changed", canvas_width);
  },

  "[subscribe('variable-changed/{screen.height | renderer.line_height}')]":
  function onHeightChanged(height, line_height)
  {
    height = height || this._screen.height;
    line_height = line_height || this.line_height;
    let canvas_height = 0 | (height * line_height);

    let session = this._broker;
    session.notify("event/screen-height-changed", canvas_height);

    this._canvas.height = canvas_height;
  },

  /** Draw to canvas */
  "[subscribe('command/draw')]": 
  function draw(redraw_flag)
  {
    if (redraw_flag)
      this._screen.dirty = true;
    let context = this._context;
    //context.mozImageSmoothingEnabled = true;
    let screen = this._screen;
    let font_size = this.font_size;
    let font_family = this.font_family;
    let line_height = this.line_height;
    let char_width = this.char_width;
    let text_offset = this._text_offset;
    for (let { text, row, column, end, attr } in screen.getDirtyWords()) {
      let left = char_width * column;
      let top = line_height * row;
      let width = char_width * (end - column);
      let height = line_height | 0;
      this._drawBackground(context, left, top, width, height, attr.bg);
      this._drawWord(context, text, left, top + text_offset, width, height, attr);
    }
  },

  /** Render background attribute. 
   *
   */
  _drawBackground: function _drawBackground(context, x, y, width, height, bg)
  {
    if (0 == bg) {
      context.clearRect(x, y, width, height);
    } else {
      /* Get hexadecimal formatted background color (#xxxxxx) 
       * form given attribute structure. */
      let back_color = this.background_color[bg];

      /* Draw background */
      context.fillStyle = back_color;
      context.fillRect(x, y, width, height);
    }
  },

  /** Render text in specified cells.
   */
  _drawWord: function _drawWord(context, text, x, y, width, height, attr)
  {
    // Get hexadecimal formatted text color (#xxxxxx) 
    // form given attribute structure. 
    let fore_color_map = attr.bold ? this.bold_color: this.normal_color;
    let fore_color = fore_color_map[attr.fg];
    this._setFont(context, attr.bold); 
    context.fillStyle = fore_color;
    context.fillText(text, x, y, width + 1);
    //if (attr.bold) {
    //  context.strokeStyle = fore_color;
    //  context.strokeText(text, x, y, width);
    //}
    if (attr.underline) {
      this._drawUnderline(context, x, y, width, fore_color);
    }
  },

  /** Rnder underline at specified position.
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

  _calculateGryphWidth: function _calculateGryphWidth() 
  {
    let font_size = this.font_size;
    let font_family = this.font_family;
    let [char_width, char_height, char_offset] 
      = coUtils.Font.getAverageGryphWidth(font_size, font_family);
    this.char_width = char_width;
    this.char_offset = char_offset;
    this.char_height = char_height;
    this._text_offset = ((this.line_height + char_height + char_offset / 2) / 2 - 3) | 0;
  },

  _setFont: function setFontSize(context, is_bold) 
  {
    let font_size = this.font_size;
    let font_family = this.font_family;
    context.font = (is_bold ? "bold ": " ") 
                 + (font_size | 0) + "px "
                 + font_family;
  },
        
}

/**
 * @fn main
 * @brief Module entry point.
 * @param {Process} process The Process object.
 */
function main(process) 
{
  process.subscribe(
    "initialized/session", 
    function(session) new Renderer(session));
}


