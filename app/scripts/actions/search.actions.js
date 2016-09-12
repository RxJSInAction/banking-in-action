/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const SearchTypes = {
  NEW_QUERY: 'NEW_QUERY'
};

class SearchActions {
  constructor(dispatcher) {
    this._dispatcher = dispatcher;
  }

  search(query, options) {
    this._dispatcher.dispatch({
      type: SearchTypes.NEW_QUERY,
      query,
      options
    });
  }
}

const SearchActor = new SearchActions(AppDispatcher);