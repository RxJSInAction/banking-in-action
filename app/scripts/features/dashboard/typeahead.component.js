/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const Typeahead = React.createClass({
  render() {
    return (
      React.DOM.div(
        {className: 'form-group col-xs-12'},
        React.DOM.div(
          {className: 'typeahead'},
          React.DOM.form(
            null,
            React.DOM.input(
              {
                className: 'form-control',
                onKeyUp: e => SearchActor.search(e.target.value, {limit: 10}),
                onBlur:  e => SearchActor.search('', {limit: 0})
              }
            )
          ),
          React.DOM.ul(
            null,
            this.props.suggestions.map((s, i) =>
              React.DOM.li({
                key: i,
                onClick: e => PortfolioActor.addToPortfolio(s.code)
              }, s.code)
            )
          )
        )
      )
    )
  }
});