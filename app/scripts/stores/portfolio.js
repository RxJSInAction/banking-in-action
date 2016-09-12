/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

const portfolioDB = new PouchDB('portfolio');

class PortfolioStore extends Rx.Observable {
  constructor(dispatcher) {
    super();
    this._source = dispatcher
      .flatMap(action => {
        switch(action.type) {
          case PortfolioTypes.BUY:
            // return portfolioDB.putIfNotExists(action.code, {})
            break;
          case PortfolioTypes.SELL:
            break;
          case PortfolioTypes.ADD:
            return portfolioDB.putIfNotExists(action.code, {shares: 0});
            break;
          case PortfolioTypes.REMOVE:
            return portfolioDB.delete(action.code);
            break;
          default:
            return Rx.Observable.empty();
        }
      })
      .flatMap(
        success => portfolioDB.allDocs({include_docs: true}),
        (success, {rows}) => rows.map(({doc}) => ({shares: doc.shares, code: doc._id}))
      )
      .share();
  }

  _subscribe(observer) {
    return this._source.subscribe(observer);
  }
}

const Portfolio = new PortfolioStore(AppDispatcher);