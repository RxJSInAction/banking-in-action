/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function userEpic(action$) {
  return action$.ofType('TRANSACTION_START')
    .map(({value}) => value)
    .withLatestFrom(
      action$.ofType('AMOUNT_CHANGED').map(({value}) => +value),
      action$.ofType('ACCOUNT_CHANGED').map(({value}) => value),
      (type, amount, account) => {
        const computedAmount = amount * (type === 'DEPOSIT' ? 1 : -1);
        return {type, account, amount: computedAmount};
      });
}