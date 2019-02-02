const tap = require('tap');
const test = tap.test;
const rewire = require('rewire');
const sinon = require('sinon');
const DeterminateBar = rewire('./determinate-bar');

let loadingInit;
let barLoadingInit;
let determinateLoadingInit;
let loadingSharedOperations;
let barSharedOperations;
let determinateLoadingSharedOperations;

test('DeterminateBar', (t) => {
  tap.beforeEach((end) => {
    loadingSharedOperations = { op1: () => {} };
    barSharedOperations = { op2: () => {} };
    determinateLoadingSharedOperations = { op3: () => {} };
    loadingInit = sinon.spy();
    barLoadingInit = sinon.spy();
    determinateLoadingInit = sinon.spy();
    DeterminateBar.__set__('loadingSharedOperations', loadingSharedOperations);
    DeterminateBar.__set__('barSharedOperations', barSharedOperations);
    DeterminateBar.__set__('determinateLoadingSharedOperations', determinateLoadingSharedOperations);
    DeterminateBar.__set__('loadingInit', loadingInit);
    DeterminateBar.__set__('barLoadingInit', barLoadingInit);
    DeterminateBar.__set__('determinateLoadingInit', determinateLoadingInit);

    end();
  });

  t.test('function: determinateBarLoadingInit', (t) => {
    const determinateBarLoadingInit = DeterminateBar.__get__('determinateBarLoadingInit');

    t.test('Should initialize properties', (t) => {
      let context = {};
      determinateBarLoadingInit(context);
      t.same(context.completedColor, 'green');
      t.same(context.remainingColor, 'gray');
      t.same(context.messageColor, 'green');

      context = {}

      const props = { completedColor: 'blue', remainingColor: 'red', messageColor: 'yellow' };
      determinateBarLoadingInit(context, props);
      t.same(context.completedColor, 'blue');
      t.same(context.remainingColor, 'red');
      t.same(context.messageColor, 'yellow');

      t.end();
    });

    t.end();
  });

  t.test('function: determinateBarRender', (t) => {
    const determinateBarRender = DeterminateBar.__get__('determinateBarRender');
    let context;

    tap.beforeEach((end) => {
      context = {
        progress: 50,
        width: 42,
        updateMessage: sinon.spy(),
        clearLine: sinon.spy(),
        completedColor: 'fakecolor1',
        remainingColor: 'fakecolor2',
        stream: {
          write: sinon.spy()
        }
      }
      end();
    });

    t.test('Should update the message', (t) => {
      determinateBarRender.call(context);
      t.ok(context.updateMessage.called);
      t.end();
    });

    t.test('Should clear the line', (t) => {
      determinateBarRender.call(context);
      t.ok(context.clearLine.called);
      t.end();
    });

    t.test('Should calculate the completed width', (t) => {
      sinon.spy(Math, 'round');
      determinateBarRender.call(context);
      t.ok(Math.round.called);
      t.same(Math.round.args[0][0], 21);
      Math.round.restore();
      t.end();
    });

    t.test('Should render the bar correctly', (t) => {
      const getter = chr => function() { return this.replace(/◼/g, chr); };
      Object.defineProperty(String.prototype, 'fakecolor1', { get: getter('1') });
      Object.defineProperty(String.prototype, 'fakecolor2', { get: getter('0') });

      determinateBarRender.call(context);
      const write = context.stream.write;
      t.ok(write.called);
      t.same(write.args[0][0], `${'1'.repeat(21)}${'0'.repeat(21)}`);

      t.end();
    });

    t.end();
  });

  t.test('function: DeterminateBar', (t) => {
    t.test('Should call the initialization functions', (t) => {
      const config = {};
      const determinateBarLoadingInit = sinon.spy();
      DeterminateBar.__set__('determinateBarLoadingInit', determinateBarLoadingInit);
      DeterminateBar(config);
      t.ok(loadingInit.called);
      t.same(loadingInit.args[0][1], config);
      t.ok(barLoadingInit.called);
      t.same(barLoadingInit.args[0][1], config);
      t.ok(determinateLoadingInit.called);
      t.same(determinateLoadingInit.args[0][1], config);
      t.ok(determinateBarLoadingInit.called);
      t.same(determinateBarLoadingInit.args[0][1], config);

      t.end();
    });

    t.test('Should return an object with all needed methods', (t) => {
      const loading = DeterminateBar({});

      t.same(loading.op1, loadingSharedOperations.op1);
      t.same(loading.op2, barSharedOperations.op2);
      t.same(loading.op3, determinateLoadingSharedOperations.op3);
      t.same(loading.render, DeterminateBar.__get__('determinateBarRender'));

      t.end();
    });

    t.end();
  });

  t.end();
});
