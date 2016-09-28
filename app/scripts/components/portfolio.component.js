/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
(function() {

  const {a, div, span, tbody, td, th, tr} = React.DOM;
  const {createElement, createClass} = React;

  const StockSearch = createClass({
    getInitialState() {
      return {matches: []};
    },
    componentWillMount() {
      this.props.store.distinctUntilChanged(null, ({searches}) => searches)
        .map(({searches: {results}}) => {
          return results;
        })
        .subscribe(matches => {
          this.setState({matches});
        })
    },
    componentWillUnmount() {
    },
    render() {
      return (
        createElement(Typeahead, {suggestions: this.state.matches})
      );
    }
  });

  const PortfolioItem = React.createClass({
    render() {
      let { code, name, close, units } = this.props;
      return (
        tr({key: code},
          td(null, code),
          td(null, name),
          td(null, `$${close}`),
          td(null,
            div(null,
              a(null, span({className: 'glyphicon glyphicon-minus'})),
              span({className: 'badge'}, units),
              a(null, span({className: 'glyphicon glyphicon-plus'}))
            )
          ),
          td(null,
            a({onClick: this.props.remove},
              span({className: 'glyphicon glyphicon-trash'})
            )
          )
        ));
    }
  });

  const PortfolioTable = createClass({
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
        const remove = () => sellAllShares(app, code).subscribe();
        return createElement(
          PortfolioItem,
          {code, name, close, units, key: code, remove}
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

  window.StockSearch = StockSearch;
  window.PortfolioTable = PortfolioTable;
})();