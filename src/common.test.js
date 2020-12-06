const tap = require('tap');
const test = tap.test;
const rewire = require('rewire');
const sinon = require('sinon');
const common = rewire('./common');
const {
  loadingInit,
  barLoadingInit,
  determinateLoadingInit,
  start,
  updateMessage,
  clearLine,
  showCursor,
  setProgress
} = common;

const hideCursor = common.__get__('hideCursor');

test('function: start', (t) => {
  let signalExitSpy;
  let context;
  let hideCursorSpy;
  let showCursorSpy;

  t.beforeEach((end) => {
    context = {
      stream: {
        write: sinon.spy()
      }
    };

    renderSpy = sinon.spy();
    signalExitSpy = sinon.spy();
    hideCursorSpy = sinon.spy();
    showCursorSpy = sinon.spy();
    common.__set__('signalExit', signalExitSpy);
    common.__set__('hideCursor', hideCursorSpy);
    common.__set__('showCursor', showCursorSpy);
    end();
  });

  t.test('Should initialize the row property correctly', (t) => {
    context.row = 10;
    start(context, renderSpy);
    t.same(context.row, 10);

    delete context.row;
    common.__set__('getCursorPosition', () => ({ row: 5 }));
    start(context, renderSpy);
    t.same(context.row, 4);
    t.end();
  });

  t.test('Should restore the cursor when the process exits', (t) => {
    start(context, renderSpy);
    t.ok(signalExitSpy.called);
    t.notOk(showCursorSpy.called);
    signalExitSpy.args[0][0]();
    t.ok(showCursorSpy.called);
    t.end();
  });

  t.test('Should hide the cursor', (t) => {
    start(context, renderSpy);
    t.ok(hideCursorSpy.called);
    t.end();
  });

  t.test('Should render the loading animation', (t) => {
    start(context, renderSpy);
    t.ok(renderSpy.called);
    t.end();
  });

  t.end();
});


test('function: clearLine', (t) => {
  let context;
  t.beforeEach((end) => {
    context = {
      row: {},
      stream: {
        cursorTo: sinon.spy(),
        clearLine: sinon.spy()
      }
    };
    end();
  });

  t.test('Should move the cursor to the beginning of the line', (t) => {
    clearLine(context);
    const cursorToSpy = context.stream.cursorTo;
    t.ok(cursorToSpy.called);
    t.equal(cursorToSpy.args[0][1], context.row);

    const row = {};
    clearLine(context, row);
    t.same(cursorToSpy.args[0][1], row);
    t.end();
  });

  t.test('Should clear the line', (t) => {
    clearLine(context);
    t.ok(context.stream.clearLine.called);
    t.end();
  });

  t.end();
});

test('function: showCursor', (t) => {
  let context;
  t.beforeEach((end) => {
    context = {
      stream: {
        write: sinon.spy()
      }
    };
    end();
  });

  t.test('Should do nothing if the cursor is already visible', (t) => {
    common.__set__('isCursorVisible', true);
    showCursor(context);
    t.notOk(context.stream.write.called);
    t.end();
  });

  t.test('Should show the cursor if it is not visible', (t) => {
    common.__set__('isCursorVisible', false);
    showCursor(context);
    t.ok(common.__get__('isCursorVisible'));
    t.ok(context.stream.write.called);
    t.end();
  });

  t.test('Should always try to show the cursor if the force option is true', (t) => {
    common.__set__('isCursorVisible', true);
    showCursor(context, true);
    t.ok(context.stream.write.called);
    t.end();
  });

  t.end();
});

