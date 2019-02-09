const test = require('tap').test;
const DeterminateBar = require('./src/determinate-bar');
const IndeterminateBar = require('./src/indeterminate-bar');
const index = require('./index');

test('Should return loading functions', (t) => {
  t.same(index.DeterminateBar, DeterminateBar);
  t.same(index.IndeterminateBar, IndeterminateBar);
  t.end();
});
