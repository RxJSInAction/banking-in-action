/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

/**
 * Balances
 */
const SET_BALANCES = 'SET_BALANCES';

const setBalances = (balances) =>
  ({type: SET_BALANCES, balances});

const balanceActions = {
  withdraw: () => ({type: 'TRANSACTION_START', value: 'WITHDRAW'}),
  deposit: () => ({type: 'TRANSACTION_START', value: 'DEPOSIT'}),
  amount: (value) => ({type: 'AMOUNT_CHANGED', value, field: 'amount'}),
  account: (value) => ({type: 'ACCOUNT_CHANGED', value, field: 'account'})
};

/**
 * MESSAGES
 */
const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';
const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
const REMOVE_MESSAGE = 'REMOVE_MESSAGE';


const displayMessage = (text, severity = 'info', duration = 5000) =>
  ({type: DISPLAY_MESSAGE, message: {text, severity, duration}});

const updateMessage = (id, text, severity, opacity) =>
  ({type: UPDATE_MESSAGE, message : {id, text, severity, opacity}});

const deleteMessage = (id) =>
  ({type: REMOVE_MESSAGE, id});


/**
 * Search
 *
 */
const CLEAR_SEARCH = 'CLEAR_SEARCH';
const SET_SEARCH_RESULTS = 'SET_SEARCH_RESULTS';
const INVOKE_SEARCH = 'INVOKE_SEARCH';

const updateSearchResults = (results) =>
  ({type: SET_SEARCH_RESULTS, results});

const startSearch = (query) =>
  ({type: INVOKE_SEARCH, query});

/**
 * Transactions
 */
const NEW_TRANSACTION = 'NEW_TRANSACTION';
const ADD_TRANSACTION = 'ADD_TRANSACTION';

// Build a message for adding a new transaction.
const addTransaction = (transaction) =>
  ({type: ADD_TRANSACTION, transaction});

const newTransaction = (type, account, amount, factor) =>
  ({account, amount: factor * amount, type});
