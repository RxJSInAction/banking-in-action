/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

let headers = [
  {
    title: 'Home',
    target: '/'
  },
  {
    title: 'Accounts',
    target: '/accounts'
  },
  {
    title: 'Transfers',
    target: '/transfers'
  },
  {
    title: 'Investments',
    target: '/investments'
  },
  {
    title: 'Contact Us',
    target: '/contact'
  },
  {
    title: 'Log out',
    float: 'right',
    target: '/logout'
  }
];


const HeaderLink = props => {
  return React.DOM.li(
    {className: 'nav-item nav-' + (props.float || 'left'),
      onClick: () => Router.redirectTo(props.target)},
    React.DOM.a(null, props.title)
  );
};


const HeaderLinks = React.createClass({
  render() {
    return React.DOM.ul(
      {className: 'nav-bar'},
      this.props.headers.map((header, key) =>
        React.createElement(HeaderLink,
          {
            title: header.title,
            float: header.float,
            key: key,
            target: header.target
          }
        )
      )
    );
  }
});


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