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
    this.sub = Searches.subscribe(results => {
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

const PortfolioTable = React.createClass({
  getInitialState() {
    return {portfolio: []};
  },
  componentDidMount() {
    PortfolioUpdates.subscribe(
      search => {
        this.setState({portfolio: search});
      }
    );
  },
  renderHeaders() {
    const headers = ["Code", "Name", "Close", "Units", "Remove"]
      .map((title, idx) => React.DOM.th({key: idx}, title));

    return React.DOM.tr(null, headers);
  },
  renderItems() {
    return this.state.portfolio.map((tx, idx) => {
      let {code, rev, name, high, low, close, unit} = tx;
      return React.DOM.tr({key: idx},
        React.DOM.td(null, code),
        React.DOM.td(null, name),
        React.DOM.td(null, `$${close}`),
        React.DOM.td(null, unit),
        React.DOM.td(null,
          React.DOM.a({onClick: () => PortfolioActor.remove(code, rev) },
            React.DOM.span({className: 'glyphicon glyphicon-trash'})
          )
        )
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