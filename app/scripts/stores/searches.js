/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
class SearchEngine {
  constructor() {
    //Designate a worker for this search engine
    this._worker = new Worker('/app/scripts/workers/search.js');

    //Listen for responses from the worker
    this._messages = Rx.Observable.fromEvent(this._work, 'message');
  }

  newQuery(params) {
    //The options for the search
    let {query, options} = params;

    //Generate a new unique id for the search
    const id = Date.now();

    //Listen for the response from the search
    let response = this._messages
      .first(m => m.data.id === id)
      .pluck('data', 'matches')
      .publishReplay(1).refCount();

    //Send the search query
    this._worker.postMessage({query, id, options});
    return response;
  }
}


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