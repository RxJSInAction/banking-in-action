/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const {createStore} = Redux;
const {ofType, createDispatcher} = DispatcherUtils;

const dispatcher = createDispatcher(createStore(bankingApp, {
  accounts: {checking: 100, savings: 100},
  transactions: {transactions: [], limit: 10, skip: 0},
  messages: [],
  searches: {query: '', results: []}
}));

const balanceActions = {
  withdraw: () => dispatcher.dispatch({type: PROCESS_TRANSACTION, factor: -1}),
  deposit: () => dispatcher.dispatch({type: PROCESS_TRANSACTION, factor: 1}),
  amount: (value) => dispatcher.dispatch({type: UPDATE_AMOUNT, amount: value}),
  account: (value = 'checking') => dispatcher.dispatch({type: UPDATE_ACCOUNT, account: value})
};

dispatcher.include(handleSearch);
dispatcher.include(handleMessages);
dispatcher.include(processUserTransaction);
dispatcher.include(processInterest);
dispatcher.include(handleTransaction);

function handleMessages(actions$, store$) {
  return Rx.Observable.interval(250)
    .withLatestFrom(store$.pluck('messages'))
    .filter(([_, messages]) => messages.length > 0)
    .mapTo(degradeMessages());
}

function handleSearch(action$, state$) {
  return action$
    .let(ofType(INVOKE_SEARCH))
    .debounceTime(500)
    .switchMap(
      ({query}) => search(query, {limit: 20})
    ).map(
      results => updateSearchResults(results)
    )
}

function processUserTransaction(actions$) {
  const do$ = actions$.let(ofType(PROCESS_TRANSACTION)).pluck('factor');
  const amount$ = actions$.let(ofType(UPDATE_AMOUNT))
    .pluck('amount')
    .map(x => typeof x === 'number' ? x : parseInt(x));
  const account$ = actions$.let(ofType(UPDATE_ACCOUNT)).pluck('account');

  return do$.withLatestFrom(amount$, account$, (factor, amount, account) =>
    ({amount, account, factor, type: NEW_TRANSACTION}))
}

function processInterest(action$, store$) {

  const savingsBalance$ = store$
    .distinctUntilKeyChanged('accounts')
    .pluck('accounts', 'savings');


  return Rx.Observable.interval(15000)
    .switchMapTo(savingsBalance$.take(1))
    .map(balance => ({
      account: 'savings',
      amount: (0.1 / 365 * balance),
      factor: 1,
      type: NEW_TRANSACTION
    }));
}

function handleTransaction(actions$, store$) {
  const balances = store$.distinctUntilKeyChanged('accounts').pluck('accounts');

  return actions$
    .let(ofType(NEW_TRANSACTION))
    .let(toTransaction(balances));
}

function toTransaction(balances) {
  return source => {
    // Guarantee that these get executed in order
    return source.concatMap(({account, amount, factor, assoc}) => {
        return balances
        // Handles the recursion from reprocessing balances
          .observeOn(Rx.Scheduler.asap)
          // Take the first balance to match against
          .take(1)
          // Extract the account we want
          .pluck(account)
          // Compute the new balance and emit actions
          .flatMap(balance => {

            //Detect an overdraft
            if (factor < 0 && balance < amount) {
              throw new Error('Insufficient funds!');
            }

            // Return the transaction
            const transaction = {
              balance: balance + amount * factor,
              amount,
              account,
              factor,
              assoc
            };

            // Send new actions
            return [setBalance(transaction), addTransaction(transaction)];
          })
          // Handle a transaction error by sending an error action
          .catch(err => Rx.Observable.of(displayMessage(err.message, 'danger')));
      }
    );
  };
}
