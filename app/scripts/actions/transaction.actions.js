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
  REMOVE: 'SHARES_REMOVE'
};

class PortfolioActions {
  constructor(dispatcher) {
    this._dispatcher = dispatcher;
  }

  buy(code, units) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.BUY,
      code,
      units
    });
  }

  sell(code, units) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.SELL,
      code,
      units
    });
  }

  remove(code, rev) {
    this._dispatcher.dispatch({
      type: PortfolioTypes.REMOVE,
      code,
      rev
    });
  }
}

const PortfolioActor = new PortfolioActions(AppDispatcher);