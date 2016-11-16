/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
(function () {
// Start configuration step here
// 1) Check logged in status
// 2) Force log-in
// 3) Use log-in token to get dashboard set-up information

  /* Action Items:
   *
   * 1) Data (stocks, accounts, transactions, routing?)
   * 2) Tool to build transaction history
   * 3) Tool to build stock history

   * */

  const {Observable} = Rx;
  const {createStore} = Redux;
  const {createMiddleware} = DispatcherUtils;

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
    initialize$,
    search$,
    message$,
    userTransaction$,
    interest$,
    transaction$
  ];

  // Builds the global store with reducers and an initial state
  const store = createStore(reducer, initialState);

  // Creates a set of middleware components
  const app = createMiddleware(store, middlewareFactories);


  Observable.fromEvent(window, 'load')
    .subscribe(
      () => {
        const rootNode = document.getElementById('root');

        const BankingInAction = React.createClass({
          render() {
            const {Grid} = ReactBootstrap;
            const {state, app} = this.props;
            return React.createElement(
              Grid, null,
              React.createElement(MessageComponent, {state}),
              React.createElement(NavigationComponent, {headers: headers}),
              React.createElement(AccountBalanceComponent, {state}),
              React.createElement(AccountWithdrawComponent, {state, app}),
              React.createElement(PortfolioComponent, {state, app}),
              React.createElement(TransactionsComponent, {state})
            );
          }
        });

        //Render the Application
        ReactDOM.render(
          React.createElement(BankingInAction, {state: app.output$, app: app}),
          rootNode);
      },
      err => console.error(err)
    );
})();