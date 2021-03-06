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
 * @trait DecModeSequenceHandler
 */
var DecModeSequenceHandler = new Trait();
DecModeSequenceHandler.definition = {

  _dec_save_buffer: null,

  _dec_alternate_buffer: null,

  /** Constructor */
  initialize: function initialize(broker)
  {
    this._dec_save_buffer = {};
    this._dec_alternate_buffer = {};
  },

  /** Handle DECSET sequence */
  "[profile('vt100'), sequence('CSI ? Pm h')]":
  function DECSET()
  { // DEC Private Mode Set
    var i,
        n,
        screen;

    if (0 === arguments.length) {
      coUtils.Debug.reportWarning(_("DECSET: Length of Arguments is zero. "));
    }

    for (i = 0; i < arguments.length; ++i) {

      n = arguments[i];

      this._dec_save_buffer[i] = true;

      switch (n) {

        // Print from feed (DECPFF)
        case 18:
          // TODO: print from feed.
          coUtils.Debug.reportWarning(
            _("DECSET - DECPFF (Print from feed) was ignored."));
          break;

        // Set print extent to full screen (DECPEX)
        case 19:
          // TODO: print from feed.
          coUtils.Debug.reportWarning(
            _("DECSET - DECPEX (Set print extent to full screen) was ignored."));
          break;

        // TODO: Enable shifted key-functions (rxvt)
        case 35:
          this.sendMessage("command/enable-shifted-key-functions");
          coUtils.Debug.reportWarning(
            _("DECSET 35 - Enable-Shifted-Key-Function feature (rxvt) was not ",
              "implemented completely."));
          break;

        // Enable Tektronix mode (DECTEK)
        case 38:
          coUtils.Debug.reportWarning(
            _("DECSET 38 - Enter Tektronix mode (DECTEK)."));
          this.sendMessage("command/change-emulation-mode", "tektronix");
          break;

        // TODO: more(1) fix.
        case 41:
          coUtils.Debug.reportWarning(
            _("DECSET 41 - enable fix for more(1) ",
              "was not implemented."));
          break;

        // TODO: Enable Nation Replacement Character sets (DECNRCM).
        case 42:
          coUtils.Debug.reportWarning(
            _("DECSET 42 - Enable Nation Replacement Character sets (DECNRCM) ",
              "was not implemented."));
          break;

        // TODO: Turn On Margin Bell
        case 44:
          coUtils.Debug.reportWarning(
            _("DECSET 44 - Turn On Margin Bell, ",
              "was not implemented."));
          break;

        // TODO: Start Logging
        case 46:
          coUtils.Debug.reportWarning(
            _("DECSET 46 - Start Logging, ",
              "was not implemented."));
          break;

        // TODO: Backarrow key sends delete (DECBKM)
        case 67:
          coUtils.Debug.reportWarning(
            _("DECSET 67 - Backarrow key sends delete (DECBKM), ",
              "was not implemented."));
          break;

        // TODO: Scroll to bottom on tty output (rxvt).
        case 1010:
          coUtils.Debug.reportWarning(
            _("DECSET 1010 - Scroll to bottom on tty output (rxvt), ",
              "was not implemented."));
          break;

        // TODO: Scroll to bottom on key press (rxvt).
        case 1011:
          coUtils.Debug.reportWarning(
            _("DECSET 1011 - Scroll to bottom on key press (rxvt), ",
              "was not implemented."));
          break;

        // TODO: Enable 8bit meta.
        case 1034:
          coUtils.Debug.reportWarning(
            _("DECSET 1034 - Enable 8bit meta, ",
              "was not implemented."));
          break;

        // TODO: Enable special modifiers for Alt and NumLock keys.
        case 1035:
          coUtils.Debug.reportWarning(
            _("DECSET 1035 - Enable special modifiers for Alt and NumLock keys, ",
              "was not implemented."));
          break;

        // TODO: Send ESC when Meta modifies a key
        // (enables the metaSendsEscape resource).
        case 1036:
          coUtils.Debug.reportWarning(
            _("DECSET 1036 - Send ESC when Meta modifies a key ",
              "(enables the metaSendsEscape resource), ",
              "was not implemented."));
          break;

        // TODO: Send DEL from the editing-keypad Delete key.
        case 1037:
          coUtils.Debug.reportWarning(
            _("DECSET 1037 - Send DEL from ",
              "the editing- keypad Delete key, ",
              "was not implemented."));
          break;

        // TODO: Set Sun function-key mode.
        case 1051:
          coUtils.Debug.reportWarning(
            _("DECSET 1051 - Set Sun function-key mode, ",
              "was not implemented."));
          break;

        // TODO: Set HP function-key mode.
        case 1052:
          coUtils.Debug.reportWarning(
            _("DECSET 1052 - Set HP function-key mode, ",
              "was not implemented."));
          break;

        // TODO: Set legacy keyboard emulation (X11R6).
        case 1060:
          coUtils.Debug.reportWarning(
            _("DECSET 1052 - Set legacy keyboard emulation (X11R6), ",
              "was not implemented."));
          break;

        // TODO: Set Sun/PC keyboard emulation of VT220 keyboard.
        case 1061:
          coUtils.Debug.reportWarning(
            _("DECSET 1052 - Set Sun/PC keyboard emulation of VT220 keyboard, ",
              "was not implemented."));
          break;

        default:
          try {
            this.request("sequence/decset/" + n);
          } catch (e) {
            coUtils.Debug.reportWarning(
              _("%s sequence [%s] was ignored."),
              "DECSET", n);
          }

      } // end switch
    } // end for
  },

  "[profile('vt100'), sequence('CSI ? Pm l')]":
  function DECRST()
  { // DEC-Private Mode Reset
    var i,
        n,
        screen;

    if (0 === arguments.length) {
      coUtils.Debug.reportWarning(_("DECRST: Length of Arguments is zero. "));
    }

    for (i = 0; i < arguments.length; ++i) {

      this._dec_save_buffer[i] = false;

      n = arguments[i];

      switch (n) {

        // Print from feed (DECPFF)
        case 18:
          // TODO: print from feed.
          coUtils.Debug.reportWarning(
            _("DECRST - DECPFF (Print from feed) was ignored."));
          break;

        // Set print extent to full screen (DECPEX)
        case 19:
          // TODO: print from feed.
          coUtils.Debug.reportWarning(
            _("DECRST - DECPEX (Set print extent to full screen) was ignored."));
          break;

        // TODO: Enable shifted key-functions (rxvt)
        case 35:
          this.sendMessage("command/disable-shifted-key-functions");
          coUtils.Debug.reportWarning(
            _("DECRST - Enable-Shifted-Key-Function feature (rxvt) was not ",
              "implemented completely."));
          break;

        // TODO: No more(1) fix.
        case 41:
          coUtils.Debug.reportWarning(
            _("DECRST 41 - disable fix for more(1) ",
              "was not implemented."));
          break;

        // TODO: Enable Nation Replacement Character sets (DECNRCM).
        case 42:
          coUtils.Debug.reportWarning(
            _("DECRST 42 - Enable Nation Replacement Character sets (DECNRCM) ",
              "was not implemented."));
          break;

        // TODO: Turn Off Margin Bell
        case 44:
          coUtils.Debug.reportWarning(
            _("DECRST 44 - Turn Off Margin Bell, ",
              "was not implemented."));
          break;

        // TODO: Stop Logging
        case 46:
          coUtils.Debug.reportWarning(
            _("DECRST 46 - Stop Logging, ",
              "was not implemented."));
          break;

        // TODO: Backarrow key sends backspace (DECBKM)
        case 67:
          coUtils.Debug.reportWarning(
            _("DECRST 67 - Backarrow key sends delete (DECBKM), ",
              "was not implemented."));
          break;

        // TODO: Don't scroll to bottom on tty output (rxvt).
        case 1010:
          coUtils.Debug.reportWarning(
            _("DECRST 1010 - Don't scroll to bottom on tty output (rxvt), ",
              "was not implemented."));
          break;

        // TODO: Don't scroll to bottom on key press (rxvt).
        case 1011:
          coUtils.Debug.reportWarning(
            _("DECRST 1010 - Don't scroll to bottom on key press (rxvt), ",
              "was not implemented."));
          break;

        // TODO:Disable 8bit meta.
        case 1034:
          coUtils.Debug.reportWarning(
            _("DECRST 1034 - Disable 8bit meta, ",
              "was not implemented."));
          break;

        // TODO:Disable special modifiers for Alt and NumLock keys.
        case 1035:
          coUtils.Debug.reportWarning(
            _("DECRST 1035 - Disable special modifiers for Alt and NumLock keys, ",
              "was not implemented."));
          break;

        // TODO:Don't send ESC when Meta modifies a key
        // (disables the metaSendsEscape resource).
        case 1036:
          coUtils.Debug.reportWarning(
            _("DECRST 1036 - Don't send ESC when Meta modifies a key ",
              "(disables the metaSendsEscape resource), ",
              "was not implemented."));
          break;

        // TODO:Send VT220 Remove from the editing- keypad Delete key.
        case 1037:
          coUtils.Debug.reportWarning(
            _("DECRST 1037 - Send VT220 Remove from ",
              "the editing- keypad Delete key, ",
              "was not implemented."));
          break;

        // TODO: Reset Sun function-key mode.
        case 1051:
          coUtils.Debug.reportWarning(
            _("DECRST 1051 - Reset Sun function-key mode, ",
              "was not implemented."));
          break;

        // TODO: Reset HP function-key mode.
        case 1052:
          coUtils.Debug.reportWarning(
            _("DECRST 1052 - Reset HP function-key mode, ",
              "was not implemented."));
          break;

        // TODO: Reset legacy keyboard emulation (X11R6).
        case 1060:
          coUtils.Debug.reportWarning(
            _("DECRST 1060 - Reset legacy keyboard emulation (X11R6), ",
              "was not implemented."));
          break;

        // TODO: Reset Sun/PC keyboard emulation of VT220 keyboard.
        case 1061:
          coUtils.Debug.reportWarning(
            _("DECRST 1061 - Reset Sun/PC keyboard emulation of VT220 keyboard, ",
              "was not implemented."));
          break;

        default:
          try {
            this.request("sequence/decrst/" + n);
          } catch (e) {
            coUtils.Debug.reportWarning(
              _("%s sequence [%s] was ignored."),
              "DECRST", n);
          }

      } // end switch

    } // end for

  },


}; // DecModeSequenceHandler

