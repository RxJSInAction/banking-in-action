/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const transactionSuccess = (store) => (newBalances) => (
  setBalances(Object.assign({}, store.getState()['accounts'], newBalances))
);

const transactionFailed = (err) => Rx.Observable.of(displayMessage(err.message, 'danger'));

const getAccounts = () => Rx.Observable.fromPromise(accountsDB.get('accounts'));

/**
 * SEARCH
 */
function searchEpic(action$) {
  return action$
    .ofType(INVOKE_SEARCH)
    .debounceTime(500)
    .switchMap(
      ({query}) => search(query, {limit: 20})
    ).map(updateSearchResults);
}

function messageEpic(actions$) {
  return actions$
    .ofType(DISPLAY_MESSAGE)
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


function userEpic(action$) {

  const amountChanged$ = action$
    .ofType('AMOUNT_CHANGED')
    .pluck('value')
    .map(x => +x);

  const accountChanged$ = action$
    .ofType('ACCOUNT_CHANGED')
    .pluck('value');

  const type$ = action$
    .ofType('TRANSACTION_START')
    .do(x => console.log('Transaction started'))
    .pluck('value');

  return type$.withLatestFrom(
      amountChanged$,
      accountChanged$,
      (type, amount, account) => ({type, amount, account})
    ).do(x => console.log(x))
}

const computeInterest =  p => 0.1 / 365 * p;

// Processes interest payments
function interestEpic(action$, store) {
  return Rx.Observable.interval(15000)
    .map(() => store.getState())
    .pluck('accounts')
    .map(
      ({savings}) => ({
        type: 'DEPOSIT',
        account: 'savings',
        amount: computeInterest(savings)
      })
    );
}

function transactionEpic(action$, store) {
  return action$.ofType('ADD_TRANSACTION')
    .pluck('datedTx')
    .map(transaction => {
      const {name, balance} = transaction;
      return transactionSuccess(store)({[name]: balance});
    });
}

// function transactionEpic(action$, store) {
//   return action$.ofType('ADD_TRANSACTION')
//     .concatMap(transaction => // amount, account, timestamp, balance
//       getAccounts()
//         .flatMap(() =>
//           Rx.Observable.fromPromise(accountsDB.put(transaction))
//             .mapTo(transaction)
//         )
//         .mapTo(transactionSuccess(store)({[transaction.account]: transaction.balance}))
//         .catch(transactionFailed)
//     );
// }

class Transaction {
  constructor(name, amount, balance, timestamp) {
    this.name = name;
    this.amount = amount;
    this.balance = balance;
    this.timestamp = timestamp;
  }
}

const validate = (validator, onFail) => (tx) =>
  Rx.Observable.if(() => {
    return validator(tx)
  }, Rx.Observable.of(tx), onFail);

const overdraftValidator = (tx) => tx.balance >= 0 || tx.amount >= 0;

function transactionLogEpic(action$, store) {
  return action$.ofType('WITHDRAW', 'DEPOSIT')
    .timestamp()
    .map(obj => Object.assign({}, obj.value, {timestamp: obj.timestamp}))
    .map(action => Object.assign(
      {},
      action,
      {
        balance: store.getState().accounts[action.account] + action.amount
      }
    ))
    .map(({account, amount, balance, timestamp}) => new Transaction(
      account,
      amount,
      balance,
      timestamp
    ))
    .mergeMap(datedTx =>
      validate(overdraftValidator, Rx.Observable.throw('OVERDRAFT'))(datedTx)
        .mapTo({type: 'ADD_TRANSACTION', datedTx})
        .catch(err => {
          Rx.Observable.of({type: 'LOG', payload: `TX WRITE FAILURE: ${err.message}`})
        })
    );
}

const loggingEpic = (action$) => action$
  .do(
    action => {
      console.log(`Dispatch [${action.type}]`, action)
    },
    err => console.error(err)
  )
  .ignoreElements();