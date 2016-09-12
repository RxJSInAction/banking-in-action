/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

class SearchStore extends Rx.Observable {
  constructor(dispatcher) {
    super();
    this._worker = new Worker('/app/scripts/workers/search.js');
    this._messages = Rx.Observable.fromEvent(this._worker, 'message');
    this._source = dispatcher
      .filter(({type}) => SearchTypes.NEW_QUERY === type)
      .debounceTime(500)
      .flatMap(({query, options}) => {
        const id = Date.now();
        if (query.length === 0) {
          return Rx.Observable.of([]);
        }
        this._worker.postMessage({query, id, options});
        return this._messages
          .first(m => m.data.id === id)
          .pluck('data', 'matches');
      });
  }

  _subscribe(observer) {
    return this._source.subscribe(observer);
  }
}

const Searches = new SearchStore(AppDispatcher);