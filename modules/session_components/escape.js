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

/** @class KeypadMode
 */
let KeypadMode = new Class().extends(Component);
KeypadMode.definition = {
 
  get id()
    "keypadmode",

  /** normal keypad (Normal). 
   *
   * DECKPNM / DECKPNM — Keypad Numeric Mode
   * 
   * DECKPNM enables the keypad to send numeric characters to the host. 
   * DECKPAM enables the keypad to send application sequences.
   * 
   * DECKPNM and DECKPAM function the same as numeric keypad mode (DECNKM).
   * 
   * Default: Send numeric keypad characters.
   *
   * Format
   *
   * ESC    >
   * 1/11   3/14   Send numeric keypad characters.
   *
   * Description
   * 
   * DECKPNM enables the numeric keypad to send the characters shown on each 
   * key—number, comma, period, or minus sign. Keys PF1 to PF4 send 
   * application sequences. See DECKPAM—Keypad Application Mode for more 
   * information.
   *
   * Note on DECKPNM
   * 
   * The setting is not saved in NVM. When you turn on or reset the terminal, 
   * it automatically selects numeric keypad mode.
   */ 
  "[sequence('ESC >')]": function DECPNM() 
  {
    let broker = this._broker;
    broker.notify(
      "event/keypad-mode-changed", 
      coUtils.Constant.KEYPAD_MODE_NORMAL);
  },
 
  /** application keypad (NumLock). 
   *
   * DECKPAM / DECPAM — Keypad Application Mode
   * 
   * DECKPAM enables the numeric keypad to send application sequences to the 
   * host. DECKPNM enables the numeric keypad to send numeric characters.
   * 
   * DECKPAM and DECKPNM function the same as numeric keypad mode (DECNKM).
   *
   * Format
   *
   * ESC    =
   * 1/11   3/13   Send application sequences.
   *
   * Note on DECKPAM
   * 
   * The setting is not saved in NVM. When you turn on or reset the terminal, 
   * it automatically selects numeric keypad mode.
   */
  "[sequence('ESC =')]": function DECPAM() 
  {
    let broker = this._broker;
    broker.notify(
      "event/keypad-mode-changed", 
      coUtils.Constant.KEYPAD_MODE_APPLICATION);
  },

};

/**
 * @class CharsetMode
 */
let CharsetMode = new Class().extends(Component)
CharsetMode.definition = {  

  get id()
    "charsetmode",

  /**
   * SCS — Select Character Set
   * 
   * Designate character sets to G-sets.
   *
   * Format
   *
   * ESC    I     Dscs
   * 1/11   ...   ...
   *
   * Parameters
   * 
   * I is the intermediate character representing the G-set designator.
   *
   * I   94-Character G-set
   * (   G0
   * )   G1
   * *   G2
   * +   G3
   * I   96-Character G-set
   * -   G1
   * .   G2
   * /   G3
   * 
   * Dscs represents a character set designator.
   * Dscs         Default 94-Character Set
   * % 5          DEC Supplemental
   * " ?          DEC Greek
   * " 4          DEC Hebrew
   * % 0          DEC Turkish
   * & 4          DEC Cyrillic
   * A            U.K. NRCS
   * R            French NRCS
   * 9 or Q       French Canadian NRCS
   * `, E, or 6   Norwegian/Danish NRCS
   * 5 or C       Finnish NRCS
   * K            German NRCS
   * Y            Italian NRCS
   * =            Swiss NRCS
   * 7 or H       Swedish NRCS
   * Z            Spanish NRCS
   * % 6          Portuguese NRCS
   * " >          Greek NRCS
   * % =          Hebrew NRCS
   * % 2          Turkish NRCS
   * % 3          SCS NRCS
   * & 5          Russian NRCS
   * 0            DEC Special Graphic
   * >            DEC Technical Character Set
   * <            User-preferred Supplemental
   * Dscs         Default 96-Character Set
   * A            ISO Latin-1 Supplemental
   * B            ISO Latin-2 Supplemental
   * F            ISO Greek Supplemental
   * H            ISO Hebrew Supplemental
   * M            ISO Latin-5 Supplemental
   * L            ISO Latin-Cyrillic
   * <            User-preferred Supplemental
   */
  "[sequence('ESC (%c')]": 
  function SCSG0(mode) 
  {
    let broker = this._broker;
    broker.notify("sequence/g0", mode);
  },
  
  "[sequence('ESC )%c')]": 
  function SCSG1(mode) 
  {
    let broker = this._broker;
    broker.notify("sequence/g1", mode);
  },

};


/**
 * @class Escape
 */
