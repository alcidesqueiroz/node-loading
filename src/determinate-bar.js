'use strict';

const {
  loadingInit,
  barLoadingInit,
  determinateLoadingInit,
  clearLine,
  updateMessage,
  setProgress,
  showCursor,
  start
} = require('./common');

const determinateBarLoadingInit = (context, {
  completedColor = 'green',
  remainingColor = 'gray',
  messageColor = completedColor
} = {}) => {
  context.completedColor = completedColor;
  context.remainingColor = remainingColor;
  context.messageColor = messageColor;
};

function determinateBarRender(context) {
  updateMessage(context);
  clearLine(context);
  const completedChars = Math.round(context.progress / (100 / context.width));
  const remainingChars = context.width - completedChars;
  context.stream.write(`${'◼'.repeat(completedChars)[context.completedColor]}${'◼'.repeat(remainingChars).dim[context.remainingColor]}`);
}

const DeterminateBar = (config) => {
  const context = {};
  loadingInit(context, config);
  barLoadingInit(context, config);
  determinateLoadingInit(context, config);
  determinateBarLoadingInit(context, config);
  return Object.assign(context,
    {
      start: () => start(context, determinateBarRender),
      stop: () => {
        clearLine(context);
        showCursor(context);
      },
      setProgress: progress => setProgress(context, determinateBarRender, progress)
    });
};

module.exports = DeterminateBar;
