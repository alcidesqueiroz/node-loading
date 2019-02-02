'use strict';

const {
  loadingSharedOperations,
  barSharedOperations,
  determinateLoadingSharedOperations,
  loadingInit,
  barLoadingInit,
  determinateLoadingInit
} = require('./common');

const determinateBarLoadingInit = (self, {
  completedColor = 'green',
  remainingColor = 'gray',
  messageColor = completedColor
} = {}) => {
  self.completedColor = completedColor;
  self.remainingColor = remainingColor;
  self.messageColor = messageColor;
};

function determinateBarRender() {
  this.updateMessage();
  this.clearLine();
  const completedChars = Math.round(this.progress / (100 / this.width));
  const remainingChars = this.width - completedChars;
  this.stream.write(`${'◼'.repeat(completedChars)[this.completedColor]}${'◼'.repeat(remainingChars).dim[this.remainingColor]}`);
}

const DeterminateBar = (config) => {
  const self = {};
  loadingInit(self, config);
  barLoadingInit(self, config);
  determinateLoadingInit(self, config);
  determinateBarLoadingInit(self, config);
  return Object.assign(self,
    determinateLoadingSharedOperations,
    barSharedOperations,
    loadingSharedOperations,
    { render: determinateBarRender });
};

module.exports = DeterminateBar;
