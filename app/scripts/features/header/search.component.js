/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';


const SearchBar = React.createClass({
  render() {
    return (
      React.DOM.div(
        {display: 'block', className: 'search-bar'},
        React.DOM.input({type: 'text', minLength: 100})
      )
    )
  }
});

const SearchContext = React.createClass({
  render() {
    return (
      React.DOM.div(
        {style: {padding: '20px'}, className: 'search-context'},
        React.createElement(SearchBar, null)
      )
    );
  }
});