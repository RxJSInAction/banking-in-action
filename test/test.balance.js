/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const expect = chai.expect;

function assertDeepEqual(actual, expected) { //#A
  expect(actual).to.deep.equal(expected);
}

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
          get: () => scheduler.createColdObservable('--#'),
          put: () => scheduler.createColdObservable('-x')
      };

      const mappings = {
        // Expect the balance to be set
        a: setBalances({checking: 100, savings: 100})
      };

      const expected$ =      '---a';

      scheduler.expectObservable(
        initializeEpic(fakeDB)(Rx.Observable.empty())
      ).toBe(expected$, mappings);

      scheduler.flush();
    });
  });

  describe('#userEpic', () => {

    it('should emit a new withdraw transaction', () => {

      const actionMapping = {
        a: balanceActions.account('checking'),
        b: balanceActions.amount(10),
        c: balanceActions.withdraw()
      };

      const expectMapping = {
        d: newTransaction('WITHDRAW', 'checking', 10, -1)
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

    it('should emit a new deposit transaction', () => {
      const actionMapping = {
        a: balanceActions.account('savings'),
        b: balanceActions.amount(10),
        c: balanceActions.deposit()
      };

      const expectMapping = {
        d: newTransaction('DEPOSIT', 'savings', 10, 1)
      };

      const action$ = scheduler.createHotObservable('-a-b-c', actionMapping);

      scheduler.expectObservable(
        userEpic(action$)
      ).toBe(
        '-----d',
        expectMapping
      );

      scheduler.flush();
    });
  });

  describe('#interestEpic', () => {
    it('should accumulate interest', () => {

      const expectMapping = {
        // Rounding error
        a: newTransaction('DEPOSIT', 'savings', 1.0000000000000002, 1)
      };

      const stubStore = {
        getState() {
          return {
            accounts: {
              savings: 365 * 10
            }
          };
        }
      };

      scheduler.expectObservable(
        interestEpic(Rx.Observable.empty(), stubStore, scheduler)
      ).toBe(
        frames(15 * 100) + 'a',
        expectMapping
      );
    });
  });

  describe('#loggingEpic', () => {
    it('should log dispatch actions', () => {

      const actionsMap = {
        a: balanceActions.withdraw(),
        b: balanceActions.account('savings'),
        c: balanceActions.amount(10)
      };

      const messages = [];

      const fakeConsole = {
        log: (...args) => messages.push(args)
      };

      const action$ = scheduler.createHotObservable('-a-b-c', actionsMap);

      scheduler.expectObservable(
        loggingEpic(fakeConsole)(action$)
      ).toBe('');

      scheduler.flush();

      assertDeepEqual(messages, [
        ['Dispatch [TRANSACTION_START]', actionsMap.a],
        ['Dispatch [ACCOUNT_CHANGED]', actionsMap.b],
        ['Dispatch [AMOUNT_CHANGED]', actionsMap.c]
      ]);

    })
  })

});