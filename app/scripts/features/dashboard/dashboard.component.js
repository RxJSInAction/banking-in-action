/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

class AppRouter {
  constructor() {
    this._url = new Rx.ReplaySubject(1);
  }
  redirectTo(url) {
    this._url.next(url);
  }

  get url() {
    return this._url.asObservable();
  }
}


const Router = new AppRouter();

Router.url.subscribe(x => console.log(`Redirecting to ${x}`));


/**
 * A single task button used for redirecting to one of the sub-pages
 */
const ActionButton = React.createClass({
  componentDidMount() {

  },
  render() {
    return (
      React.DOM.div(
        {style: {display: 'inline-block', paddingLeft: '20px', textAlign: 'center'}},
        React.DOM.input(
          {
            type: 'image',
            src: this.props.src,
            alt: this.props.title,
            height: '48px',
            width: '48px',
            onClick: () => Router.redirectTo(this.props.target)
          }
        ),
        React.DOM.div(
          null,
          this.props.title
        )
      )
    );
  }

});

/**
 * Houses the buttons that will be used for common linking tasks
 */
const ActionButtons = React.createClass({
  render() {
    return (
      React.DOM.div(
        {width: '100%', src: this.props.src},
        this.props.buttons.map(button => React.createElement(ActionButton, button))
      )
    );
  }
});


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
      .map(tx => ({transactions: tx})));

    const refreshStream = Rx.Observable.ifMap(() => this.props.refresh, () => this.props.refresh
      .map(tx => ({transactions: []})));

    this.subscriptions.add(
      txStream.merge(refreshStream)
      .subscribe(tx => {
        this.setState(tx)
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
      let {date, description, amount, category, balance} = tx;
      return React.DOM.tr({key: idx},
        React.DOM.td(null, date),
        React.DOM.td(null, description),
        React.DOM.td(null, `$${amount}`),
        React.DOM.td(null, category),
        React.DOM.td(null, balance)
      );
    });
  },
  render() {
    return (
      React.DOM.table(null,
        React.DOM.tbody(null, this.renderHeaders(), this.renderItems())
      )
    );
  }
});



// const StockTicker = React.createClass({});