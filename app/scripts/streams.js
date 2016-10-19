/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const {ofType} = DispatcherUtils;

function handleSearch(action$, state$) {
  return action$
    .filter(ofType(INVOKE_SEARCH))
    .debounceTime(500)
    .switchMap(
      ({query}) => search(query, {limit: 20})
    ).map(
      results => updateSearchResults(results)
    )
}

function updateMessages(actions$, store$) {
  return actions$
    .filter(ofType(DISPLAY_MESSAGE))
    .flatMap(
      ({message}, id) => {
        const {duration, text, severity} = message;
        const steps = duration / 100;
        return Rx.Observable.timer(0, 100)
          .takeWhile(x => x < steps)
          .map(i => (steps - i) / steps)
          .map(opacity => updateMessage(id, text, severity, opacity))
          .concat(Rx.Observable.of(deleteMessage(id)));
      }
    );
}

const initializeBalances = (DB) => (action$) => {
  const getBalances$ = Rx.Observable.defer(() => DB.accounts.get('accounts'))
    .catch(() => Rx.Observable.of({checking: 0, savings: 0}))
    .map(balances => setBalance(balances));


  return Rx.Observable.concat(
    getBalances$,
    action$.filter(ofType(REFRESH_BALANCES))
      .flatMapTo(getBalances$)
  );
};

function processUserTransaction(actions$) {
  const do$ = actions$.filter(ofType(PROCESS_TRANSACTION)).pluck('factor');
  const amount$ = actions$.filter(ofType(UPDATE_AMOUNT))
    .pluck('amount')
    .map(x => typeof x === 'number' ? x : parseInt(x));
  const account$ = actions$.filter(ofType(UPDATE_ACCOUNT)).pluck('account');

  return do$.withLatestFrom(amount$, account$, (factor, amount, account) =>
    newTransaction(account, amount, factor))
}

function updateDBBalances(action$, store$) {
  return store$
    .distinctUntilKeyChanged('accounts')
    .pluck('accounts')
    .flatMap(accounts => {
      const {checking, savings, _rev} = accounts;
      const db = DB.accounts;
      return db.put({_id: 'accounts', _rev, checking, savings});
    })
}

function computeInterest(trigger$, principle$) {
  return trigger$
    .switchMapTo(
      principle$.take(1),
      (_, balance) => {
        const roundedBalance = +((0.1 / 365 * balance).toFixed(2));
        return newTransaction('savings', roundedBalance, 1)
      }
    );
}

// Processes interest payments
function processInterest(action$, store$, scheduler) {

  // Need the current savings balance to compute interest
  const savingsBalance$ = store$
    .distinctUntilKeyChanged('accounts')
    .pluck('accounts', 'savings');

  // Compute interest every 15 seconds
  return computeInterest(Rx.Observable.interval(15000), savingsBalance$);
}

// Processes a transaction operation
function handleTransaction(actions$, store$) {
  const balances = store$.distinctUntilKeyChanged('accounts').pluck('accounts');

  return actions$
    .filter(ofType(NEW_TRANSACTION))
    .let(toTransaction(balances));
}

function toTransaction(balance$) {
  return source => {
    // Guarantee that each transaction gets executed in order
    return source.withLatestFrom(balance$)
      .concatMap(([{account, amount, factor, assoc}, balances]) => {
        return Rx.Observable.of(balances)
          .pluck(account)
          // Compute the new balance and emit actions
          .flatMap(balance => {
            //Detect an overdraft
            if (factor < 0 && balance < amount) {
              throw new Error('Insufficient funds!');
            }

            const newBalance = balance + amount * factor;

            // Build a transaction record
            const transaction = {
              balance: newBalance,
              amount,
              account,
              factor,
              assoc
            };


            return [
              // Set the new balance
              setBalance({[account]: newBalance}),
              // Add a transaction log
              addTransaction(transaction)
            ];
          })
          // Handle a transaction error by sending an error action
          .catch(err => Rx.Observable.of(displayMessage(err.message, 'danger')));
      }
    );
  };
}
