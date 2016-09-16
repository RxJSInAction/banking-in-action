/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

const TransactionTypes = {
  WITHDRAW: 'withdraw',
  DEPOSIT: 'deposit',
  TRANSFER: 'transfer'
};

DB.accounts.putIfNotExists('checking', {balance: 40.0});
DB.accounts.putIfNotExists('savings', {balance: 40.0});

/**
 *
 * @param name
 * @param accountId
 * @param type
 * @param op
 * @returns {Observable<R>}
 */
function transact({name, accountId, type}, op) {
  return Rx.Observable.of(accountId)
    .flatMap(id => DB.accounts.get(id))
    .filter(doc => !!doc)
    .flatMap(({_id, _rev, balance}) =>
      Rx.Observable.if(
        () => op(balance) >= 0,
        Rx.Observable.defer(() => DB.accounts.put({_id, _rev, balance: op(balance)})),
        Rx.Observable.throw(new Error('Insufficient funds!'))
      )
    );
}

function withdraw({name, accountId, amount, type}) {
  return transact({name, accountId, type: 'withdraw'}, R.curryN(2, R.subtract)(R.__, amount));
}

function deposit({name, accountId, amount}) {
  return transact({name, accountId, type: 'deposit'}, R.curryN(2, R.add)(R.__, amount));
}

function transfer({sourceId, destinationId, amount}) {
  let from$ = Rx.Observable.of(sourceId).flatMap(id => DB.accounts.get(id));
  let to$   = Rx.Observable.of(destinationId).flatMap(id => DB.accounts.get(id));
  let amount$ = Rx.Observable.of(amount);
  return Rx.Observable.zip(to$, from$, amount$, (to, from, amount) => ({to, from, amount}))
    .filter(({to, from}) => !!to && !!from)
    .flatMap(({from, amount}) =>
        DB.accounts.put({_id: from._id, _rev: from._rev, balance: R.subtract(from.balance, amount)}),
      (tx) => tx
    )
    .flatMap(({to, amount}) =>
      DB.accounts.put({_id: to._id, _rev: to._rev, balance: R.add(to.balance, amount)})
    );
}

class Transaction {
  constructor(name, type, amount, timestamp) {
    this.name = name;
    this.type = type;
    this.amount = amount;
    this.timestamp = timestamp;
  }

  get _id() {
    return `${this.name}_${this.type}_${this.timestamp}`;
  }
}

/**
 * Receives and emits data surround user transactions
 */
class TransactionStore {
  constructor(dispatcher) {
    this._source = dispatcher
      .flatMap(action => {
        let tx;
        switch (action.type) {
          case TransactionTypes.WITHDRAW:
            tx = withdraw(action);
            break;
          case TransactionTypes.DEPOSIT:
            tx = deposit(action);
            break;
          case TransactionTypes.TRANSFER:
            tx = transfer(action);
            break;
          default:
            return Rx.Observable.empty();
        }

        return tx.timestamp().catch((err, original) => {
          console.error('Could not process transaction!', err);
          return Rx.Observable.empty();
        });
      }, (action, tx) => new Transaction(action.name, action.type, action.amount, tx.timestamp))
      .share();
  }
  get transactions() {
    return this._source;
  }
}

const Transactions = new TransactionStore(AppDispatcher);