/**
 * @trait PeristOptionsTrait
 */
var PersistOptionsTrait = new Trait();
PersistOptionsTrait.definition = {

  /**
   * XT_REST - Restore extended options.
   */
  "[profile('vt100'), sequence('CSI ? Pm r')]":
  function XT_REST(n)
  { // DEC Private Mode Restore

    var save_buffer = this._dec_save_buffer,
        alternate_buffer = this._dec_alternate_buffer,
        i = 0,
        key,
        value;

    for (; i < arguments.length; ++i) {
      key = arguments[i];
      value = save_buffer[key] = alternate_buffer[key];
      if (value) {
        this.DECSET(n);
      } else {
        this.DECRST(n);
      }
    }
  },

  /**
   * XT_SAVE - Save extended options.
   */
  "[profile('vt100'), sequence('CSI ? Pm s')]":
  function XT_SAVE()
  {  // DEC Private Mode Save
    var save_buffer = this._dec_save_buffer,
        alternate_buffer = this._dec_alternate_buffer,
        i = 0,
        key;

    for (; i < arguments.length; ++i) {
      key = arguments[i];
      alternate_buffer[key] = save_buffer[key];
    }
  },

}; // PersistOptionsTrait

/**
 * @class DecPrivateMode
 */
var DecPrivateMode = new Class().extends(Plugin)
                                .mix(DecModeSequenceHandler)
                                .mix(PersistOptionsTrait)
                                .depends("screen")
                                .depends("cursorstate");
