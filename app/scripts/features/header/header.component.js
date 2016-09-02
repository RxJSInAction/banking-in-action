/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

const HeaderLink = props => {
  return React.createElement(
    'li',
    {className: 'nav-item nav-' + (props.float || 'left')},
    React.createElement('a', null, props.title)
  );
};


const HeaderLinks = React.createClass({
  render() {
    return (
      React.createElement(
        'ul',
        {className: 'nav-bar'},
        this.props.headers.map((header, key) => React.createElement(HeaderLink, {title: header.title, float: header.float, key: key}))
      )
    );
  }
});

let headers = [
  {
    title: 'Home'
  },
  {
    title: 'Accounts'
  },
  {
    title: 'Transfers'
  },
  {
    title: 'Investments'
  },
  {
    title: 'Contact Us'
  },
  {
    title: 'Log out',
    float: 'right'
  }
];

const HeaderComponent = React.createClass({
  render() {
    return (
      React.DOM.div(
        null,
        React.createElement(HeaderLinks, {headers: headers}),
        React.createElement(SearchContext, null)
      )
    );
  }
});