const tap = require('tap');
const test = tap.test;
const rewire = require('rewire');
const sinon = require('sinon');
const FiniteBar = rewire('./finite-bar');

let loadingInit;
let barLoadingInit;
let finiteLoadingInit;
let loadingSharedOperations;
let barSharedOperations;
let finiteLoadingSharedOperations;

test('FiniteBar', (t) => {
  tap.beforeEach((end) => {
    loadingSharedOperations = { op1: () => {} };
    barSharedOperations = { op2: () => {} };
    finiteLoadingSharedOperations = { op3: () => {} };
    loadingInit = sinon.spy();
    barLoadingInit = sinon.spy();
    finiteLoadingInit = sinon.spy();
    FiniteBar.__set__('loadingSharedOperations', loadingSharedOperations);
    FiniteBar.__set__('barSharedOperations', barSharedOperations);
    FiniteBar.__set__('finiteLoadingSharedOperations', finiteLoadingSharedOperations);
    FiniteBar.__set__('loadingInit', loadingInit);
    FiniteBar.__set__('barLoadingInit', barLoadingInit);
    FiniteBar.__set__('finiteLoadingInit', finiteLoadingInit);

    end();
  });

  t.test('function: finiteBarLoadingInit', (t) => {
    const finiteBarLoadingInit = FiniteBar.__get__('finiteBarLoadingInit');

    t.test('Should initialize properties', (t) => {
      let context = {};
      finiteBarLoadingInit(context);
      t.same(context.completedColor, 'green');
      t.same(context.remainingColor, 'gray');
      t.same(context.messageColor, 'green');

      context = {}

      const props = { completedColor: 'blue', remainingColor: 'red', messageColor: 'yellow' };
      finiteBarLoadingInit(context, props);
      t.same(context.completedColor, 'blue');
      t.same(context.remainingColor, 'red');
      t.same(context.messageColor, 'yellow');

      t.end();
    });

    t.end();
  });

  t.test('function: finiteBarRender', (t) => {
    const finiteBarRender = FiniteBar.__get__('finiteBarRender');
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
      finiteBarRender.call(context);
      t.ok(context.updateMessage.called);
      t.end();
    });

    t.test('Should clear the line', (t) => {
      finiteBarRender.call(context);
      t.ok(context.clearLine.called);
      t.end();
    });

    t.test('Should calculate the completed width', (t) => {
      sinon.spy(Math, 'round');
      finiteBarRender.call(context);
      t.ok(Math.round.called);
      t.same(Math.round.args[0][0], 21);
      Math.round.restore();
      t.end();
    });

    t.test('Should render the bar correctly', (t) => {
      const getter = chr => function() { return this.replace(/◼/g, chr); };
      Object.defineProperty(String.prototype, 'fakecolor1', { get: getter('1') });
      Object.defineProperty(String.prototype, 'fakecolor2', { get: getter('0') });

      finiteBarRender.call(context);
      const write = context.stream.write;
      t.ok(write.called);
      t.same(write.args[0][0], `${'1'.repeat(21)}${'0'.repeat(21)}`);

      t.end();
    });

    t.end();
  });

  t.test('function: FiniteBar', (t) => {
    t.test('Should call the initialization functions', (t) => {
      const config = {};
      const finiteBarLoadingInit = sinon.spy();
      FiniteBar.__set__('finiteBarLoadingInit', finiteBarLoadingInit);
      FiniteBar(config);
      t.ok(loadingInit.called);
      t.same(loadingInit.args[0][1], config);
      t.ok(barLoadingInit.called);
      t.same(barLoadingInit.args[0][1], config);
      t.ok(finiteLoadingInit.called);
      t.same(finiteLoadingInit.args[0][1], config);
      t.ok(finiteBarLoadingInit.called);
      t.same(finiteBarLoadingInit.args[0][1], config);

      t.end();
    });

    t.test('Should return an object with all needed methods', (t) => {
      const loading = FiniteBar({});

      t.same(loading.op1, loadingSharedOperations.op1);
      t.same(loading.op2, barSharedOperations.op2);
      t.same(loading.op3, finiteLoadingSharedOperations.op3);
      t.same(loading.render, FiniteBar.__get__('finiteBarRender'));

      t.end();
    });

    t.end();
  });

  t.end();
});
