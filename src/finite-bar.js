'use strict';

const {
  loadingSharedOperations,
  barSharedOperations,
  finiteLoadingSharedOperations,
  loadingInit,
  barLoadingInit,
  finiteLoadingInit
} = require('./common');

const finiteBarLoadingInit = (self, {
  completedColor = 'green',
  remainingColor = 'gray',
  messageColor = completedColor
} = {}) => {
  self.completedColor = completedColor;
  self.remainingColor = remainingColor;
  self.messageColor = messageColor;
};

function finiteBarRender() {
  this.updateMessage();
  this.clearLine();
  const completedChars = Math.round(this.progress / (100 / this.width));
  const remainingChars = this.width - completedChars;
  this.stream.write(`${'◼'.repeat(completedChars)[this.completedColor]}${'◼'.repeat(remainingChars).dim[this.remainingColor]}`);
}

const FiniteBar = (config) => {
  const self = {};
  loadingInit(self, config);
  barLoadingInit(self, config);
  finiteLoadingInit(self, config);
  finiteBarLoadingInit(self, config);
  return Object.assign(self,
    finiteLoadingSharedOperations,
    barSharedOperations,
    loadingSharedOperations,
    { render: finiteBarRender });
};

module.exports = FiniteBar;
