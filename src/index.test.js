const test = require('tap').test;
const FiniteBar = require('./finite-bar');
const index = require('./index');

test('Should return loading functions', (t) => {
  t.same(index.FiniteBar, FiniteBar);
  t.end();
});
