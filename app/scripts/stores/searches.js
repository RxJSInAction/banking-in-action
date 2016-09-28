/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const CLEAR_SEARCH = 'CLEAR_SEARCH';
const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
const INVOKE_SEARCH = 'INVOKE_SEARCH';

function startSearch(query) {
  return {
    type: INVOKE_SEARCH,
    query
  };
}

function clearSearch() {
  return {
    type: CLEAR_SEARCH
  }
}

function updateSearchResults(results) {
  return {
    type: SET_SEARCH_RESULTS,
    results
  };
}

function initiateSearch(query) {
  return {
    type: INVOKE_SEARCH,
    query
  };
}

function searches(state = {query: '', results: []}, action) {
  switch (action.type) {
    case INVOKE_SEARCH:
      const queryLens = R.lensProp('query');
      return R.set(queryLens, action.query, state);
    case CLEAR_SEARCH:
      return R.set(R.lensProp('results'), [], state);
    case SET_SEARCH_RESULTS:
      return R.set(R.lensProp('results'), action.results, state);
    default:
      return state;
  }
}