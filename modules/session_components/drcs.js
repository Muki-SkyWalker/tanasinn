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
 *  @class DRCSBuffer
 */
var DRCSBuffer = new Class().extends(Plugin)
                            .depends("sixel_parser");
DRCSBuffer.definition = {

  id: "drcs_buffer",

  /* plugin information */
  getInfo: function getInfo()
  {
    return {
      name: _("DRCS Buffer"),
      version: "0.1",
      description: _("Provides DRCS(Dynamic Rendering Character Set) buffers.")
    };
  },

  "[persistable] enabled_when_startup": true,

  _map: null,
  _g0: "B",
  _g1: "B",
  _counter: 0x0,
  _sixel_parser: null,

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    this._map = [];
    this._sixel_parser = context["sixel_parser"];
  },

  /** Uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
    var dscs;

    if (null !== this._map) {
      for (dscs in this._map) {
        this._map[dscs].drcs_canvas = null;
      }
      this._map = null;
    }
    this._sixel_parser = null;
  },

  "[subscribe('command/query-da1-capability'), pnp]":
  function onQueryDA1Capability(mode)
  {
    return 7; // DRCS
  },

  "[subscribe('sequence/dcs/7b'), pnp]":
  function onDCS(message)
  {
    var pattern,
        match,
        canvas,
        data = message.data,
        params = message.params,
        i,
        pfn = params[0],  // Pfn Font number
        pcn = params[1],  // Starting Character
        pe = params[2],   // Erase control:
                          //   0: erase all characters in the DRCS buffer with this number,
                          //      width and rendition.
                          //   1: erase only characters in locations being reloaded.
                          //   2: erase all renditions of the soft character set
                          //      (normal, bold, 80-column, 132-column).
                          //
        pcmw = params[3], // Character matrix width
                          //   Selects the maximum character cell width.
                          //   0: 15 pxiels wide for 80 columns, 9pixels wide for 132 columns. (Default)
                          //   1: illegal
                          //   2: 5 x 10 pixel cell
                          //   3: 6 x 10 pixel cell
                          //   4: 7 x 10 pixel cell
                          //   5: 5 pixels wide
                          //   6: 6 pixels wide
                          //   ...
                          //   15: 15 pixcels wide
        pw = params[4],   // Font width
                          //   Selects the number of columns per line (font set size).
                          //   0: 80 columns. (Default)
                          //   1: 80 columns.
                          //   2: 132 columns.
        pt = params[5],   // Text or full-cell
                          //   0: text. (Default)
                          //   1: text.
                          //   2: full cell.
        pcmh = params[6], // Character matrix height
                          //   Selects the maximum character cell height.
                          //   0: 12 pxels high. (Default)
                          //   1: 1 pixcels high.
                          //   2: 2 pixcels high.
                          //   2: 3 pixcels high.
                          //   ...
                          //   12: 12 pixcels high.
        pcss = params[7], // Character set size
                          //   Defines the character set as a 94- or 96-character graphic set.
                          //   0: 94-character set. (Default)
                          //   1: 96-character set.
                          //   2: unicode.
        char_width = {
                       0: 2 === Number(pw) ? 9: 15,
                       2: 5,
                       3: 6,
                       4: 7,
                     } [pcmw] || Number(pcmw),
        char_height = {
                       2: 10,
                       3: 10,
                       4: 10,
                     } [pcmw] || Number(pcmh) || 12,
        charset_size = 0 === Number(pcss) ? 94: 96,
        full_cell = 2 === Number(pt),
        start_code = 0 === Number(pcss) ? ({ // 94 character set.
                       0: 0x20,
                       1: 0x21,
                     } [pcn] || Number(pcn) + 0x20)
                     : 1 === Number(pcss) ? Number(pcn) + 0x20 // 96 character set.
                     : Number(pcn) + 0x20, // unicode character set.
        c,
        dscs_key = 0;

    for (i = 0; i < data.length; ++i) {
      c = data[i];
      if (c < 0x20) {
        // pass
      } else if (c < 0x30) {
        dscs_key = dscs_key << 8 | c;
      } else if (c < 0x40) {
        // pass
      } else if (c < 0x7f) {
        dscs_key = dscs_key << 8 | c;
        data = data.slice(i + 1);
        break;
      } else {
        // pass
      }
    }

    if (this._map[dscs_key]) {
      canvas = this._map[dscs_key].drcs_canvas;
    } else {
      canvas = this.request(
        "command/construct-chrome",
        {
          tagName: "html:canvas",
        })["#root"];
    }

    canvas.width = char_width * 97;
    canvas.height = char_height * 1;

    if (3 === pt) {

      var sixel = data;
      if (!sixel) {
        return;
      }

      var dom = {
        canvas: canvas,
        context: canvas.getContext("2d"),
      };

      var result = this._sixel_parser.parse(sixel, dom),
          //line_count = Math.ceil(result.max_y / char_height),
          cell_count = Math.ceil(result.max_x / char_width),
          end_code = start_code + cell_count,
          full_cell = true;

      this.sendMessage(
        "command/alloc-drcs",
        {
          dscs: dscs_key,
          drcs_canvas: canvas,
          drcs_width: char_width,
          drcs_height: char_height,
          drcs_top: 0,
          start_code: start_code,
          end_code: end_code,
          full_cell: full_cell,
          color: true,
        });
    } else {
      var context = canvas.getContext("2d"),
          imagedata = context.getImageData(0, 0, canvas.width, canvas.height),
          i,
          n = 0,
          h = 0,
          x = 0,
          y,
          position;

      for (i = 0; i < data.length; ++i) {
        c = data[i];
        if (0x3b === c) { // ;
          x = 0;
          h = 0;
          ++n;
        } else if (0x2f === c) { // /
          x = 0;
          ++h;
        } else if (c >= 0x3f && c < 0x7f) { // ? - ~
          c -= 0x3f;
          for (y = 0; y < 6; ++y) {
            if (c & 0x1 << y) {
              position = (((y + h * 6) * 97 + n) * char_width + x) * 4;
              imagedata.data[position + 0] = 255;
              imagedata.data[position + 1] = 255;
              imagedata.data[position + 2] = 255;
              imagedata.data[position + 3] = 255;
            }
          }
          ++x;
        } else {
          // pass
        }
      }

      canvas.getContext("2d").putImageData(imagedata, 0, 0);

      this.sendMessage(
        "command/alloc-drcs",
        {
          dscs: dscs_key,
          drcs_canvas: canvas,
          drcs_width: char_width,
          drcs_height: char_height,
          drcs_top: 0,
          start_code: start_code,
          end_code: start_code + n,
          full_cell: full_cell,
          color: false,
        });
    }
  },

  "[subscribe('command/alloc-drcs'), pnp]":
  function allocDRCS(drcs)
  {
    this._map[drcs.dscs] = drcs;
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


} // class DRCSBuffer

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new DRCSBuffer(broker);
}

// EOF
