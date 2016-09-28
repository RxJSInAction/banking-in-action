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

      this.sub = app.distinctUntilChanged(
        null,
        ({transactions}) => transactions
      )
        .subscribe(({transactions}) => {
          this.setState({transactions: transactions});
        })

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

      return this.state.transactions.map((tx, idx) => {
        const {timestamp, description, amount, account, balance} = tx;
        const type = amount < 0 ? 'withdraw' : 'deposit';

        return tr({key: idx},
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

  const BalanceComponent = window.BalanceComponent = (props) => {
    const {div, h1, h3} = React.DOM;

    return (
      div({className: 'col-xs-6 text-justify'},
        h3(null, `${props.name}:`),
        h1(null, `$${props.balance.toFixed(2)}`)
      )
    );
  };

  const Message = (props) => {
    const {div} = React.DOM;
    const {Alert} = ReactBootstrap;
    const {severity, text, duration} = props.message;
    return (
      React.createElement(Alert, {bsStyle: severity, style: {opacity: duration}}, text)
      // div({className: `alert alert-${severity || 'info'}`, style: {opacity: duration}, role: "alert"}, text)
    );
  };

  const MessageList = window.MessageList = React.createClass({
    getInitialState() {
      return {messages: []};
    },
    componentDidMount() {
      this.props.store
        .distinctUntilKeyChanged('messages')
        .subscribe(({messages}) => {
          this.setState({messages});
        })
    },
    render(){
      return (
        React.DOM.div(null,
          this.state.messages.map((message, key) =>
            React.createElement(Message, {message, key})
          ))
      );
    }
  });

  //Only allow messages to survive for a little while
  Rx.Observable.interval(250)
    .withLatestFrom(app.pluck('messages'))
    .filter(([_, messages]) => messages.length > 0)
    .subscribe(x => dispatch(degradeMessages()));

  // app.subscribe(({messages}) => {
  //   ReactDOM.render(
  //     React.createElement(MessageList, {messages}),
  //     document.getElementById('message-center')
  //   );

// });


  window.RecentActivity = RecentActivity;
})();