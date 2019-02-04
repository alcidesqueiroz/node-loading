const tap = require('tap');
const test = tap.test;
const rewire = require('rewire');
const sinon = require('sinon');
const DeterminateBar = rewire('./determinate-bar');

const loadingInit = DeterminateBar.__get__('loadingInit');
const barLoadingInit = DeterminateBar.__get__('barLoadingInit');
const determinateLoadingInit = DeterminateBar.__get__('determinateLoadingInit');
const updateMessage = DeterminateBar.__get__('updateMessage');
const clearLine = DeterminateBar.__get__('clearLine');
const showCursor = DeterminateBar.__get__('showCursor');

test('DeterminateBar', (t) => {
  let loadingInitSpy;
  let barLoadingInitSpy;
  let determinateLoadingInitSpy;
  let updateMessageSpy;
  let clearLineSpy;
  let showCursorSpy;

  tap.beforeEach((end) => {
    loadingInitSpy = sinon.spy();
    barLoadingInitSpy = sinon.spy();
    determinateLoadingInitSpy = sinon.spy();
    updateMessageSpy = sinon.spy();
    clearLineSpy = sinon.spy();
    showCursorSpy = sinon.spy();
    DeterminateBar.__set__('loadingInit', loadingInitSpy);
    DeterminateBar.__set__('barLoadingInit', barLoadingInitSpy);
    DeterminateBar.__set__('determinateLoadingInit', determinateLoadingInitSpy);
    DeterminateBar.__set__('updateMessage', updateMessageSpy);
    DeterminateBar.__set__('clearLine', clearLineSpy);
    DeterminateBar.__set__('showCursor', showCursorSpy);

    end();
  });

  t.test('function: determinateBarLoadingInit', (t) => {

    t.test('Should initialize properties', (t) => {
      const determinateBarLoadingInit = DeterminateBar.__get__('determinateBarLoadingInit');

      let context = {};
      determinateBarLoadingInit(context);
      t.same(context.completedColor, 'green');
      t.same(context.remainingColor, 'gray');
      t.same(context.messageColor, 'green');

      context = {}
      const config = { completedColor: 'blue', remainingColor: 'red', messageColor: 'yellow' };
      determinateBarLoadingInit(context, config);
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
        completedColor: 'fakecolor1',
        remainingColor: 'fakecolor2',
        stream: {
          write: sinon.spy()
        }
      }
      end();
    });

    t.test('Should update the message', (t) => {
      determinateBarRender(context);
      t.ok(updateMessageSpy.called);
      t.end();
    });

    t.test('Should clear the line', (t) => {
      determinateBarRender(context);
      t.ok(clearLineSpy.called);
      t.end();
    });

    t.test('Should calculate the completed width', (t) => {
      sinon.spy(Math, 'round');
      determinateBarRender(context);
      t.ok(Math.round.called);
      t.same(Math.round.args[0][0], 21);
      Math.round.restore();
      t.end();
    });

    t.test('Should render the bar correctly', (t) => {
      const getter = chr => function() { return this.replace(/◼/g, chr); };
      Object.defineProperty(String.prototype, 'fakecolor1', { get: getter('1') });
      Object.defineProperty(String.prototype, 'fakecolor2', { get: getter('0') });

      determinateBarRender(context);
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
      const determinateBarLoadingInitSpy = sinon.spy();
      DeterminateBar.__set__('determinateBarLoadingInit', determinateBarLoadingInitSpy);
      DeterminateBar(config);
      t.ok(loadingInitSpy.called);
      t.equal(loadingInitSpy.args[0][1], config);
      t.ok(barLoadingInitSpy.called);
      t.equal(barLoadingInitSpy.args[0][1], config);
      t.ok(determinateLoadingInitSpy.called);
      t.equal(determinateLoadingInitSpy.args[0][1], config);
      t.ok(determinateBarLoadingInitSpy.called);
      t.equal(determinateBarLoadingInitSpy.args[0][1], config);

      t.end();
    });

    t.test('Should expose the right interface', (t) => {
      const loading = DeterminateBar();

      t.ok(loading.start);
      t.ok(loading.setProgress);
      t.ok(loading.stop);

      t.end();
    });

    t.end();
  });

  t.test('method: stop', (t) => {
    t.test('Should clear the line', (t) => {
      let loading = DeterminateBar();
      loading.stop();
      t.ok(clearLineSpy.called);
      t.end();
    });

    t.test('Should bring back the cursor', (t) => {
      const loading = DeterminateBar();
      loading.stop();
      t.ok(showCursorSpy.called);
      t.end();
    });

    t.end();
  });

  t.tearDown(() => {
    DeterminateBar.__set__('loadingInit', loadingInit);
    DeterminateBar.__set__('barLoadingInit', barLoadingInit);
    DeterminateBar.__set__('determinateLoadingInit', determinateLoadingInit);
    DeterminateBar.__set__('updateMessage', updateMessage);
    DeterminateBar.__set__('clearLine', clearLine);
    DeterminateBar.__set__('showCursor', showCursor);
  });

  t.end();
});

