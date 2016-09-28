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
    pullRight: true,
    target: '/logout'
  }
];

const {Navbar, NavItem, Nav} = ReactBootstrap;

const NavigationComponent = (props) =>
  React.createElement(
    Navbar,
    null,
    React.createElement(
      Nav, null,
      props.headers.map(({title}, key) => {
        return React.createElement(NavItem, {key, eventKey: key}, title)
      })
    )
  );