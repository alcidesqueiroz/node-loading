const tap = require('tap');
const test = tap.test;
const rewire = require('rewire');
const sinon = require('sinon');
const common = rewire('./common');
const {
  loadingSharedOperations,
  barSharedOperations,
  finiteLoadingSharedOperations,
  loadingInit,
  barLoadingInit,
  finiteLoadingInit
} = common;

test('loadingSharedOperations ', (t) => {
  t.test('method: start', (t) => {
    let signalExitSpy;
    let context;

    tap.beforeEach((end) => {
      signalExitSpy = sinon.spy();
      context = {
        hideCursor: sinon.spy(),
        render: sinon.spy(),
        showCursor: sinon.spy()
      };
      common.__set__('signalExit', signalExitSpy);
      end();
    });

    t.test('Should initialize the row property correctly', (t) => {
      context.row = 10;
      loadingSharedOperations.start.call(context);
      t.same(context.row, 10);

      delete context.row;
      common.__set__('getCursorPosition', { sync: () => ({ row: 5 }) });
      loadingSharedOperations.start.call(context);
      t.same(context.row, 4);
      t.end();
    });

    t.test('Should restore the cursor when the process exits', (t) => {
      loadingSharedOperations.start.call(context);
      t.ok(signalExitSpy.called);
      t.notOk(context.showCursor.called);
      signalExitSpy.args[0][0]();
      t.ok(context.showCursor.called);
      t.end();
    });

    t.test('Should hide the cursor', (t) => {
      loadingSharedOperations.start.call(context);
      t.ok(context.hideCursor.called);
      t.end();
    });

    t.test('Should render the loading animation', (t) => {
      loadingSharedOperations.start.call(context);
      t.ok(context.render.called);
      t.end();
    });

    t.end();
  });

  t.test('method: stop', (t) => {
    let context;

    tap.beforeEach((end) => {
      context = { showCursor: sinon.spy() };
      common.__set__('signalExit', sinon.fake());
      end();
    });

    t.test('Should bring back the cursor', (t) => {
      loadingSharedOperations.stop.call(context);
      t.ok(context.showCursor.called);
      t.end();
    });

    t.end();
  });

  t.test('method: clearLine', (t) => {
    tap.beforeEach((end) => {
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
      loadingSharedOperations.clearLine.call(context);
      const cursorToSpy = context.stream.cursorTo;
      t.ok(cursorToSpy.called);
      t.same(cursorToSpy.args[0][1], context.row);

      const row = {};
      loadingSharedOperations.clearLine.call(context, row);
      t.same(cursorToSpy.args[0][1], row);
      t.end();
    });

    t.test('Should clear the line', (t) => {
      loadingSharedOperations.clearLine.call(context);
      t.ok(context.stream.clearLine.called);
      t.end();
    });

    t.end();
  });

  t.test('method: showCursor', (t) => {
    tap.beforeEach((end) => {
      context = {
        stream: {
          write: sinon.spy()
        }
      };
      end();
    });

    t.test('Should do nothing if the cursor is already visible', (t) => {
      common.__set__('isCursorVisible', true);
      loadingSharedOperations.showCursor.call(context);
      t.notOk(context.stream.write.called);
      t.end();
    });

    t.test('Should show the cursor if it is not visible', (t) => {
      common.__set__('isCursorVisible', false);
      loadingSharedOperations.showCursor.call(context);
      t.ok(common.__get__('isCursorVisible'));
      t.ok(context.stream.write.called);
      t.end();
    });

    t.test('Should always try to show the cursor if the force option is true', (t) => {
      common.__set__('isCursorVisible', true);
      loadingSharedOperations.showCursor.call(context, true);
      t.ok(context.stream.write.called);
      t.end();
    });

    t.end();
  });

  t.test('method: hideCursor', (t) => {
    tap.beforeEach((end) => {
      context = {
        stream: {
          write: sinon.spy()
        }
      };
      end();
    });

    t.test('Should do nothing if the cursor is already hidden', (t) => {
      common.__set__('isCursorVisible', false);
      loadingSharedOperations.hideCursor.call(context);
      t.notOk(context.stream.write.called);
      t.end();
    });

    t.test('Should hide the cursor if it is visible', (t) => {
      common.__set__('isCursorVisible', true);
      loadingSharedOperations.hideCursor.call(context);
      t.notOk(common.__get__('isCursorVisible'));
      t.ok(context.stream.write.called);
      t.end();
    });

    t.end();
  });

  t.end();
});

