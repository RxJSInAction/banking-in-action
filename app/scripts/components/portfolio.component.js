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
      this.props.state
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
        React.createElement(Typeahead, {state: this.props.state, app: this.props.app})
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
    const { state, app } = props;

    return (
      React.createElement(
        Panel, { header: 'Portfolio' },
        createElement(StockSearch, {state, app}),
        createElement(FilteredItemView, {state})
      )
    );
  };

  window.StockSearch = StockSearch;
  window.PortfolioTable = PortfolioTable;
})();