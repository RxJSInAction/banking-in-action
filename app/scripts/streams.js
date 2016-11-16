/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const {ofType} = DispatcherUtils;

// Compute the result of a transaction
const computeTransaction = (transaction) => (balances) => {
  const {amount, account, factor} = transaction;

  const target = balances[account];

  const newBalance = target + amount * factor;

  return Rx.Observable.if(
    () => factor < 0 && newBalance < 0,
    Rx.Observable.throw(new Error('Insufficient Balance')),
    Rx.Observable.of(Object.assign({}, balances, {[account]: newBalance}))
  );
};

const transactionSuccess = (transaction) => (newBalances) => ([
  setBalances(Object.assign({}, newBalances)),
  addTransaction(Object.assign({}, transaction, {balance: newBalances[transaction.account]}))
]);

const transactionFailed = (err) => Rx.Observable.of(displayMessage(err.message, 'danger'));

const getAccounts = () => Rx.Observable.fromPromise(accountsDB.get('accounts'));

const updateBalances = (transaction) =>
  Rx.Observable.fromPromise(accountsDB.put(transaction)).map(() => transaction);

/**
 * SEARCH
 */
function searchEpic(action$) {
  return action$
    .filter(ofType(INVOKE_SEARCH))
    .debounceTime(500)
    .switchMap(
      ({query}) => search(query, {limit: 20})
    ).map(updateSearchResults);
}

function messageEpic(actions$) {
  return actions$
    .filter(ofType(DISPLAY_MESSAGE))
    .flatMap(
      ({message}, id) => {
        const {duration, text, severity} = message;
        const steps = duration / 100;
        return Rx.Observable.timer(0, 100)
          .takeWhile(x => x < steps)
          .map(i => (steps - i) / steps)
          .map(opacity => updateMessage(id, text, severity, opacity))
          .concat(Rx.Observable.of(deleteMessage(id)));
      }
    );
}

function initializeEpic() {
  return getAccounts()
    .catch(err => {
      const defaults = {checking: 100, savings: 100};
      return accountsDB.put('accounts', defaults)
        .then(() => defaults);
    })
    .map(accounts => {
      const {checking, savings} = accounts;
      return setBalances({checking, savings});
    });
}

const byField = (expected) => ({field}) => expected === field;

function userEpic(action$) {

  const field$ = action$.filter(ofType('SET_TRANSACTION_FIELD'));

  const amount$ = field$.filter(byField('amount')).pluck('value').map(x => +x);
  const account$ = field$.filter(byField('account')).pluck('value');

  return action$
    .filter(ofType('PROCESS_TRANSACTION'))
    .pluck('value')
    .withLatestFrom(
      amount$,
      account$,
      (factor, amount, account) => newTransaction(account, amount, factor)
    );
}

function computeInterest(principle) {
  const rounded = +((0.1 / 365 * principle).toFixed(2));
  return newTransaction('savings', rounded, 1);
}

// Processes interest payments
function interestEpic(action$, store$, scheduler) {
  return Rx.Observable.interval(15000)
    .switchMap(
      () => getAccounts().pluck('savings')
    ).map(computeInterest);
}



//TODO Get this working with transaction log again
function transactionEpic(action$) {
  return action$.filter(ofType(NEW_TRANSACTION))
    .concatMap(transaction => // amount, account, factor
      getAccounts()
        // Compute balance
        .flatMap(computeTransaction(transaction))
        .flatMap(updateBalances)
        .flatMap(transactionSuccess(transaction))
        .catch(transactionFailed)
    );
}
