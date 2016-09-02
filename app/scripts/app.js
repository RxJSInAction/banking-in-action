/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

// Start configuration step here
// 1) Check logged in status
// 2) Force log-in
// 3) Use log-in token to get dashboard set-up information

var buttons = [
  {
    key: 1,
    title: 'Accounts',
    src: 'app/images/coins.png',
    target: '/accounts'
  },
  {
    key: 2,
    title: 'Transfers',
    target: '/transfers'
  },
  {
    key: 3,
    title: 'Investments',
    target: '/investments'
  }
];

function ApiBuilder(token) {
  return {
    logout() {}
  };
}


const UserExperience = Rx.Observable.of({userToken: 'abc123'});
const GuestExperience = Rx.Observable.of({userToken: 'unauthorized'});

const verifyLogin = Rx.Observable.if(
  () => true,
  UserExperience,
  GuestExperience
);

function login(credentials) {
  let { userToken } = credentials;
  let Api = ApiBuilder(userToken);
  return Rx.Observable.of({ Api });
}

const transactions = [
  {description: 'AMEX PAYMENT', amount: 451.43, date: 'PENDING', category: 'Credit/Debit'}
];

const transactions2 = [
  {description: 'RENT PAYMENT', amount: 2000.00, date: '6/15/16', category: 'Credit/Debit'}
];

const updateTransactions = Rx.Observable.timer(5000)
  .map(_ => {
    return transactions2.concat(transactions)
  });

const init = Rx.Observable.fromEvent(window, 'load')
  .flatMapTo(verifyLogin)
  .flatMap(login)
  .map(({Api}) =>
    React.DOM.div(
      {width: '100%'},
      React.createElement(HeaderComponent, null),
      React.createElement(ActionButtons, {buttons: buttons}),
      React.createElement(RecentActivity, {transactions: transactions, newActivity: updateTransactions})
    )
  )
  .subscribe(theApp =>
    ReactDOM.render(
      theApp,
      document.getElementById('content')
    ), e => console.error(err));





