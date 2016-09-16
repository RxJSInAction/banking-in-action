/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

class PortfolioStore extends Rx.Observable {
  constructor(dispatcher) {
    super();
    const unitLens = R.lensProp('unit');

    this._source = dispatcher
      .flatMap(action => {
        switch(action.type) {
          case PortfolioTypes.BUY:
            return DB.portfolio.upsert(action.code, doc =>
              R.over(unitLens, R.compose(R.defaultTo(0), R.add(action.units)), doc)
            );
            break;
          case PortfolioTypes.SELL:
            return DB.portfolio.upsert(action.code, doc =>
              R.over(unitLens, R.compose(R.defaultTo(0), R.subtract(R.__, action.units)), doc)
            );
            break;
          case PortfolioTypes.REMOVE:
            return DB.portfolio.remove(action.code, action.rev);
            break;
          default:
            return Rx.Observable.empty();
        }
      })
      .share();
  }

  _subscribe(observer) {
    return this._source.subscribe(observer);
  }
}

const Portfolio = new PortfolioStore(AppDispatcher);
Portfolio.subscribe();


Rx.Observable.fromDBChanges = function dbChanges(db, opts, selector) {
  let changes = db.changes(opts);
  return Rx.Observable.fromEvent(changes, 'change', selector);
};

const PortfolioUpdates =
  Rx.Observable.fromDBChanges(DB.portfolio, {since: 'now', live: true})
    .startWith(null)
    .flatMapTo(
      Rx.Observable.defer(() => DB.portfolio.allDocs({include_docs: true})),
      (_, x) => R.view(R.lensProp('rows'), x)
    )
    .map(toModel)
    .publishReplay(1)
    .refCount();

function toModel(rows) {
  return rows.map(({doc: {_id, _rev, unit}}) => ({code: _id, rev: _rev, unit}))
}