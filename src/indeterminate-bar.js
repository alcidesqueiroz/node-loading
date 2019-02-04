'use strict';

const {
  loadingInit,
  barLoadingInit,
  clearLine,
  updateMessage,
  showCursor,
  start
} = require('./common');

const indeterminateBarLoadingInit = (context, {
  foregroundColor = 'cyan',
  backgroundColor = 'gray',
  messageColor = foregroundColor
} = {}) => {
  context.position = 0;
  context.foregroundColor = foregroundColor;
  context.backgroundColor = backgroundColor;
  context.messageColor = messageColor;
};

function indeterminateBarRender(context) {
  if (!context.intervalId) {
    const speed = context.speed >= 1 && context.speed <= 5 ? context.speed : 5;
    context.intervalId = setInterval(() => indeterminateBarRender(context), 120 - (speed * 20));
  }

  updateMessage(context);
  clearLine(context);

  const widths = calculateBarWidths(context);
  const background1 = `${'◼'.repeat(widths.background1).dim[context.backgroundColor]}`;
  const foreground = `${'◼'.repeat(widths.visibleForeground)[context.foregroundColor]}`;
  const background2 = `${'◼'.repeat(widths.background2).dim[context.backgroundColor]}`;
  context.stream.write(`${background1}${foreground}${background2}`);
  context.position = context.position < (context.width + widths.foreground) ? context.position + 1 : 0;
}

function calculateBarWidths(context) {
  const foreground = Math.round(context.width * 0.20);
  const background1 = foreground > context.position ? 0 : context.position - foreground;

  let visibleForeground;
  if (foreground > context.position)
    visibleForeground = context.position;
  else if (context.position > context.width)
    visibleForeground = (context.width + foreground) - context.position;
  else
    visibleForeground = foreground;

  const background2 = (background1 + visibleForeground) > context.width ?
    0 : context.width - background1 - visibleForeground;

  return { foreground, visibleForeground, background1, background2 };
}

const IndeterminateBar = (config) => {
  const context = {};
  loadingInit(context, config);
  barLoadingInit(context, config);
  indeterminateBarLoadingInit(context, config);
  return Object.assign(context,
    {
      start: () => start(context, indeterminateBarRender),
      stop: () => {
        clearInterval(context.intervalId);
        clearLine(context);
        showCursor(context);
      }
    });
};

module.exports = IndeterminateBar;
