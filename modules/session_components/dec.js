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

var DEC_CKM   = 1
var DEC_ANM   = 2
var DEC_COLM  = 3
var DEC_SCLM  = 4
var DEC_SCNM  = 5
var DEC_OM    = 6
var DEC_AWM   = 7
var DEC_ARM   = 8
var DEC_PFF   = 9
var DEC_PEX   = 10
var DEC_TCEM  = 11
var DEC_RLM   = 12
var DEC_HEBM  = 13
var DEC_HEM   = 14
var DEC_NRCM  = 15
var DEC_NAKB  = 16
var DEC_HCCM  = 17
var DEC_VCCM  = 18
var DEC_PCCM  = 19
var DEC_NKM   = 20
var DEC_BKM   = 21
var DEC_KBUM  = 22
var DEC_LRMM  = 23 // DECVSSM
var DEC_XRLMM = 24
var DEC_NCSM  = 25
var DEC_RLCM  = 26
var DEC_CRTSM = 27
var DEC_ARSM  = 28
var DEC_MCM   = 29
var DEC_AAM   = 30
var DEC_CANSM = 31
var DEC_NULM  = 32
var DEC_HDPXM = 33
var DEC_ESKM  = 34
var DEC_OSCNM = 35
var DEC_FWM   = 36
var DEC_RPL   = 37
var DEC_HWUM  = 38
var DEC_ATCUM = 39
var DEC_ATCBM = 40
var DEC_BBSM  = 41
var DEC_ECM   = 42

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

  "[profile('vt100'), sequence('CSI ?%dh')]":
  function DECSET() 
  { // DEC Private Mode Set
    var i, n, screen;

    if (0 == arguments.length) {
      coUtils.Debug.reportWarning(_("DECSET: Length of Arguments is zero. "));
    }

    for (i = 0; i < arguments.length; ++i) {

      n = arguments[i];

      this._dec_save_buffer[i] = true;

      switch (n) {

        // Application Cursor Keys (DECCKM)
        case 1:
          this.DECCKM = true; // application cursor
          break;

        // Designate USASCII for character sets G0-G3 (DECANM), and set VT100 mode.
        case 2:
          this.sendMessage("sequence/g0", "B");
          this.sendMessage("sequence/g1", "B");
          this.sendMessage("sequence/g2", "B");
          this.sendMessage("sequence/g3", "B");
          this.sendMessage("command/change-mode", "vt100"); // TODO: write subscriber
          coUtils.Debug.reportWarning(
            _("DECSET - DECANM was not implemented completely."));
          break;

        // 132 column mode (DECCOLM)
        case 3:
          if (this._allow_switching_80_and_132_mode) {
            this.COLM = true;
            this.sendMessage("command/resize-screen", {
              column: 132,
              row: this._screen.height,
            });
            
            screen = this._screen;
            screen.eraseScreenAll();

            this.sendMessage("event/screen-size-changed", { 
              column: screen.width, 
              row: screen.height 
            });

          }
          break;

        // Smooth (Slow) Scloll (DECSCLM)
        case 4:
          // smooth scroll.
          this.sendMessage("command/change-scrolling-mode", true);
          break;

        // Origin Mode (DECOM)
        case 6:
          // TODO: origin mode.
          this._screen.cursor.DECOM = true;
          coUtils.Debug.reportMessage(
            _("DECSET - DECOM (Origin mode) was set: (%d, %d)."),
            this._screen.cursor.originX,
            this._screen.cursor.originY);
          break;

        // X10_MOUSE mode
        case 9:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_X10);
          coUtils.Debug.reportMessage(
            _("DECSET 9 - X10 mouse tracking mode was set."));
          break;

        // cursor blink mode
        case 12:
          this._screen.cursor.blink = false;
          break;

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

        // Show Cursor (DECTCEM)
        case 25:
          this.TCEM = true;
          break;

        // Show Scrollbar (rxvt)
        case 30:
          this.sendMessage("command/scrollbar-show");
          coUtils.Debug.reportMessage(
            _("DECSET 30 - Show scrollbar feature (rxvt) is set."));
          break;

        // Enable shifted key-functions (rxvt)
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
          this.sendMessage("command/change-mode", "tektronix");
          break;

        // Allow 80 <--> 132 mode
        case 40:
          this._allow_switching_80_and_132_mode = true;
          coUtils.Debug.reportMessage(
            _("DECSET 40 - (Allow 80 <--> 132 mode) was called."));
          break;

        // more(1) fix.
        case 41:
          coUtils.Debug.reportWarning(
            _("DECSET 41 - enable fix for more(1) ", 
              "was not implemented."));
          break;

        // Enable Nation Replacement Character sets (DECNRCM).
        case 42:
          coUtils.Debug.reportWarning(
            _("DECSET 42 - Enable Nation Replacement Character sets (DECNRCM) ", 
              "was not implemented."));
          break;

        // Turn On Margin Bell
        case 44:
          coUtils.Debug.reportWarning(
            _("DECSET 44 - Turn On Margin Bell, ", 
              "was not implemented."));
          break;

        // Start Logging
        case 46:
          coUtils.Debug.reportWarning(
            _("DECSET 46 - Start Logging, ", 
              "was not implemented."));
          break;

        // Use Alternate Screen Buffer 
        // (unless disabled by the titleInhibit resource)
        case 47:
          this._screen.switchToAlternateScreen();
          break;

        // Application keypad (DECNKM)
        case 66:
          this.sendMessage(
            "event/keypad-mode-changed", 
            coUtils.Constant.KEYPAD_MODE_APPLICATION);
          break;

        // Backarrow key sends delete (DECBKM)
        case 67:
          coUtils.Debug.reportWarning(
            _("DECSET 67 - Backarrow key sends delete (DECBKM), ", 
              "was not implemented."));
          break;

        // Send Mouse X & Y on button press and release. 
        // See the section Mouse Tracking.
        case 1000:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_NORMAL);
          coUtils.Debug.reportMessage(
            _("DECSET 1000 - VT200 mouse tracking mode was set."));
          break;

        // Use Hilite Mouse Tracking.
        case 1001:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_HIGHLIGHT);
          coUtils.Debug.reportMessage(
            _("DECSET 1001 - xterm hilite mouse tracking mode was set."));
          break;

        // Use Cell Motion Mouse Tracking.
        case 1002:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_BUTTON);
          coUtils.Debug.reportMessage(
            _("DECSET 1002 - xterm cell motion mouse tracking mode was set."));
          break;

        // Use All Motion Mouse Tracking.
        case 1003:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_ANY);
          coUtils.Debug.reportMessage(
            _("DECSET 1003 - xterm all motion mouse tracking mode was set."));
          break;
          
        // Focus reporting mode.
        case 1004:
          this.sendMessage(
            "event/focus-reporting-mode-changed", true);
          coUtils.Debug.reportMessage(
            _("DECSET 1004 - focus reporting mode was set."));
          break;
          
        // Enable utf8-style mouse reporting.
        case 1005:
          this.sendMessage("event/mouse-tracking-type-changed", "utf8");
          coUtils.Debug.reportMessage(
            _("DECSET 1005 - Enable utf8-style mouse reporting, ", 
              "was set."));
          break;
          
        // Enable SGR-style mouse reporting.
        case 1006:
          this.sendMessage("event/mouse-tracking-type-changed", "sgr");
          coUtils.Debug.reportMessage(
            _("DECSET 1006 - Enable SGR-style mouse reporting."));
          break;

        // Scroll to bottom on tty output (rxvt).
        case 1010:
          coUtils.Debug.reportWarning(
            _("DECSET 1010 - Scroll to bottom on tty output (rxvt), ", 
              "was not implemented."));
          break;

        // Scroll to bottom on key press (rxvt).
        case 1011:
          coUtils.Debug.reportWarning(
            _("DECSET 1011 - Scroll to bottom on key press (rxvt), ", 
              "was not implemented."));
          break;
          
        // Enable urxvt-style mouse reporting.
        case 1015:
          this.sendMessage("event/mouse-tracking-type-changed", "urxvt");
          coUtils.Debug.reportMessage(
            _("DECSET 1015 - Enable urxvt-style mouse reporting, ", 
              "was set."));
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

        // Use Alternate Screen Buffer 
        // (unless disabled by the titleInhibit resource)
        case 1047:
          this._screen.switchToAlternateScreen();
          break;

        // Save cursor as in DECSC 
        // (unless disabled by the titleinhibit resource)
        case 1048:
          this._screen.saveCursor();
          break;

        // Save cursor as in DECSC and use Alternate Screen Buffer, 
        // clearing it first (unless disabled by the titleinhibit resource)
        case 1049:
          this._screen.selectAlternateScreen();
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

        // Set bracketed paste mode. 
        case 2004:
          this.sendMessage("command/change-bracketed-paste-mode", true);
          coUtils.Debug.reportMessage(
            _("DECSET 2004 - Set bracketed paste mode is set."));
          break;

        default:
          try {
            this.request("sequence/decset/" + n);
          } catch (e) {
            coUtils.Debug.reportWarning(
              _("%s sequence [%s] was ignored."),
              arguments.callee.name, n);
          }

      } // end switch
    } // end for
  },
  
  "[profile('vt100'), sequence('CSI ?%dl')]":
  function DECRST() 
  { // DEC-Private Mode Reset
    var i, n, screen;

    if (arguments.length == 0) {
      coUtils.Debug.reportWarning(_("DECRST: Length of Arguments is zero. "));
    }

    for (i = 0; i < arguments.length; ++i) {

      this._dec_save_buffer[i] = false;

      n = arguments[i];

      switch (n) {

        // Normal Cursor Keys (DECCKM)
        case 1:
          this.DECCKM = false; // normal cursor
          break;

        // Designate VT52 mode.
        case 2:
          this.sendMessage("command/change-mode", "vt52"); // TODO: write subscriber
          coUtils.Debug.reportWarning(
            _("DECRST - DECANM was not implemented completely."));
          break;

        // 80 column mode (DECCOLM)
        case 3:
          if (this._allow_switching_80_and_132_mode) {
            this.COLM = false;
            this.sendMessage("command/resize-screen", {
              column: 80,
              row: this._screen.height,
            });
            
            screen = this._screen;
            screen.eraseScreenAll();

            this.sendMessage("event/screen-size-changed", { 
              column: screen.width, 
              row: screen.height 
            });

          }
          break;

        // Smooth (Slow) Scloll (DECSCLM)
        case 4:
          // smooth scroll.
          this.sendMessage("command/change-scrolling-mode", false);
          break;

        // Reset Origin Mode (DECOM)
        case 6:
          // TODO: reset origin mode.
          this._screen.cursor.DECOM = false;
          coUtils.Debug.reportMessage(
            _("DECSET - DECOM (Origin mode) was reset: (%d, %d)."),
            this._screen.cursor.positionX,
            this._screen.cursor.positionY);
          break;

        // X10_MOUSE mode
        case 9:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_NONE);
          coUtils.Debug.reportMessage(
            _("DECRST 9 - X10 mouse tracking mode was reset."));
          break;

        // cursor blink mode
        case 12:
          this._screen.cursor.blink = true;
          break;

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

        // Show Cursor (DECTCEM)
        case 25:
          this.TCEM = false;
          break;

        // TODO: Show Scrollbar (rxvt)
        case 30:
          this.sendMessage("command/scrollbar-hide");
          coUtils.Debug.reportMessage(
            _("DECRST 30 - Show-scrollbar feature (rxvt) is reset."));
          break;

        // Enable shifted key-functions (rxvt)
        case 35:
          this.sendMessage("command/disable-shifted-key-functions");
          coUtils.Debug.reportWarning(
            _("DECRST - Enable-Shifted-Key-Function feature (rxvt) was not ", 
              "implemented completely."));
          break;

        // Disallow 80 <--> 132 mode
        case 40:
          this._allow_switching_80_and_132_mode = false;
          coUtils.Debug.reportMessage(
            _("DECRST 40 - (Disallow 80 <--> 132 mode) was called."));
          break;

        // No more(1) fix.
        case 41:
          coUtils.Debug.reportWarning(
            _("DECRST 41 - disable fix for more(1) ", 
              "was not implemented."));
          break;

        // Enable Nation Replacement Character sets (DECNRCM).
        case 42:
          coUtils.Debug.reportWarning(
            _("DECRST 42 - Enable Nation Replacement Character sets (DECNRCM) ", 
              "was not implemented."));
          break;

        // Turn Off Margin Bell
        case 44:
          coUtils.Debug.reportWarning(
            _("DECRST 44 - Turn Off Margin Bell, ", 
              "was not implemented."));
          break;

        // Stop Logging
        case 46:
          coUtils.Debug.reportWarning(
            _("DECRST 46 - Stop Logging, ", 
              "was not implemented."));
          break;

        // Use Normal Screen Buffer 
        // (unless disabled by the titleInhibit resource)
        case 47:
          this._screen.switchToMainScreen();
          break;

        // Numeric keypad (DECNKM)
        case 66:
          this.sendMessage(
            "event/keypad-mode-changed", 
            coUtils.Constant.KEYPAD_MODE_NUMERIC);
          break;

        // Backarrow key sends backspace (DECBKM)
        case 67:
          coUtils.Debug.reportWarning(
            _("DECRST 67 - Backarrow key sends delete (DECBKM), ", 
              "was not implemented."));
          break;

        // Don't Send Mouse X & Y on button press and release. 
        case 1000:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_NONE);
          coUtils.Debug.reportMessage(
            _("DECRST 1000 - VT200 mouse tracking mode was reset."));
          break;

        // Don't Use Hilite Mouse Tracking.
        case 1001:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_NONE);
          coUtils.Debug.reportMessage(
            _("DECRST 1001 - xterm hilite mouse tracking mode was reset."));
          break;

        // Don't Use Cell Motion Mouse Tracking.
        case 1002:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_NONE);
          coUtils.Debug.reportMessage(
            _("DECRST 1002 - xterm cell motion mouse tracking mode was reset."));
          break;

        // Don't Use All Motion Mouse Tracking.
        case 1003:
          this.sendMessage(
            "event/mouse-tracking-mode-changed", 
            coUtils.Constant.TRACKING_NONE);
          coUtils.Debug.reportMessage(
            _("DECRST 1003 - xterm all motion mouse tracking mode was reset."));
          break;

        // Focus reporting mode.
        case 1004:
          this.sendMessage(
            "event/focus-reporting-mode-changed", 
            false);
          coUtils.Debug.reportMessage(
            _("DECSET 1004 - focus reporting mode was reset."));
          break;

        // Enable utf8-style mouse reporting.
        case 1005:
          this.sendMessage(
            "event/mouse-tracking-type-changed", 
            null);
          coUtils.Debug.reportMessage(
            _("DECRST 1005 - Enable utf8-style mouse reporting, ", 
              "was reset."));
          break;
          
        // Enable SGR-style mouse reporting.
        case 1006:
          this.sendMessage(
            "event/mouse-tracking-type-changed", 
            null);
          coUtils.Debug.reportMessage(
            _("DECRST 1006 - Disable SGR-style mouse reporting."));
          break;

        // Don't scroll to bottom on tty output (rxvt).
        case 1010:
          coUtils.Debug.reportWarning(
            _("DECRST 1010 - Don't scroll to bottom on tty output (rxvt), ", 
              "was not implemented."));
          break;

        // Don't scroll to bottom on key press (rxvt).
        case 1011:
          coUtils.Debug.reportWarning(
            _("DECRST 1010 - Don't scroll to bottom on key press (rxvt), ", 
              "was not implemented."));
          break;
           
        // TODO:Disable urxvt-style mouse reporting.
        case 1015:
          this.sendMessage(
            "event/mouse-tracking-type-changed", 
            null);
          coUtils.Debug.reportMessage(
            _("DECRST 1015 - Disable urxvt-style mouse reporting, ", 
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

        // Use Normal Screen Buffer, clearing screen first if in the 
        // Alternate Screen (unless disabled by the titleinhibit resource)
        case 1047:
          this._screen.switchToMainScreen();
          break;

        // Restore cursor as in DECRC 
        // (unless disabled by the titleinhibit resource)
        case 1048:
          this._screen.restoreCursor();
          break;

        // Use Normal Screen Buffer and restore cursor as in DECRC 
        // (unless disabled by the titleinhibit resource)
        case 1049:
          this._screen.selectMainScreen();
          break;

        // Reset Sun function-key mode. 
        case 1051:
          coUtils.Debug.reportWarning(
            _("DECRST 1051 - Reset Sun function-key mode, ", 
              "was not implemented."));
          break;

        // Reset HP function-key mode. 
        case 1052:
          coUtils.Debug.reportWarning(
            _("DECRST 1052 - Reset HP function-key mode, ", 
              "was not implemented."));
          break;

        // Reset legacy keyboard emulation (X11R6). 
        case 1060:
          coUtils.Debug.reportWarning(
            _("DECRST 1060 - Reset legacy keyboard emulation (X11R6), ", 
              "was not implemented."));
          break;

        // Reset Sun/PC keyboard emulation of VT220 keyboard. 
        case 1061:
          coUtils.Debug.reportWarning(
            _("DECRST 1061 - Reset Sun/PC keyboard emulation of VT220 keyboard, ", 
              "was not implemented."));
          break;

        // Reset bracketed paste mode. 
        case 2004:
          this.sendMessage(
            "command/change-bracketed-paste-mode", 
            false);
          coUtils.Debug.reportMessage(
            _("DECRST 2004 - Reset bracketed paste mode is reset."));
          break;

        default:
          try {
            this.sendMessage("sequence/decrst/" + n);
          } catch (e) {
            coUtils.Debug.reportWarning(
              _("%s sequence [%s] was ignored."),
              arguments.callee.name, n);
          }

      } // end switch

    } // end for

  },


  /**
   *
   * Enable Locator Reporting (DECELR)
   *  
   * CSI Ps ; Pu ' z
   *
   * Valid values for the first parameter:
   * Ps = 0 → Locator disabled (default)
   * Ps = 1 → Locator enabled
   * Ps = 2 → Locator enabled for one report, then disabled
   *
   * The second parameter specifies the coordinate unit for locator reports.
   *
   * Valid values for the second parameter:
   * Pu = 0 or omitted → default to character cells
   * Pu = 1 → device physical pixels
   * Pu = 2 → character cells
   *
   */
  "[profile('vt100'), sequence('CSI %d\\'z')]":
  function DECELR(n1, n2) 
  { // Enable Locator Reporting

    var oneshot, pixel;

    switch (n1 || 0) {

      case 0:
        // Locator disabled (default)
        this.sendMessage(
          "command/change-locator-reporting-mode", 
          null); 
        return;

      case 1:
        // Locator enabled
        oneshot = false;
        break;

      case 2:
        // Locator enabled
        oneshot = true;
        break;

      default:
        throw coUtils.Debug.Error(
          _("Invalid locator mode was specified: %d."), n1);

    }

    switch (n2 || 0) {

      case 0:
      case 2:
        // character cells
        pixel = false;
        break;

      case 1:
        // device physical pixels
        pixel = true;
        break;

      default:
        throw coUtils.Debug.Error(
          _("Invalid locator unit was specified: %d."), n1);

    }

    this.sendMessage(
      "command/change-locator-reporting-mode", {
        oneshot: oneshot, 
        pixel: pixel,
      }); 

  },

  /**
   * Select the locator event.
   *
   * Pm = 0      Disables button up/down events, Disables filter rectangle.
   *    = 1      Enables button down event.
   *    = 2      Disables button down event.
   *    = 3      Enables button up event.
   *    = 4      Disables button up event.
   */
  "[profile('vt100'), sequence('CSI %d\\'{')]":
  function DECSLE(n) 
  { // TODO: Select Locator Events
    
    switch (n) {

      case 0:
        this.sendMessage("command/change-decterm-buttonup-event-mode", false);
        this.sendMessage("command/change-decterm-buttondown-event-mode", false);
        break;

      case 1:
        this.sendMessage("command/change-decterm-buttondown-event-mode", true);
        break;

      case 2:
        this.sendMessage("command/change-decterm-buttondown-event-mode", false);
        break;

      case 3:
        this.sendMessage("command/change-decterm-buttonup-event-mode", true);
        break;

      case 3:
        this.sendMessage("command/change-decterm-buttonup-event-mode", false);
        break;

      default:
        throw coUtils.Debug.Error(
          _("Invalid locator event mode was specified: %d."), n);
    }
  },

  /**
   * Requests Locator Report.
   * 
   * Response: CSI Pe ; Pb ; Pr ; Pc ; Pp & w
   * Pe: Event code.
   * Pe =  0    Received a locator report request (DECRQLP), but the locator is unavailable.
   *    =  1    Received a locator report request (DECRQLP).
   *    =  2    Left button down.
   *    =  3    Left button up.
   *    =  4    Middle button down.
   *    =  5    Middle button up.
   *    =  6    Right button down.
   *    =  7    Right button up.
   *    =  8    Button 4 down. (not supported)
   *    =  9    Button 4 up. (not supported)
   *    = 10    Locator outside filter rectangle.
   * 
   * Pb: Button code, ASCII decimal 0-15 indicating which buttons are down if any.
   *     The state of the four buttons on the locator correspond to the low four
   *     bits of the decimal value, "1" means button depressed.
   *   1    Right button.
   *   2    Middle button.
   *   4    Left button.
   *   8    Button 4. (not supported)
   * 
   * Pr: Row coordinate.
   * 
   * Pc: Column coordinate.
   * 
   * Pp: Page. Always 1.
   *
   */
  "[profile('vt100'), sequence('CSI %d\\'|')]":
  function DECRQLP(n) 
  { // Request Locator Position
    this.sendMessage("event/locator-reporting-requested"); 
  },


  "[profile('vt100'), sequence('CSI %d\\ ~')]":
  function DECTME(n) 
  { // DEC Selectively Elase in Line
    coUtils.Debug.reportWarning(
      _("%s sequence [%s] was ignored."),
      arguments.callee.name, Array.slice(arguments));
  },


}; // DecModeSequenceHandler

