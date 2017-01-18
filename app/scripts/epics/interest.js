/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const computeInterest =  p => 0.1 / 365 * p;

// Processes interest payments
function interestEpic(action$, store) {
  return Rx.Observable.interval(15000)
    .map(() => store.getState())
    .pluck('accounts')
    .map(
      ({savings}) => ({
        type: 'DEPOSIT',
        account: 'savings',
        amount: computeInterest(savings)
      })
    );
}