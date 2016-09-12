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

/* Action Items:
*
* 1) Data (stocks, accounts, transactions, routing?)
* 2) Tool to build transaction history
* 3) Tool to build stock history

* */

var buttons = [
  {
    key: 1,
    title: 'Accounts',
    src: 'app/images/coins.png',
    target: '/accounts',
    action: ''
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
    logout() {
    }
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
  let {userToken} = credentials;
  let Api = ApiBuilder(userToken);
  return Rx.Observable.of({Api});
}

function getScaffold() {
  return Rx.Observable.fromPromise(fetch('app/scaffolds/user_experience.json'))
    .flatMap(x => {
      return x.json();
    });
}

const init = Rx.Observable.fromEvent(window, 'load')
  .flatMapTo(verifyLogin)
  .flatMap(login)
  .flatMap(getScaffold, ({Api}, scaffold) => {
    return {Api, scaffold};
  })
  .publishReplay(1);


init
  .map(({Api, scaffold}) =>
    React.DOM.div(
      null,
      React.createElement(HeaderComponent, null),
      React.createElement(ActionButtons, {buttons: buttons})
    )
  )
  .subscribe(
    theApp => ReactDOM.render(theApp, document.getElementById('content')),
    err => console.error(err));

init.subscribe(() =>
  ReactDOM.render(
    React.DOM.div(
      null,
      React.createElement(StockSearch, null),
      React.createElement(StockTable, null)
    ),
    document.getElementById('stocks')
  )
);


init.subscribe(() =>
  ReactDOM.render(
    React.createElement(RecentActivity, {transactions: [], newActivity: Transactions.transactions}),
    document.getElementById('recent-transactions')
  )
);

init.connect();





