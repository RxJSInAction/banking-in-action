/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
Rx.Observable.ifMap = function(condition, thenSelector, elseSelector) {
  return Rx.Observable.if(condition,
    Rx.Observable.defer(thenSelector),
    elseSelector && Rx.Observable.defer(elseSelector));
};

/**
 * A recent activity table
 */
const RecentActivity = React.createClass({
  getInitialState() {
    return {transactions: []};
  },
  componentDidMount() {
    this.subscriptions = new Rx.Subscription();
    const txStream = Rx.Observable.ifMap(() => this.props.newActivity, () => this.props.newActivity
      .map(tx => [tx]));

    const refreshStream = Rx.Observable.ifMap(() => this.props.refresh, () => this.props.refresh
      .map(tx => ({transactions: []})));

    this.subscriptions.add(
      txStream.merge(refreshStream)
      .subscribe(tx => {
        this.setState({transactions: this.state.transactions.concat(tx)});
      }));
  },
  componentDidUnMount() {
    this.subscriptions.unsubscribe();
  },
  renderHeaders() {
    const headers = ["Date", "Description", "Amount", "Category", "Balance"]
      .map((title, idx) => React.DOM.th({key: idx}, title));

    return React.DOM.tr(null, headers);
  },
  renderItems() {
    return this.state.transactions.map((tx, idx) => {
      let {timestamp, description, amount, category, name, balance} = tx;
      return React.DOM.tr({key: idx},
        React.DOM.td(null, moment(timestamp).format('MM / DD / YYYY')),
        React.DOM.td(null, name),
        React.DOM.td(null, `$${amount}`),
        React.DOM.td(null, category),
        React.DOM.td(null, balance)
      );
    });
  },
  render() {
    return (
      React.DOM.table({className: 'table table-hover table-bordered col-xs-6'},
        React.DOM.tbody(null, this.renderHeaders(), this.renderItems())
      )
    );
  }
});

const BalanceComponent = (props) => (
  React.DOM.div(
    {className: 'col-xs-6 text-justify'},
    React.DOM.h3(null, `${props.name}:`),
    React.DOM.h1(null, `$${props.balance}`)
  )
);


Balances.subscribe(x => {
  ReactDOM.render(
    React.DOM.div(
      null,
      React.createElement(BalanceComponent, {balance: x.checking, name: 'Checking'}),
      React.createElement(BalanceComponent, {balance: x.savings, name: 'Savings'})
    ),
    document.getElementById('account-balances')
  );
});