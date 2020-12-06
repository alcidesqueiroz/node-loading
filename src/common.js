'use strict';

const whatype = require('whatype');
const signalExit = require('signal-exit');
const childProcess = require('child_process');

const CONSOLE_WIDTH = process.stdout.columns;
let isCursorVisible = true;

function start(context, render) {
  context.row = context.row !== undefined ? context.row : getCursorPosition().row - 1;
  // Brings back the cursor no matter how the process exits
  signalExit(() => showCursor(context, true), { alwaysLast: true });

  hideCursor(context);
  render(context);
}

function setProgress(context, render, progress) {
  if (!whatype.is(progress, 'number')) throw new Error('The "progress" argument must be a number.');
  if (progress < 0 || progress > 100) throw new Error('The "progress" argument must be a number between 0 and 100.');
  context.progress = progress;
  render(context);
}

function clearLine(context, row = context.row) {
  context.stream.cursorTo(0, row);
  context.stream.clearLine();
}

function showCursor(context, force = false) {
  if (!force && isCursorVisible) return;
  isCursorVisible = true;
  context.stream.write('\u001b[?25h');
}

function hideCursor(context) {
  if (!isCursorVisible) return;
  isCursorVisible = false;
  context.stream.write('\u001b[?25l');
}

function updateMessage(context) {
  // Updates the loading message when it changes
  if (!whatype.is(context.message, 'string') || context.message === context.lastMessage) return;

  context.lastMessage = context.message;
  clearLine(context, context.row + 1);
  context.stream.write('> '.gray.dim + context.message.bold[context.messageColor]);
}

const loadingInit = (context, { stream = 'STDERR', row } = {}) => {
  context.row = row;
  context.stream = { 'STDERR': process.stderr, 'STDOUT': process.stdout }[stream];
};

const barLoadingInit = (context, { width = CONSOLE_WIDTH } = {}) => {
  context.width = width;
};

const determinateLoadingInit = (context) => {
  context.progress = 0;
};

const getCursorPosition = () => {
  return JSON.parse(childProcess.execSync('./src/get-cursor-position.sh').toString());
};


module.exports = {
  loadingInit,
  barLoadingInit,
  determinateLoadingInit,
  start,
  updateMessage,
  clearLine,
  showCursor,
  setProgress
};
