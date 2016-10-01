/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
(function() {
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

const { Observable } = Rx;

Observable.fromEvent(window, 'load')
  .subscribe(
    () => {
      const rootNode = document.getElementById('root');

      const App = React.createClass({
        render() {
          const { Grid } = ReactBootstrap;
          const { store } = this.props;
          return React.createElement(
            Grid, null,
            React.createElement(MessageComponent, {store}),
            React.createElement(NavigationComponent, {headers: headers}),
            React.createElement(AccountBalanceComponent, {store}),
            React.createElement(AccountWithdrawComponent, {store}),
            React.createElement(PortfolioComponent, {store}),
            React.createElement(TransactionsComponent, {store})
          );
        }
      });

      //Render the Application
      ReactDOM.render(
        React.createElement(App, {store: dispatcher.stream$}),
        rootNode);
    },
    err => console.error(err)
    );
})();