/**
 * @trait PeristOptionsTrait
 */
var PersistOptionsTrait = new Trait();
PersistOptionsTrait.definition = {

  /**
   * XTREST — Restore extended options.
   */
  "[profile('vt100'), sequence('CSI ?%dr')]":
  function XTREST(n) 
  { // DEC Private Mode Restore
    var save_buffer, alternate_buffer, i, key, value;

    save_buffer = this._dec_save_buffer;
    alternate_buffer = this._dec_alternate_buffer;

    for (i = 0; i < arguments.length; ++i) {
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
   * XTSAVE — Save extended options.
   */
  "[profile('vt100'), sequence('CSI ?%ds')]":
  function XTSAVE() 
  {  // DEC Private Mode Save
    var save_buffer = this._dec_save_buffer,
        alternate_buffer = this._dec_alternate_buffer,
        i, key;

    for (i = 0; i < arguments.length; ++i) {
      key = arguments[i];
      alternate_buffer[key] = save_buffer[key];
    }
  },

}; // PersistOptionsTrait

/**
 * @class DecPrivateMode
 */
var DecPrivateMode = new Class().extends(Component)
                                .mix(DecModeSequenceHandler)
                                .mix(PersistOptionsTrait);
DecPrivateMode.definition = {

  get id()
    "decmode",

  "[subscribe('initialized/{screen & cursorstate}'), enabled]":
  function onLoad(screen, cursor_state)
  {
    this._screen = screen;
    this._cursor_state = cursor_state;
    this.sendMessage("initialized/decmode", this);
  },
  
  // Reverse Autowrap Mode (true: autowrap, false: no autowrap)

  /* 
   * @Property DECCKM
   */
  get DECCKM() 
  {
    return this._ckm;
  },

  set DECCKM(value) 
  {
    var mode;

    if (value) {
      mode = "normal";
    } else {
      mode = "application";
    }
    this.sendMessage("command/change-cursor-mode", mode);
    this._ckm = value;
  },

  /* 
   * @Property TCEM
   * Text Cursor Enable Mode 
   * true:  makes the cursor visible 
   * false: makes the cursor invisible
   */
  get TCEM() 
  {
    return this._tcem;
  },

  set TCEM(value) 
  {
    var cursor_state;

    cursor_state = this._cursor_state;
    cursor_state.visibility = value;
    this._tcem = value;
  },

  _tcem: true,


//  CKM:   false,   // Cursor Keys Mode (false: cursor sequence , true: application sequence)
  ANM:   false,   // Ansi Mode (use VT52 mode)
  COLM:  false,   // Selecting 80 or 132 Columns per Page (false: 80 columns, true: 132 columns)
  SCLM:  true,    // Scrolling Mode (true: smooth scroll, false: jump scroll)
  SCNM:  true,    // Screen Mode: Light or Dark Screen (true: reverse video, false: normal display)
  OM:    false,   // Origin Mode (true: within margins, false: upper-left corner)
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

}

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