DecPrivateMode.definition = {

  id: "decmode",

  getInfo: function getInfo()
  {
    return {
      name: _("Private Mode"),
      version: "0.1",
      description: _("Handle Extended mode switches (CSI ? Pm h).")
    };
  },

  "[persistable] enabled_when_startup": true,

  _screen: null,
  _cursor_state: null,

  /** Installs itself.
   *  @param {InstallContext} context A InstallContext object.
   */
  "[install]":
  function install(context)
  {
    this._screen = context["screen"];
    this._cursor_state = context["cursorstate"];;
  },

  /** Uninstalls itself.
   */
  "[uninstall]":
  function uninstall()
  {
    this._screen = null;
    this._cursor_state = null;
  },

  /**
   * DECRQM_ansi
   * DECRQM - Request Mode - Host To Terminal
   *
   * The host sends this control function to find out if a particular mode is
   * set or reset. The terminal responds with a report mode function
   * (DECRPM - Report Mode - Terminal To Host).
   *
   * DECRQM functions in ANSI and DEC modes.
   *
   * Requesting ANSI Modes
   *
   * CSI     Pa      $       p
   * 9/11    3/n     2/4     7/0
   *
   * Requesting DEC Modes
   *
   * CSI     ?       Pd      $       p
   * 9/11    3/15    3/n     2/4     7/0
   *
   *
   * Parameters
   *
   * Pa
   * indicates the ANSI mode that the host is asking about. Table 5-7 lists
   * the values for Pa.
   * 
   * Pd
   * indicates the DEC mode the host is asking about. Table 5-8 lists the
   * values for Pd.
   *
   * Examples
   * 
   * The following sequences request the setting of some ANSI modes:
   *
   * Host            Meaning
   * CSI 2 $ p       What is the current state of keyboard action mode
   *                 (KAM)? (KAM = 2)
   * CSI 4 $ p       What is the current state of insert/replace mode
   *                 (IRM)? (IRM = 4)
   * 
   * The following sequences request the setting of some DEC modes:
   * Host            Meaning
   * CSI ? 36 $ p    What is the current state of Hebrew encoding mode
   *                 (DECHEM)? (DECHEM = 36)
   * CSI ? 6 $ p     What is the current state of origin mode
   *                 (DECOM)? (DECOM = 6)
   *
   *
   * Notes on DECRQM
   *
   *   The terminal does not respond to a DECRQM sequence when in VT52 mode.
   *   A DECRQM sequence can only ask about one mode at a time.
   *
   * Table 5-7 ANSI Modes for DECRQM, DECRPM, SM, and RM
   *
   * Mode                        Mnemonic    Pa
   * ----------------------------------------------------
   * Guarded area transfer       GATM*       1
   * Keyboard action             KAM         2
   * Control representation      CRM**       3
   * Insert/replace              IRM         4
   * Status reporting transfer   SRTM*       5
   * Vertical editing            VEM*        7
   * Horizontal editing          HEM*        10
   * Positioning unit            PUM*        11
   * Send/receive                SRM         12
   * Format effector action      FEAM*       13
   * Format effector transfer    FETM*       14
   * Multiple area transfer      MATM*       15
   * Transfer termination        TTM*        16
   * Selected area transfer      SATM*       17
   * Tabulation stop             TSM*        18
   * Editing boundary            EBM*        19
   * Line feed/new line          LNM         20
   * ----------------------------------------------------
   *
   * This control function is permanently reset.
   *
   * **The host cannot change the setting of CRM. You can only change CRM from
   * Set-Up. If CRM is set, then the terminal ignores DECRQM and most other
   * control functions.
   *
   *
   * Table 5-8 DEC Modes for DECRQM, DECRPM, SM, and RM
   *
   * Mode                                Mnemonic            Pd
   *
   * Cursor keys                         DECCKM              1
   * ANSI                                DECANM              2
   * Column                              DECCOLM             3
   * Scrolling                           DECSCLM             4
   * Screen                              DECSCNM             5
   * Origin                              DECOM               6
   * Autowrap                            DECAWM              7
   * Autorepeat                          DECARM              8
   * Print form feed                     DECPFF              18
   * Printer extent                      DECPEX              19
   * Text cursor enable                  DECTCEM             25
   * Cursor direction, right to left     DECRLM              34
   * Hebrew keyboard mapping             DECHEBM             35
   * Hebrew encoding mode                DECHEM              36
   * National replacement character set  DECNRCM             42
   * Greek keyboard mapping              DECNAKB             57
   * Horizontal cursor coupling          DECHCCM*            60
   * Vertical cursor coupling            DECVCCM             61
   * Page cursor coupling                DECPCCM             64
   * Numeric keypad                      DECNKM              66
   * Backarrow key                       DECBKM              67
   * Keyboard usage                      DECKBUM             68
   * Vertical split screen               DECVSSM / DECLRMM   69
   * Transmit rate limiting              DECXRLM             73
   * Key position                        DECKPM              81
   * No clearing screen on column change DECNCSM             95
   * Cursor right to left                DECRLCM             96
   * CRT save                            DECCRTSM            97
   * Auto resize                         DECARSM             98
   * Modem control                       DECMCM              99
   * Auto answerback                     DECAAM              100
   * Conceal answerback message          DECCANSM            101
   * Ignoring null                       DECNULM             102
   * Half-duplex                         DECHDPXM            103
   * Secondary keyboard language         DECESKM             104
   * Overscan                            DECOSCNM            106
   */
  "[profile('vt100'), sequence('CSI Pm $ p')]":
  function DECRQM_ansi(n)
  {  // ANSI Mode request
    n = n || 0;

    try {
      this.request("sequence/rqm/" + n);
    } catch (e) {
      this.sendMessage("command/send-sequence/csi", n + ";0$y");
    }
  },

  /**
   * DECRQM_private
   */
  "[profile('vt100'), sequence('CSI ? Pm $ p')]":
  function DECRQM_private(n)
  {  // DEC Private Mode request
    var message;

    n = n || 0;

    try {
      this.request("sequence/decrqm/" + n);
    } catch (e) {
      message = "?" + n + ";0$y";
      this.sendMessage("command/send-sequence/csi", message);
    }
  },


//  CKM:   false,   // Cursor Keys Mode (false: cursor sequence , true: application sequence)
//  ANM:   false,   // Ansi Mode (use VT52 mode)
//  COLM:  false,   // Selecting 80 or 132 Columns per Page (false: 80 columns, true: 132 columns)
  SCLM:  true,    // Scrolling Mode (true: smooth scroll, false: jump scroll)
//  SCNM:  true,    // Screen Mode: Light or Dark Screen (true: reverse video, false: normal display)
//  OM:    false,   // Origin Mode (true: within margins, false: upper-left corner)
  ARM:   true,    // Autorepeat Mode (true: keys autorepeat when pressed for more than 0.5 seconds, false: keys do not autorepeat)
  PFF:   false,   // Print Form Feed Mode (true:  The terminal sends a form feed (FF) to the printer at the end of a printing function.
                 //                       false: The terminal sends nothing to the printer at the end of a printing function.)
  PEX:   false,   // Print Extent Mode (true:  The print function prints the complete page.
                 //                    false: The print function prints the scrolling region only (data inside the margins).)
  RLM:   false,   // Right-to-Left Mode
  HEBM:  false,   // Hebrew/N-A Keyboard Mapping Mode
  HEM:   false,   // Hebrew Encoding Mode
  NRCM:  true,    // National Replacement Character Set Mode (true: 7-bit characters, false: 8-bit characters)
  NAKB:  false,   // Greek/N-A Keyboard Mapping Mode
  HCCM:  false,   // Horizontal Cursor-Coupling Mode (Always false)
  VCCM:  true,    // Vertical Cursor-Coupling Mode
  PCCM:  true,    // Page Cursor-Coupling Mode

  // Numeric Keypad Mode (true: application sequence, false: keypad characters)
  NKM:   true,

  BKM:   false,   // Backarrow Key Mode (true: backspace key, false: delete key)
  KBUM:  false,   // Typewriter or Data Processing Keys (true: data processing keys, false: typewriter keys)
  LRMM:  false,   // Left Right Margin Mode (true: DECSLRM can set margins, false: DECSLRM cannot set margins)
  XRLM:  false,   // Transmit Rate Limiting (true: limited transmit rate, false: unlimited transmit rate)
  NCSM:  false,   // Selecting 80 or 132 Columns per Page
  RLCM:  false,   // Right-to-Left Copy Mode (true: Enable right-to-left copy, false: Disable right-to-left copy)
  CRTSM: true,    // Set/Reset CRT Save Mode (true: enable CRT saver, false: disable CRT saver)
  ARSM:  false,   // Set/Reset Auto Resize Mode (true: enable auto resize, false: disable auto resize)
  MCM:   false,   // Modem Control Mode (true: Enable Modem Control, false: Disable modem control)
  AAM:   false,   // Set/Reset Auto Answerback Mode (true: enables auto answerback, false: disables auto answerback)
  CANSM: false,   // Conceal Answerback Message Mode (true: Conceal answerback message, false: Answerback message is not concealed)
  NULM:  true,    // Null Mode (true: discard NUL characters, false: pass NULL characters to printer)
  HDPXM: false,   // Set/Reset Half-Duplex Mode (true: Set to half-duplex mode, false: Set to full-duplex mode)
  ESKM:  false,   // Enable Secondary Keyboard Language Mode (true: Secondary keyboard mapping, false: Primary keyboard mapping)
  OSCNM: false,   // Set/Reset Overscan Mode (VT520 only, true: Enable overscan, false: Disable overscan)
  FWM:   true,    // Set/Reset Framed Window Mode (true: enables framed windows, false: disables framed windows)
  RPL:   false,   // Review Previous Lines Mode (true: enables review previous lines, false: disables review previous lines)
  HWUM:  false,   // Host Wake-Up Mode (CRT and Energy Saver, true: enables host wake-up mode, false: disables host wake-up mode)
  ATCUM: false,   // Set/Reset Alternate Text Color Underline Mode (true: enables underline text mode, false: disables underline text mode)
  ATCBM: false,   // Set/Reset Alternate Text Color Blink Mode (true: enables blink text mode, false: disables blink text mode)
  BBSM:  false,   // Bold and Blink Style Mode (true: foreground and background, false: foreground only)
  ECM:   false,   // Erase Color Mode (true: erase to screen background [VT], false: erase to text background [PC]

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


};

/**
 * @fn main
 * @brief Module entry point.
 * @param {Broker} broker The Broker object.
 */
function main(broker)
{
  new DecPrivateMode(broker);
}

// EOF
