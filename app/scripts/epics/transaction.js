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

function transactionEpic(action$, store) {
  return action$.ofType('ADD_TRANSACTION')
    .pluck('datedTx')
    .map(transaction => {
      const {name, balance} = transaction;
      return transactionSuccess(store)({[name]: balance});
    });
}

const validate = (validator, onFail) => (tx) =>
  Rx.Observable.if(() => validator(tx), Rx.Observable.of(tx), onFail);

const overdraftValidator = (tx) => tx.balance >= 0 || tx.amount >= 0;

function transactionLogEpic(action$, store) {
  return action$.ofType('WITHDRAW', 'DEPOSIT')
    .timestamp()
    .map(obj => Object.assign({}, obj.value, {timestamp: obj.timestamp}))
    .map(action => {
      const {accounts} = store.getState();

      return Object.assign(
        {},
        action,
        {
          balance: accounts[action.account] + action.amount
        }
      )
    })
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
          return Rx.Observable.of({type: 'LOG', payload: `TX WRITE FAILURE: ${err.message}`})
        })
    );
}

const getAccounts = () => Rx.Observable.fromPromise(accountsDB.get('accounts'));

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

class Transaction {
  constructor(name, amount, balance, timestamp) {
    this.name = name;
    this.amount = amount;
    this.balance = balance;
    this.timestamp = timestamp;
  }
}