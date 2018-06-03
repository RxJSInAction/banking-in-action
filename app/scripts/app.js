/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
(function() {

  const {Observable} = Rx;
  const {createStore} = Redux;
  const {createMiddleware, createStreamFromStore} = DispatcherUtils;

  // Initial application state
  const initialState = {
    accounts: {checking: 100, savings: 100},
    transactions: [],
    messages: [],
    query: '',
    results: [],
    skip: 0,
    limit: 10
  };

  const middlewareFactories = [
    initializeEpic(accountsDB),
    searchEpic,
    messageEpic,
    userEpic,
    interestEpic,
    transactionEpic,
    transactionLogEpic,
    loggingEpic()
  ];

  // Builds the global store with reducers and an initial state
  const store = createStore(reducer, initialState);

  // Creates a set of middleware components
  const middleware = createMiddleware(store, middlewareFactories);

  const state$ = createStreamFromStore(store);


  Observable.fromEvent(window, 'load')
    .subscribe(
      () => {
        const rootNode = document.getElementById('root');

        const BankingInAction = React.createClass({
          render() {
            const {Grid} = ReactBootstrap;
            return React.createElement(
              Grid, null,
              React.createElement(MessageComponent, Object.assign({}, this.props)),
              React.createElement(NavigationComponent, {headers: headers}),
              React.createElement(AccountBalanceComponent, Object.assign({}, this.props)),
              React.createElement(AccountWithdrawComponent, Object.assign({}, this.props)),
              React.createElement(PortfolioComponent, Object.assign({}, this.props)),
              React.createElement(TransactionsComponent, Object.assign({}, this.props))
            );
          }
        });

        //Render the Application
        ReactDOM.render(
          React.createElement(BankingInAction, {appState$: state$, dispatch: middleware.dispatch}),
          rootNode);
      },
      err => console.error(err)
    );
})();