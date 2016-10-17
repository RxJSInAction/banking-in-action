/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const {combineReducers} = Redux;

// Create a single reducer out of the sub-reducers
const rootReducer = combineReducers({
  accounts,
  transactions,
  searches,
  messages
});


function accounts(state = {checking: 100, savings: 100}, action) {
  switch (action.type) {
    case SET_BALANCE:
      return R.merge(state, action.balances);
    default:
      return state;
  }
}

function messages(state = [], action) {
  switch (action.type) {
    // case DISPLAY_MESSAGE:
    //   return [...state, action.message];
    case UPDATE_MESSAGE:
      const index = R.findIndex(R.propEq('id', action.message.id))(state);
      return index > -1 ?
        R.update(index, action.message, state) :
        [...state, action.message];
    case REMOVE_MESSAGE:
      const isExpired = (msg) => msg.id !== action.id;
      return R.filter(isExpired, state);
    default:
      return state;
  }
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

const transactionLens = R.lensProp('transactions');

function transactions(state = {}, action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return R.over(transactionLens, R.prepend(action.transaction), state);
    case CHANGE_VIEW:
      return R.merge(state, R.pick(['skip', 'limit'], action));
    default:
      return state;
  }
}