/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';
const REMOVE_FROM_PORTFOLIO = 'REMOVE_FROM_PORTFOLIO';
const UPDATE_STOCK = 'UPDATE_STOCK';

function portfolio(state = {}, action) {

  switch (action.type) {
    case UPDATE_STOCK:
      const itemLens = R.lensPath([action.code]);
      return R.set(itemLens, action.units, state);
    case REMOVE_FROM_PORTFOLIO:
      return R.omit([action.code], state);
    default:
      return state;
  }
}

function updateStock(code, units) {
  return {type: UPDATE_STOCK, code, units};
}

function removeStock(code) {
  return {type: REMOVE_FROM_PORTFOLIO, code};
}

function buyShares(store, code, units) {
  // Get the current state of the application
  const current = store.take(1);

  //Get data on the shares we want to buy
  const codeSearch = search(code, {exact: true});

  return Rx.Observable.zip(current, codeSearch,
    ({portfolio}, [stock]) => ({portfolio, stock})
  )
    .flatMap(({portfolio, stock: {code, close}}) => {
      const stockLens = R.lensPath([code, 'units']);
      const current = R.view(stockLens, portfolio);
      return withdraw(store, 'checking', close * units)
      // Here we know the withdraw was successful so go ahead and increase the shares
        .mapTo(R.add(units, R.defaultTo(0)(current)))

        // Notify the application that units have been purchased
        .do(units => dispatch(updateStock(code, units)));
    });
}

function sellShares(store, code, units) {
  // Get the current state of the application
  const current = store.take(1);

  //Get data on the shares we want to buy
  const codeSearch = search(code, {exact: true});

  return Rx.Observable.zip(current, codeSearch,
    ({portfolio}, [{code, close}]) => ({portfolio, code, close})
  )
    .flatMap(({portfolio, code, close}) => {
      const stockLens = R.lensProp(code);
      const current = R.view(stockLens, portfolio);
      return deposit(store, 'checking', close * units)
      // Here we know the deposit was successful so go ahead and increase the shares
        .mapTo(R.add(-units, R.defaultTo(0)(current)))
        // Notify the application that units have been purchased
        .do(units =>
          dispatch(updateStock(code, units))
        );
    });
}

function sellAllShares(store, code) {
  const current = store.take(1);

  const codeSearch = search(code, {exact: true});

  return Rx.Observable.zip(current, codeSearch,
    ({portfolio}, [{code, close}]) => ({portfolio, code, close})
  )
    .flatMap(({portfolio, code, close}) => {
      const codeLens = R.lensProp(code);
      const current = R.view(codeLens, portfolio);
      return deposit(store, 'checking', close * current)
    })
    .do(() => dispatch(removeStock(code)))
}







