/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const SET_BALANCE = 'SET_BALANCE';
const PROCESS_TRANSACTION = 'PROCESS_TRANSACTION';
const UPDATE_AMOUNT = 'UPDATE_AMOUNT';
const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT';

function setBalance(transaction) {
  return R.merge({type: SET_BALANCE}, transaction);
}

const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';
const DEGRADE_MESSAGES = 'DEGRADE_MESSAGES';

function displayMessage(text, severity = 'info', duration = 1.0) {
  return {type: DISPLAY_MESSAGE, message: {text, severity, duration}};
}

function degradeMessages(factor = 0.05) {
  return {type: DEGRADE_MESSAGES, factor};
}

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

const NEW_TRANSACTION = 'NEW_TRANSACTION';
const ADD_TRANSACTION = 'ADD_TRANSACTION';
const CHANGE_VIEW = 'CHANGE_VIEW';

// Build a message for adding a new transaction.
function addTransaction(transaction) {
  return {type: ADD_TRANSACTION, transaction};
}

function changeView({limit, skip}) {
  return {type: CHANGE_VIEW, limit, skip};
}
