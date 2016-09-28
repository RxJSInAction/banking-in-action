/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const SET_BALANCE = 'SET_BALANCE';

function processPayment(transaction) {
  return R.merge({type: SET_BALANCE}, transaction);
}

function accounts(state = {checking: 100, savings: 100}, action) {
  const accountLens = R.lensProp(action.account);

  switch (action.type) {
    case SET_BALANCE:
      return R.set(accountLens, action.balance, state);
    default:
      return state;
  }
}

function __payment(account, amount) {
  return source => source
    .take(1)
    .map(({accounts}) => {
      const accountLens = R.lensProp(account);
      const newBalance = R.add(amount, R.view(accountLens, accounts));

      return {
        account,
        amount,
        balance: newBalance
      };
    })
}

function deposit(store, account, amount) {
  return store.let(__payment(account, amount))
    .do(transaction => {
      dispatch(processPayment(transaction), addTransaction(transaction));
      console.log(`Deposited ${amount} into ${account}`);
    }, err => {
      dispatch(displayMessage('Could not process request!', 'danger'));
    }, () => {
      dispatch(displayMessage('Deposit successful!'));
    });
}

function withdraw(store, account, amount) {
  return store.let(__payment(account, -amount))
    .flatMap(transaction => {
      const { balance } = transaction;
      if (balance < 0)
        return Rx.Observable.throw(new Error('Insufficient funds!'));
      return Rx.Observable.of(transaction);
    })
    .do(transaction => {
      dispatch(processPayment(transaction));
      dispatch(addTransaction(transaction));
      console.log(`Withdrew ${amount} from ${account}`);
    }, err => {
      dispatch(displayMessage('Insufficient funds!', 'danger'));
    }, () => {
      dispatch(displayMessage('Withdraw successful'));
    });
}





