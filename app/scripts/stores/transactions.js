/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const ADD_TRANSACTION = 'ADD_TRANSACTION';

function addTransaction(transaction) {
  return {type: ADD_TRANSACTION, transaction};
}

function transactions(state = [], action) {
  switch (action.type) {
    case ADD_TRANSACTION:
      return R.append(action.transaction, state);
    default:
      return state;
  }
}

