'use strict';

const whatype = require('whatype');
const signalExit = require('signal-exit');
const getCursorPosition = require('get-cursor-position');

const CONSOLE_WIDTH = process.stdout.columns;
let isCursorVisible = true;

const loadingSharedOperations = {
  start() {
    this.row = this.row !== undefined ? this.row : getCursorPosition.sync().row - 1;
    // Brings back the cursor no matter how the process exits
    signalExit(() => this.showCursor(true), { alwaysLast: true });
    this.hideCursor();
    this.render();
  },

  stop() {
    this.showCursor();
  },

  clearLine(row) {
    this.stream.cursorTo(0, row !== undefined ? row : this.row);
    this.stream.clearLine();
  },

  showCursor(force = false) {
    if (!force && isCursorVisible) return;
    isCursorVisible = true;
    this.stream.write('\u001b[?25h');
  },

  hideCursor() {
    if (!isCursorVisible) return;
    isCursorVisible = false;
    this.stream.write('\u001b[?25l');
  }
};

const barSharedOperations = {
  updateMessage() {
    // Updates the loading message when it changes
    if (!whatype.is(this.message, 'string') || this.message === this.lastMessage) return;

    this.lastMessage = this.message;
    this.clearLine(this.row + 1);
    this.stream.write('> '.gray.dim + this.message.bold[this.messageColor]);
  }
};

const determinateLoadingSharedOperations = {
  setProgress(progress) {
    if (!whatype.is(progress, 'number')) throw new Error('The "progress" argument must be a number.');
    if (progress < 0 || progress > 100) throw new Error('The "progress" argument must be a number between 0 and 100.');
    this.progress = progress;
    this.render();
  },
};

const loadingInit = (self, { stream = 'STDERR', row } = {}) => {
  self.row = row;
  self.stream = { 'STDERR': process.stderr, 'STDOUT': process.stdout }[stream];
};

const barLoadingInit = (self, { width = CONSOLE_WIDTH } = {}) => {
  self.width = width;
};

const determinateLoadingInit = (self) => {
  self.progress = 0;
};

module.exports = {
  loadingSharedOperations,
  barSharedOperations,
  determinateLoadingSharedOperations,
  loadingInit,
  barLoadingInit,
  determinateLoadingInit
};
