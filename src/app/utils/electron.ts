// whether it is an electron environment.
let isElectron: boolean = window && window['process'] && (window['process'] as any).type;
let fs: any;
let electron: any;
// an object that can get the electron api in the renderer process.
let remote: any;
// dialog
let dialog: any;

if (isElectron) {
  fs = (window['require'] as any)('fs');
  electron = (window['require'] as any)('electron');
  remote = electron.remote;
}

if (remote) {
  dialog = remote.dialog;
}

export { isElectron, fs, remote, dialog };
