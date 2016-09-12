/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const StockSearch = React.createClass({
  getInitialState() {
    return {matches: []};
  },
  componentDidMount() {
    Searches.subscribe(results => {
      this.setState({matches: results || []});
    });
  },
  componentDidUnMount() {
    this.sub.unsubscribe();
  },
  render() {
    return (
      React.createElement(Typeahead, {suggestions: this.state.matches})
    );
  }
});

const StockTable = React.createClass({
  getInitialState() {
    return {stocks: []};
  },
  componentDidMount() {
    Portfolio.subscribe(
      search => {
        this.setState({stocks: search});
      }
    );
  },
  renderHeaders() {
    const headers = ["Code", "Name", "High", "Low", "Close", "Shares"]
      .map((title, idx) => React.DOM.th({key: idx}, title));

    return React.DOM.tr(null, headers);
  },
  renderItems() {
    return this.state.stocks.map((tx, idx) => {
      let {code, name, high, low, close, shares} = tx;
      return React.DOM.tr({key: idx},
        React.DOM.td(null, code),
        React.DOM.td(null, name),
        React.DOM.td(null, `$${low}`),
        React.DOM.td(null, `$${high}`),
        React.DOM.td(null, `$${close}`),
        React.DOM.td(null, shares)
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