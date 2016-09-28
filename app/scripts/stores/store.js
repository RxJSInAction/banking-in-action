/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const reducers = combiner({
  accounts,
  transactions,
  portfolio,
  searches,
  messages
});

const app = store(reducers, {
  accounts: {checking: 100, savings: 100},
  portfolio: {},
  transactions: [],
  messages: [],
  searches: {query: '', results: []}
});

const dispatch = (...actions) => {
  for (let action of actions) {
    app.dispatch(action);
  }
};

// Interest payments
Rx.Observable.interval(15000)
  .withLatestFrom(app.map(({accounts}) => accounts),
    (_, {savings}) => {
      return (0.1 / 365 * savings);
    })
  .flatMap(interest => {
    return deposit(app, 'savings', interest);
  })
  .subscribe();