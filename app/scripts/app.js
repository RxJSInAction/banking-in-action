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
    transactions: {transactions: [], limit: 10, skip: 0},
    messages: [],
    searches: {query: '', results: []}
  };

  const initialStreams$ = [
    handleSearch,
    updateMessages,
    processUserTransaction,
    processInterest,
    handleTransaction
    // initializeBalances
    // updateDBBalances
  ];

  // Builds the global store with reducers and an initial state
  const rootStore = createStore(rootReducer, initialState);

  // Creates a set of middleware components
  const app = createMiddleware(rootStore, initialStreams$);


  Observable.fromEvent(window, 'load')
    .subscribe(
      () => {
        const rootNode = document.getElementById('root');

        const App = React.createClass({
          render() {
            const {Grid} = ReactBootstrap;
            const {store, app} = this.props;
            return React.createElement(
              Grid, null,
              React.createElement(MessageComponent, {store}),
              React.createElement(NavigationComponent, {headers: headers}),
              React.createElement(AccountBalanceComponent, {store}),
              React.createElement(AccountWithdrawComponent, {store, app}),
              React.createElement(PortfolioComponent, {store, app}),
              React.createElement(TransactionsComponent, {store})
            );
          }
        });

        //Render the Application
        ReactDOM.render(
          React.createElement(App, {store: app.stream$, app: app}),
          rootNode);
      },
      err => console.error(err)
    );
})();