/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
(function () {

  const ItemComponent = ({code, close}) => {
    const {Button, Badge} = ReactBootstrap;
    return (
      React.createElement(Button, {bsStyle: 'link'},
        React.createElement(Badge, null, `${code} ${close}`)
      ));
  };

  const FilteredItemView = window.FilteredItemView =
    React.createClass({
      getInitialState() {
        return {items: []};
      },
      componentDidMount() {
        this.props.store
          .distinctUntilKeyChanged('searches')
          .pluck('searches', 'results')
          .subscribe(results => this.setState({items: results}))
      },
      render() {
        const {Row, Well} = ReactBootstrap;
        return (
          React.createElement(Well, {bsSize: 'lg', className: 'stock-display'},
            React.createElement(Row, {className: 'stock-table'},
              this.state.items.map(({code, close}, key) =>
                React.createElement(ItemComponent, {key, code, close})
              )
            )
          )
        );
      }

    });

  const Typeahead = window.Typeahead = ({app}) => {
    const {FormControl} = ReactBootstrap;
    return (
      React.createElement(FormControl, {
        autoComplete: 'off',
        onChange: (e) => app.dispatch(startSearch(e.target.value))
      })
    );
  };
})();