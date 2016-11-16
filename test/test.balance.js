/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const expect = chai.expect;

// function assertDeepEqual(actual, expected) { //#A
//   expect(actual).to.deep.equal(expected);
// }

function stringify(x) {
  return JSON.stringify(x, function (key, value) {
    if (Array.isArray(value)) {
      return '[' + value
          .map(function (i) {
            return '\n\t' + stringify(i);
          }) + '\n]';
    }
    return value;
  })
    .replace(/\\"/g, '"')
    .replace(/\\t/g, '\t')
    .replace(/\\n/g, '\n');
}

function deleteErrorNotificationStack(marble) {
  const {notification} = marble;
  if (notification) {
    const {kind, exception} = notification;
    if (kind === 'E' && exception instanceof Error) {
      notification.exception = {name: exception.name, message: exception.message};
    }
  }
  return marble;
}

function observableMatcher(actual, expected) {
  if (Array.isArray(actual) && Array.isArray(expected)) {
    actual = actual.map(deleteErrorNotificationStack);
    expected = expected.map(deleteErrorNotificationStack);
    try {
      expect(actual).to.deep.equal(expected);
    } catch (passed) {

      let message = '\nExpected \n';
      actual.forEach((x) => message += `\t${stringify(x)}\n`);

      message += '\t\nto deep equal \n';
      expected.forEach((x) => message += `\t${stringify(x)}\n`);

      chai.assert.fail(actual, expected, message);
    }
  } else {
    expect(actual).to.deep.equal(expected);
  }
}

function frames(n = 1, unit = '-') { //#A
  return (n === 1) ? unit :
  unit + frames(n - 1, unit);
}


describe('Balances', () => {

  let scheduler;

  beforeEach(() => {
    scheduler = new Rx.TestScheduler(observableMatcher);
  });

  afterEach(() => {
    scheduler = null;
  });

  describe('#initializeAccounts', () => {
    it('should zero the balances on error', () => {

      const fakeDB = {
        accounts: {
          get: () => scheduler.createColdObservable('--#')
        }
      };

      const mappings = {
        // The beginning balance
        a: {checking: 10, savings: 20},
        // Signal the update
        b: refreshBalances(),
        // Expect the balance to be set
        c: setBalances({checking: 0, savings: 0})
      };

      const input$ = scheduler
        .createHotObservable('---b', mappings);
      const expected$ =      '--c--c';

      scheduler.expectObservable(
        initializeEpic(fakeDB)(input$)
      ).toBe(expected$, mappings);

      scheduler.flush();
    });
  });

  describe('#userEpic', () => {

    it('should emit a new transaction', () => {

      const actionMapping = {
        a: balanceActions.account('checking'),
        b: balanceActions.amount(10),
        c: balanceActions.withdraw()
      };

      const expectMapping = {
        d: newTransaction('checking', 10, -1)
      };

      const action$ = scheduler.createHotObservable('-a-b-c', actionMapping);
      const store$ = Rx.Observable.empty();

      scheduler.expectObservable(
        userEpic(action$, store$)
      ).toBe(
        '-----d',
        expectMapping
      );

      scheduler.flush();
    });

    it('should use the latest balance', () => {

    });
  });

  describe('#interestEpic', () => {
    it('should accumulate interest', () => {

      const expectMapping = {
        a: newTransaction('savings', (1), 1)
      };

      const storeMapping = {
        a: 365 * 10
      };

      const balance$ = scheduler.createColdObservable('---a', storeMapping);
      const trigger$ = scheduler.createHotObservable('---a');

      scheduler.expectObservable(
        computeInterest(trigger$, balance$)
      ).toBe(
        '------a',
        expectMapping
      );

      scheduler.flush();
    });
  })

});