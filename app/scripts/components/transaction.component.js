/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
(function () {
  /**
   * A recent activity table
   */
  const RecentActivity = React.createClass({
    getInitialState() {
      return {transactions: []};
    },
    componentDidMount() {

      this.sub = this.props.state
        .distinctUntilKeyChanged('transactions')
        .map(({skip, limit, transactions}) => {
          return R.slice(skip, skip + limit, transactions);
        })
        .subscribe(transactions => {
          this.setState({transactions});
        });

    },
    componentDidUnMount() {
      this.sub.unsubscribe();
    },
    renderHeaders() {
      const headers = ["Date", "Type", "Account", "Amount", "Balance"]
        .map((title, idx) => React.DOM.th({key: idx}, title));

      return React.DOM.tr(null, headers);
    },
    renderItems() {
      const {tr, td} = React.DOM;

      return this.state.transactions.map((tx, key) => {
        const {timestamp, factor, description, amount, account, balance} = tx;
        const type = factor < 0 ? 'withdraw' : 'deposit';

        return tr({key},
          td(null, moment(timestamp).format('MM / DD / YYYY')),
          td(null, type),
          td(null, account),
          td(null, `$${amount.toFixed(2)}`),
          td(null, `$${balance.toFixed(2)}`)
        );
      });
    },
    render() {
      const {table, tbody} = React.DOM;
      const {Table} = ReactBootstrap;

      return (
        React.createElement(Table, {hover: true, bordered: true},
          tbody(null, this.renderHeaders(), this.renderItems())
        )
      );
    }
  });

  window.TransactionsComponent = (props) => {
    const {Panel} = ReactBootstrap;

    return (
      React.createElement(Panel, {header: 'Recent Transactions'},
        React.createElement(RecentActivity, props)
      )
    );
  };

  window.RecentActivity = RecentActivity;
})();
