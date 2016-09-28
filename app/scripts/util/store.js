/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const store = (function () {

  class Store extends Rx.Observable {
    constructor(reducer, init) {
      super();
      this._subject = new Rx.Subject();
      this._source = this._subject
        .scan(reducer, init)
        .publishBehavior(init);

      this._source.connect();
    }

    _subscribe(observer) {
      return this._source.subscribe(observer);
    }

    dispatch(action) {
      this._subject.next(action);
    }
  }

  return (reducer, initial = {}) => new Store(reducer, initial);

})();