let Escape = new Class().extends(Component);
Escape.definition = {

  get id()
    "escape",

  /** Next line.
   */
  "[sequence('0x85', 'ESC E'), _('Next line')]":
  function NEL() 
  { // Carriage Return
    let screen = this._screen;
    screen.carriageReturn();
    screen.lineFeed();
  },

  /** Tab set */
  "[sequence('0x88', 'ESC H'), _('Tab set.')]": 
  function HTS() 
  {
    let screen = this._screen;
    screen.tab_stops.push(screen.cursor.positionX);
    screen.tab_stops.sort(function(lhs, rhs) lhs > rhs);
  },

  /** reverse index */
  "[sequence('0x8d', 'ESC M'), _('Reverse index.')]": 
  function RI() 
  {
    let screen = this._screen;
    screen.reverseIndex();
    if (this._ansi_mode.LNM) {
      screen.carriageReturn();
    }
  },


  "[sequence('ESC P%s')]": 
  function DCS() 
  {
    let broker = this._broker;
    let message = String.fromCharCode.apply(String, arguments);
    if (/[\x00-\x1f]/.test(message[0])) {
      message = message.replace(/\x00/g, "\\");
      broker.notify("event/data-arrived-recursively", message);
    } else {
      broker.notify("sequence/dcs", message);
    }
  },

  "[sequence('ESC X%s')]": 
  function SOS() 
  {
    let broker = this._broker;
    let message = String.fromCharCode.apply(String, arguments);
    broker.notify("sequence/sos", message);
  },

  "[sequence('ESC _%s')]": 
  function APC() 
  {
    let broker = this._broker;
    let message = String.fromCharCode.apply(String, arguments);
    broker.notify("sequence/apc", message);
  },
  
  "[sequence('ESC ]%s')]": 
  function OSC() 
  {
    let message = String.fromCharCode.apply(String, arguments);
    let delimiter_position = message.indexOf(";");
    let num = message.substr(0, delimiter_position);
    let command = message.substr(delimiter_position + 1);
    let broker = this._broker;
    broker.notify("sequence/osc/" + num, command);
  },
  
  /** private message */
  "[sequence('ESC ^%s')]": 
  function PM() 
  {
    let broker = this._broker;
    let message = String.fromCharCode.apply(String, arguments);
    broker.notify("sequence/pm", message);
  },
 
  /** DEC double-height line, top half. */
  "[sequence('ESC #3')]": 
  function DECDHL_top() 
  {
    let broker = this._broker;
    broker.notify("sequence/double-height-line-top");
  },

  /** DEC double-height line, bottom half. */
  "[sequence('ESC #4')]": 
  function DECDHL_bottom() 
  {
    let broker = this._broker;
    broker.notify("sequence/double-height-line-bottom");
    this._screen.cursorUp(1);
  },

  /** Select default character set. */
  "[sequence('ESC %@')]": 
  function ISO_8859_1() 
  {
    let broker = this._broker;
    broker.notify("change/decoder", "ISO-8859-1");
    broker.notify("change/encoder", "ISO-8859-1");
  },

  /** Select UTF-8 character set. */
  "[sequence('ESC %G')]": 
  function UTF_8() 
  {
    let broker = this._broker;
    broker.notify("change/decoder", "UTF-8");
    broker.notify("change/encoder", "UTF-8");
  },

  /** Exit VT52 mode. 
   * TODO exit VT52 mode
   */
  "[sequence('ESC <')]": 
  function ExitVT52() 
  {
    coUtils.Debug.reportWarning(
      "%s sequence [%s] was ignored.",
      arguments.callee.name, [].slice.apply(arguments));
  },

  /** Selective Erace Rectangle Area. */
  "[sequence('CSI %d${')]": 
  function DECSERA(n1, n2, n3, n4) 
  {
    coUtils.Debug.reportWarning(
      "%s sequence [%s] was ignored.",
      arguments.callee.name, [].slice.apply(arguments));
  },

  /** Soft Terminal reset. */
  "[sequence('CSI !p')]": 
  function DECSTR() 
  {
    coUtils.Debug.reportWarning(
      "%s sequence [%s] was ignored.",
      arguments.callee.name, [].slice.apply(arguments));
  },

  /** Soft Terminal reset. */
  "[sequence('CSI %d\"p')]": 
  function DECSCL() 
  {
    coUtils.Debug.reportWarning(
      "%s sequence [%s] was ignored.",
      arguments.callee.name, [].slice.apply(arguments));
  },

  /** 
   * RIS — Reset to Initial State
   * 
   * This control function causes a nonvolatile memory (NVR) recall to 
   * occur. RIS replaces all set-up features with their saved settings.
   * 
   * The terminal stores these saved settings in NVR memory. 
   * The saved setting for a feature is the same as the factory-default 
   * setting, unless you saved a new setting.
   *
   * Note
   * 
   * It is recommended that you not use RIS to reset the terminal. 
   * You should use a soft terminal reset (DECSTR) instead. 
   * RIS usually causes a communication line disconnect and may change the 
   * current baud rate settings. When performing a RIS, the terminal sends 
   * XOFF to the host to stop communication. When the RIS is complete, the 
   * terminal sends XON to resume communication.
   *
   * Format
   *
   * ESC    c
   * 1/11   6/3
   *
   * RIS Actions
   * 
   *   - Sets all features listed on set-up screens to their saved settings.
   *   - Causes a communication line disconnect.
   *   - TODO: Clears user-defined keys.
   *   - TODO: Clears the screen and all off-screen page memory.
   *   - Clears the soft character set.
   *   - Clears page memory. All data stored in page memory is lost.
   *   - Clears the screen.
   *   - Returns the cursor to the upper-left corner of the screen.
   *   - Sets the select graphic rendition (SGR) function to normal rendition.
   *   - Selects the default character sets (ASCII in GL, and DEC Supplemental Graphic in GR).
   *   - Clears all macro definitions.
   *   - Erases the paste buffer.
   *
   */
  "[sequence('ESC c')]": 
  function RIS() 
  {
    let session = this._broker;
    session.notify("sequence/g0", coUtils.Constant.CHARSET_US);
    session.notify("sequence/g1", coUtils.Constant.CHARSET_US);
    session.notify("command/hard-terminal-reset");
    this._ansi_mode.reset();
    let screen = this._screen;
    screen.resetScrollRegion();
    screen.cursor.reset();
  },
  
  /** constructor */
  "[subscribe('initialized/{screen & ansimode}'), enabled]": 
  function onLoad(screen, ansi_mode) 
  {
    this._screen = screen;
    this._ansi_mode = ansi_mode;
  },
};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker) 
{
  new Escape(broker);
  new KeypadMode(broker);
  new CharsetMode(broker);
}