test('barSharedOperations', (t) => {
  t.test('method: updateMessage', (t) => {
    tap.beforeEach((end) => {
      context = {
        clearLine: sinon.spy(),
        stream: {
          write: sinon.spy()
        }
      };
      end();
    });

    t.test('Should do nothing if the message is not a string or did not change', (t) => {
      context.message = 42;
      barSharedOperations.updateMessage.call(context);
      t.notOk(context.clearLine.called);
      context.message = 'we were on a break!';
      context.lastMessage = 'we were on a break!';
      barSharedOperations.updateMessage.call(context);
      t.notOk(context.clearLine.called);
      t.end();
    });

    t.test('Should update the lastMessage property', (t) => {
      context.message = 'hello';
      context.lastMessage = 'yoy';
      barSharedOperations.updateMessage.call(context);
      t.same(context.message, context.lastMessage);
      t.end();
    });

    t.test('Should clear the line', (t) => {
      context.message = 'hello';
      barSharedOperations.updateMessage.call(context);
      t.ok(context.clearLine.called);
      t.end();
    });

    t.test('Should write the message itself', (t) => {
      context.message = 'You can\'t handle the truth!';
      context.messageColor = 'black';
      barSharedOperations.updateMessage.call(context);
      t.same(context.stream.write.args[0][0], '> You can\'t handle the truth!');
      t.end();
    });

    t.end();
  });

  t.end();
});

test('finiteLoadingSharedOperations', (t) => {
  t.test('method: setProgress', (t) => {
    tap.beforeEach((end) => {
      context = {
        render: sinon.spy(),
      };
      end();
    });

    t.test('Should throw an error if the progress param is not a number', (t) => {
      const expectedError = { message: 'The "progress" argument must be a number.' };
      t.throws(() => finiteLoadingSharedOperations.setProgress('10'), expectedError);
      t.end();
    });

    t.test('Should throw an error if the progress param is not a number between 0 and 100', (t) => {
      const expectedError = { message: 'The "progress" argument must be a number between 0 and 100.' };
      t.throws(() => finiteLoadingSharedOperations.setProgress(-1), expectedError);
      t.throws(() => finiteLoadingSharedOperations.setProgress(101), expectedError);
      t.end();
    });

    t.test('Should initialize the progress property', (t) => {
      finiteLoadingSharedOperations.setProgress.call(context, 42);
      t.same(context.progress, 42);
      t.end();
    });

    t.test('Should re-render', (t) => {
      t.notOk(context.render.called);
      finiteLoadingSharedOperations.setProgress.call(context, 42);
      t.ok(context.render.called);
      t.end();
    });

    t.end();
  });

  t.end();
});

test('function: loadingInit', (t) => {
  t.test('Should initialize the row property', (t) => {
    const context = {};
    const row = {};
    loadingInit(context, { row });
    t.same(context.row, row);
    t.end();
  });

  t.test('Should initialize the stream property', (t) => {
    const context = {};
    loadingInit(context, { });
    t.same(context.stream, process.stderr);
    loadingInit(context, { stream: 'STDOUT' });
    t.same(context.stream, process.stdout);
    loadingInit(context, { stream: 'STDERR' });
    t.same(context.stream, process.stderr);
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

test('function finiteLoadingInit', (t) => {
  t.test('Should initialize the progress property as 0', (t) => {
    const context = {};
    finiteLoadingInit(context);
    t.same(context.progress, 0);
    t.end();
  });

  t.end();
});
