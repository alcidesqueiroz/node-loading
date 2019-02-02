// Fakes for the colors module
['bold', 'dim', 'black', 'green', 'gray'].forEach(m => {
  Object.defineProperty(String.prototype, m, {
    get: function() { return this; }
  })
});

require('./src/index.test');
require('./src/common.test');
require('./src/finite-bar.test');
