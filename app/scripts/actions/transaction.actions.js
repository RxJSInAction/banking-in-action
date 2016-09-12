/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
class TransactionActions {
  constructor(dispatcher) {
    this._dispatcher = dispatcher;
  }

  withdraw(accountId, amount) {
    this._dispatcher.dispatch({
      type: TransactionTypes.WITHDRAW,
      amount,
      accountId
    });
  }

  deposit(accountId, amount) {
    this._dispatcher.dispatch({
      type: TransactionTypes.DEPOSIT,
      amount,
      accountId
    });
  }

  transfer(sourceId, destinationId, amount) {
    this._dispatcher.dispatch({
      type: TransactionTypes.TRANSFER,
      sourceId,
      destinationId,
      amount
    });
  }
}

const TransactionActor = new TransactionActions(AppDispatcher);

const PortfolioTypes = {
  BUY: 'SHARES_BUY',
  SELL: 'SHARES_SELL',
  ADD: 'ADD_TO_PORTFOLIO',
  REMOVE: 'REMOVE_FROM_PORTFOLIO'
};

class PortfolioActions {
  constructor(dispatcher) {
    this._dispatcher = dispatcher;
  }

  addToPortfolio(code) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.ADD,
      code
    });
  }

  removeFromPortfolio(code) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.REMOVE,
      code
    });
  }

  buy(code, shares) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.BUY,
      code,
      shares
    });
  }

  sell(code, shares) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.SELL,
      code,
      shares
    });
  }
}

const PortfolioActor = new PortfolioActions(AppDispatcher);