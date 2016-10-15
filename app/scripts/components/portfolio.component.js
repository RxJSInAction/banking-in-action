/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
(function() {

  const {a, div, tbody, td, th, tr} = React.DOM;

  const StockSearch = React.createClass({
    getInitialState() {
      return {matches: []};
    },
    componentWillMount() {
      this.props.store
        .distinctUntilKeyChanged('searches')
        .pluck('searches', 'results')
        .subscribe(matches => {
          this.setState({matches});
        })
    },
    componentWillUnmount() {
    },
    render() {
      return (
        React.createElement(Typeahead, {suggestions: this.state.matches, store: this.props.store})
      );
    }
  });

  const PortfolioItem = React.createClass({
    render() {
      const {Badge, Glyphicon} = ReactBootstrap;
      let { code, name, close, units } = this.props;

      return (
        tr({key: code},
          td(null, code),
          td(null, name),
          td(null, `$${close}`),
          td(null,
            div(null,
              a(null, React.createElement(Glyphicon, {glyph: 'minus'})),
              React.createElement(Badge, null, units),
              a(null, React.createElement(Glyphicon, {glyph: 'plus'}))
            )
          ),
          td(null,
            a({onClick: this.props.remove},
              React.createElement(Glyphicon, {glyph: 'trash'})
            )
          )
        ));
    }
  });

  const PortfolioTable = React.createClass({
    headers: ["Code", "Name", "Close", "Units", "Remove"],
    getInitialState() {
      return {portfolio: []};
    },
    componentDidMount() {
      this.props.store
        .distinctUntilChanged(null, ({portfolio}) => portfolio)
        .flatMap(({portfolio}) => {
          return Rx.Observable.from(R.toPairs(portfolio))
            .concatMap(
              ([code, units]) => search(code, {exact: true}),
              ([code, units], [{name, close}]) => ({code, units, name, close})
            )
            .toArray();
        })
        .subscribe(portfolio => {
          this.setState({portfolio});
        })

    },
    renderHeaders() {
      const headers = this.headers
        .map((title, key) => th({key}, title));

      return tr(null, headers);
    },
    renderItems() {
      const { portfolio } = this.state;
      return portfolio.map((body) => {
        const {code, name, close, units} = body;
        return (
          React.createElement(
            PortfolioItem,
            {code, name, close, units, key: code}
          )
        )
      });
    },
    render() {
      const { Table } = ReactBootstrap;
      return (
        React.createElement(Table, {hover: true, bordered: true },
          tbody(null, this.renderHeaders(), this.renderItems())
        )
      );
    }

  });

  window.PortfolioComponent = (props) => {
    const { createElement } = React;
    const { Panel } = ReactBootstrap;
    const { store } = props;

    return (
      React.createElement(
        Panel, { header: 'Portfolio' },
        createElement(StockSearch, {store}),
        createElement(FilteredItemView, {store})
      )
    );
  };

  window.StockSearch = StockSearch;
  window.PortfolioTable = PortfolioTable;
})();