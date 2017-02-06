/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

// Utilities to make it easier to access certain values
const accountsLens = R.lensProp('accounts');
const messagesLens = R.lensProp('messages');
const resultsLens = R.lensProp('results');
const transactionsLens = R.lensProp('transactions');
const queryLens = R.lensProp('query');

function reducer(state = {
  accounts: {checking: 0, savings: 0},
  messages: [],
  results: [],
  transactions: [],
  skip: 0,
  limit: 10,
  query: ''
}, action) {
  switch(action.type) {
    case 'LOG':
      console.log(`LOG: ${action.payload}`);
      return state;
    case SET_BALANCES:
      const newAccountState = R.merge(R.view(accountsLens, state), action.balances);
      return R.set(accountsLens, newAccountState, state);
    case DISPLAY_MESSAGE:
      const index = R.findIndex(R.propEq('id', action.message.id))(state);
      const newMessageState = index > -1 ?
        R.update(index, action.message, state) : [...state, action.message];
      return R.set(messagesLens, newMessageState, state);
    case REMOVE_MESSAGE:
      const isExpired = (msg) => msg.id !== action.id;
      const nonExpiredMessages = R.filter(isExpired, state);
      return R.set(messagesLens, nonExpiredMessages, state);
    case INVOKE_SEARCH:
      return R.set(queryLens, action.query, state);
    case CLEAR_SEARCH:
      return R.set(resultsLens, [], state);
    case SET_SEARCH_RESULTS:
      return R.set(resultsLens, action.results, state);
    case ADD_TRANSACTION:
      return R.over(transactionsLens, R.prepend(action.datedTx), state);
    default:
      return state;
  }
}