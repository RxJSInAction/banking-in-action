/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const computeInterest =  p => 1 / 10 / 365 * p;

// Processes interest payments
function interestEpic(action$, store, scheduler) {
    return Rx.Observable.interval(15 * 1000, scheduler)
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