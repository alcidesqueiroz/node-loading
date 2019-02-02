const test = require('tap').test;
const DeterminateBar = require('./determinate-bar');
const index = require('./index');

test('Should return loading functions', (t) => {
  t.same(index.DeterminateBar, DeterminateBar);
  t.end();
});