test('function: hideCursor', (t) => {
  let context;
  common.__set__('hideCursor', hideCursor);

  t.beforeEach((end) => {
    context = {
      stream: {
        write: sinon.spy()
      }
    };
    end();
  });

  t.test('Should do nothing if the cursor is already hidden', (t) => {
    common.__set__('isCursorVisible', false);
    hideCursor(context);
    t.notOk(context.stream.write.called);
    t.end();
  });

  t.test('Should hide the cursor if it is visible', (t) => {
    common.__set__('isCursorVisible', true);
    hideCursor(context);
    t.notOk(common.__get__('isCursorVisible'));
    t.ok(context.stream.write.called);
    t.end();
  });

  t.end();
});

test('function: updateMessage', (t) => {
  let context;

  t.beforeEach((end) => {
    context = {
      stream: {
        write: sinon.spy(),
        cursorTo: sinon.spy(),
        clearLine: sinon.spy()
      }
    };
    end();
  });

  t.test('Should do nothing if the message is not a string or did not change', (t) => {
    context.message = 42;
    updateMessage(context);
    t.notOk(context.stream.clearLine.called);
    context.message = 'we were on a break!';
    context.lastMessage = 'we were on a break!';
    updateMessage(context);
    t.notOk(context.stream.clearLine.called);
    t.end();
  });

  t.test('Should update the lastMessage property', (t) => {
    context.message = 'hello';
    context.lastMessage = 'yoy';
    updateMessage(context);
    t.same(context.message, context.lastMessage);
    t.end();
  });

  t.test('Should clear the line', (t) => {
    context.message = 'hello';
    updateMessage(context);
    t.ok(context.stream.clearLine.called);
    t.end();
  });

  t.test('Should write the message itself', (t) => {
    context.message = 'You can\'t handle the truth!';
    context.messageColor = 'black';
    updateMessage(context);
    t.same(context.stream.write.args[0][0], '> You can\'t handle the truth!');
    t.end();
  });

  t.end();
});

test('function: setProgress', (t) => {
  let context;
  let render;
  t.beforeEach((end) => {
    render = sinon.spy(),
    context = {};
    end();
  });

  t.test('Should throw an error if the progress param is not a number', (t) => {
    const expectedError = { message: 'The "progress" argument must be a number.' };
    t.throws(() => setProgress(context, render, '10'), expectedError);
    t.end();
  });

  t.test('Should throw an error if the progress param is not a number between 0 and 100', (t) => {
    const expectedError = { message: 'The "progress" argument must be a number between 0 and 100.' };
    t.throws(() => setProgress(context, render, -1), expectedError);
    t.throws(() => setProgress(context, render, 101), expectedError);
    t.end();
  });

  t.test('Should initialize the progress property', (t) => {
    setProgress(context, render, 42);
    t.same(context.progress, 42);
    t.end();
  });

  t.test('Should re-render', (t) => {
    t.notOk(render.called);
    setProgress(context, render, 42);
    t.ok(render.called);
    t.end();
  });

  t.end();
});

test('function: loadingInit', (t) => {
  t.test('Should initialize the row property', (t) => {
    const context = {};
    const row = {};
    loadingInit(context, { row });
    t.equal(context.row, row);
    t.end();
  });

  t.test('Should initialize the stream property', (t) => {
    const context = {};
    loadingInit(context, { });
    t.equal(context.stream, process.stderr);
    loadingInit(context, { stream: 'STDOUT' });
    t.equal(context.stream, process.stdout);
    loadingInit(context, { stream: 'STDERR' });
    t.equal(context.stream, process.stderr);
    t.end();
  });

  t.end();
});

test('function: barLoadingInit', (t) => {
  t.test('Should initialize the row property', (t) => {
    common.__set__('CONSOLE_WIDTH', 42);
    const context = {};
    barLoadingInit(context, {});
    t.same(context.width, 42);
    barLoadingInit(context, { width: 25 });
    t.same(context.width, 25);
    t.end();
  });

  t.end();
});

test('function: determinateLoadingInit', (t) => {
  t.test('Should initialize the progress property as 0', (t) => {
    const context = {};
    determinateLoadingInit(context);
    t.same(context.progress, 0);
    t.end();
  });

  t.end();
});
