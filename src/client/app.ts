import { AppBase } from '../core/appbase';
import { CoreConstants } from '../constants';
import { KeyboardEventHook } from './keyboardeventhook';


const BrowserTypes = CoreConstants.BrowserTypes;

export class SJAPP extends AppBase {
 
  public run() {
    this._updatePlatform();
    this._updateBrowser();
    // this.environmentManager().start(defaultEnv);
    const khook = new KeyboardEventHook(this);
    khook.onHook(this);
  
    this.eventManager().keyboardEvents().listenKeyDown((context) => {
      if (context.keyEventArgs().isCtrlPressed && context.keyEventArgs().keyCode === 'KeyZ') {
        this.transactionManager().undo();
        context.isHandled = true;
      }
      if (context.keyEventArgs().isCtrlPressed && context.keyEventArgs().keyCode === 'KeyR') {
        this.transactionManager().redo();
        context.isHandled = true;
      }
    });

  }

  private _updateBrowser() {
    const userAgent = navigator.userAgent;
    const isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) {
      this._browser = BrowserTypes.Opera;
    }
    if (userAgent.indexOf('Firefox') > -1) {
      this._browser = BrowserTypes.Firefox;
    }
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
      this._browser = BrowserTypes.Chrome;
    }
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      this._browser = BrowserTypes.IE;
    }
    if (userAgent.indexOf('Trident') > -1) {
      this._browser = BrowserTypes.Trident;
    }
    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
      this._browser = BrowserTypes.Trident;
    }
  }

  private _updatePlatform() {
    const isWin = (window.navigator.platform === 'Win32') || (window.navigator.platform === 'Windows');
    if (isWin) {
      this.platform = CoreConstants.PlatformTypes.Windows;
      return;
    }
    const isMac = (window.navigator.platform === 'Mac68K') || (window.navigator.platform === 'MacPPC') ||
      (window.navigator.platform === 'Macintosh') || (window.navigator.platform === 'MacIntel');
    if (isMac) {
      this.platform = CoreConstants.PlatformTypes.Mac;
      return;
    }
    const isUnix = (window.navigator.platform === 'X11') && !isWin && !isMac;
    if (isUnix) {
      this.platform = CoreConstants.PlatformTypes.Unix;
      return;
    }
    const isLinux = (String(window.navigator.platform).indexOf('Linux') > -1);
    if (isLinux) {
      this.platform = CoreConstants.PlatformTypes.Linux;
      return;
    }
    const isIos = /(iPhone|iPad|iPod|iOS)/i.test(window.navigator.userAgent);
    if (isIos) {
      this.platform = CoreConstants.PlatformTypes.IOS;
      return;
    }
    const isAndroid = /(Android)/i.test(window.navigator.userAgent);
    if (isAndroid) {
      this.platform = CoreConstants.PlatformTypes.Android;
      return;
    }
    this.platform = CoreConstants.PlatformTypes.Other;
  }

}

// instance only
export const App = new SJAPP();