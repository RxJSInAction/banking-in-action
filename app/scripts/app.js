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

const { div } = React.DOM;
const { render } = ReactDOM;
const { createElement } = React;
const { Observable } = Rx;

Observable.fromEvent(window, 'load')
  .subscribe(
    () => {
      const rootNode = document.getElementById('root');

      const AccountBalanceComponent = React.createClass({
        getInitialState() {
          return {checking: 0, savings: 0}
        },
        componentDidMount() {
          this.props.store.distinctUntilKeyChanged('accounts')
            .map(({accounts}) => accounts)
            .subscribe(({checking, savings}) => this.setState({checking, savings}))
        },
        render() {
          const { Panel } = ReactBootstrap;
          return (
            createElement(Panel, null,
              React.createElement(BalanceComponent, {balance: this.state.checking, name: 'Checking'}),
              React.createElement(BalanceComponent, {balance: this.state.savings, name: 'Savings'})
            )
          )
        }
      });

      const App = React.createClass({
        render() {
          const { Grid, Panel } = ReactBootstrap;
          const { store } = this.props;
          return React.createElement(
            Grid, null,
            React.createElement(MessageList, {store}),
            React.createElement(NavigationComponent, {headers: headers}),
            React.createElement(AccountBalanceComponent, {store}),
            React.createElement(Panel, {header: 'Portfolio'},
              createElement(StockSearch, {store}),
              createElement(FilteredItemView, {store}),
              createElement(PortfolioTable, {store})
            ),
            React.createElement(Panel, {header: 'Recent Transactions'},
              createElement(RecentActivity, {transactions: transactions, store})
            )
          );
        }
      });

      //Render the headers
      render(
        React.createElement(App, {store: app}),
        rootNode);
    },
    err => console.error(err)
    );
})();