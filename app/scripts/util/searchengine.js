/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
class SearchQuery extends Rx.Observable {
  constructor(subject, {query, options}) {
    super();
    this._subject = subject;
    this.query = query;
    this.options = options;
  }
  _subscribe(observer) {
    const { query, options, _subject } = this;

    // Degenerate case, if there is no data then simply return immediately
    if (query.length == 0)
      return Rx.Observable.of([]).subscribe(observer);

    //The options for the search
    //Generate a new unique id for the search
    const id = SearchQuery.id++;

    //Listen for the response from the search
    const sub = _subject
    // Extract only the response to this query
      .first(m => m.data.id === id)

      // Extract only a subset of data
      .pluck('data', 'matches')
      .subscribe(observer);

    //Send the search query
    _subject.next({query, id, options});
    return sub;
  }
}

SearchQuery.id = 0;

// Creates a new search system that can be tapped into for quickly and
// asynchronously searching
class SearchEngine {
  constructor() {
    //Designate a worker for this search engine
    this._worker = new Worker('/app/scripts/workers/search.js');

    //Listen for responses from the worker
    let source = Rx.Observable.fromEvent(this._worker, 'message');

    //Allow messages to be posted from the internal SearchQuery
    let sink = Rx.Subscriber.create(m => this._worker.postMessage(m));

    // Combine the two into a single Subject so that it appears as though values
    // coming in directly map to those going out
    this._subject = Rx.Subject.create(sink, source);
  }

  search(params) {
    return new SearchQuery(this._subject, params);
  }
}

const engine = new SearchEngine();

function search(query, options) {
  return engine.search({query, options});
}