const tap = require('tap');
const test = tap.test;
const rewire = require('rewire');
const sinon = require('sinon');
const IndeterminateBar = rewire('./indeterminate-bar');

const loadingInit = IndeterminateBar.__get__('loadingInit');
const barLoadingInit = IndeterminateBar.__get__('barLoadingInit');
const updateMessage = IndeterminateBar.__get__('updateMessage');
const clearLine = IndeterminateBar.__get__('clearLine');
const showCursor = IndeterminateBar.__get__('showCursor');

test('IndeterminateBar', (t) => {
  let inloadingInitSpy;
  let barLoadingInitSpy;
  let updateMessageSpy;
  let clearLineSpy;
  let showCursorSpy;

  tap.beforeEach((end) => {
    inloadingInitSpy = sinon.spy();
    barLoadingInitSpy = sinon.spy();
    updateMessageSpy = sinon.spy();
    clearLineSpy = sinon.spy();
    showCursorSpy = sinon.spy();
    IndeterminateBar.__set__('loadingInit', inloadingInitSpy);
    IndeterminateBar.__set__('barLoadingInit', barLoadingInitSpy);
    IndeterminateBar.__set__('updateMessage', updateMessageSpy);
    IndeterminateBar.__set__('clearLine', clearLineSpy);
    IndeterminateBar.__set__('showCursor', showCursorSpy);

    end();
  });

  t.test('function: indeterminateBarLoadingInit', (t) => {
    t.test('Should initialize properties', (t) => {
      const indeterminateBarLoadingInit = IndeterminateBar.__get__('indeterminateBarLoadingInit');

      let context = {};
      indeterminateBarLoadingInit(context);
      t.same(context.foregroundColor, 'cyan');
      t.same(context.backgroundColor, 'gray');
      t.same(context.messageColor, 'cyan');

      context = {}
      const config = { foregroundColor: 'blue', backgroundColor: 'red', messageColor: 'yellow' };
      indeterminateBarLoadingInit(context, config);
      t.same(context.foregroundColor, 'blue');
      t.same(context.backgroundColor, 'red');
      t.same(context.messageColor, 'yellow');

      t.end();
    });

    t.end();
  });

  t.test('function: indeterminateBarRender', (t) => {
    const indeterminateBarRender = IndeterminateBar.__get__('indeterminateBarRender');
    let context;

    tap.beforeEach((end) => {
      context = {
        position: 0,
        intervalId: 123,
        width: 42,
        foregroundColor: 'fakecolor1',
        backgroundColor: 'fakecolor2',
        stream: {
          write: sinon.spy(),
          cursorTo: sinon.spy(),
          clearLine: sinon.spy()
        }
      };
      end();
    });

    t.test('Should update the message', (t) => {
      indeterminateBarRender(context);
      t.ok(updateMessageSpy.called);
      t.end();
    });

    t.test('Should clear the line', (t) => {
      indeterminateBarRender(context);
      t.ok(clearLineSpy.called);
      t.end();
    });

    t.test('Should increment the position', (t) => {
      indeterminateBarRender(context);
      t.same(context.position, 1);
      indeterminateBarRender(context);
      t.same(context.position, 2);
      indeterminateBarRender(context);
      t.same(context.position, 3);
      t.end();
    });

    t.end();
  });

  t.test('function: calculateBarWidths', (t) => {
    const calculateBarWidths = IndeterminateBar.__get__('calculateBarWidths');

    t.test('Should calculate the widths correctly', (t) => {
      let widths = calculateBarWidths({ position: 13, width: 100 });
      t.same(widths.foreground, 20);
      t.same(widths.visibleForeground, 13);
      t.same(widths.background1, 0);
      t.same(widths.background2, 87);

      widths = calculateBarWidths({ position: 46, width: 100 });
      t.same(widths.foreground, 20);
      t.same(widths.visibleForeground, 20);
      t.same(widths.background1, 26);
      t.same(widths.background2, 54);

      widths = calculateBarWidths({ position: 107, width: 100 });
      t.same(widths.foreground, 20);
      t.same(widths.visibleForeground, 13);
      t.same(widths.background1, 87);
      t.same(widths.background2, 0);

      t.end();
    });

    t.end();
  });

  t.test('function: IndeterminateBar', (t) => {
    t.test('Should call the initialization functions', (t) => {
      const config = {};
      const inindeterminateBarLoadingInitSpy = sinon.spy();
      IndeterminateBar.__set__('indeterminateBarLoadingInit', inindeterminateBarLoadingInitSpy);
      IndeterminateBar(config);
      t.ok(inloadingInitSpy.called);
      t.equal(inloadingInitSpy.args[0][1], config);
      t.ok(barLoadingInitSpy.called);
      t.equal(barLoadingInitSpy.args[0][1], config);
      t.ok(inindeterminateBarLoadingInitSpy.called);
      t.equal(inindeterminateBarLoadingInitSpy.args[0][1], config);

      t.end();
    });

    t.test('Should expose the right interface', (t) => {
      const loading = IndeterminateBar();

      t.ok(loading.start);
      t.ok(loading.stop);

      t.end();
    });

    t.end();
  });

  t.test('method: stop', (t) => {
    let loading;

    t.beforeEach((end) => {
      loading = IndeterminateBar();
      end();
    });

    t.test('Should clear the line', (t) => {
      loading.stop();
      t.ok(clearLineSpy.called);
      t.end();
    });

    t.test('Should bring back the cursor', (t) => {
      loading.stop();
      t.ok(showCursorSpy.called);
      t.end();
    });

    t.end();
  });

  t.tearDown(() => {
    IndeterminateBar.__set__('loadingInit', loadingInit);
    IndeterminateBar.__set__('barLoadingInit', barLoadingInit);
    IndeterminateBar.__set__('updateMessage', updateMessage);
    IndeterminateBar.__set__('clearLine', clearLine);
    IndeterminateBar.__set__('showCursor', showCursor);
  });

  t.end();
});

