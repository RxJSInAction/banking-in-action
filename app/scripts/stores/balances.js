/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

class BalanceStore extends Rx.Observable {
  constructor(db) {
    super();
    this._db = db;
    let changes = this._db.changes({
      since: 'now',
      live: true,
      include_docs: true
    });

    const asBalance = (account) => (source) =>
      source.filter(doc => doc.id === account)
        .pluck('doc');

    let balanceChanges = Rx.Observable.fromEvent(changes, 'change');

    let checkingsBalanceChanged = balanceChanges.let(asBalance('checking'));
    let savingsBalanceChanged = balanceChanges.let(asBalance('savings'));

    this._balances = Rx.Observable.combineLatest(
      Rx.Observable.concat(db.get('checking'), checkingsBalanceChanged),
      Rx.Observable.concat(db.get('savings'), savingsBalanceChanged),
      (checking, savings) => ({checking: checking.balance, savings: savings.balance})
    )
      .publishReplay(1)
      .refCount();
  }

  _subscribe(observer) {
    return this._balances.subscribe(observer);
  }

  get balances() {
    return this._balances;
  }
}

const Balances = new BalanceStore(accountsDb);