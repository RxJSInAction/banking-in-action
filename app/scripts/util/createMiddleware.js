/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

(function (root) {

// A custom utility operator for only accepting messages
// of a certain type
  Rx.Observable.prototype.ofType = function (...types) {
    const len = types.length;
    return this.filter(({type}) => {
      switch (len) {
        case 0:
          throw new Error('Must define at least one filter type!');
        case 1:
          return types[0] === type;
        default:
          return types.indexOf(type) > -1;
      }
    });
  };

  function createStreamFromStore(store) {
    return Rx.Observable.from(store)
      .map(() => store.getState())
      .publishBehavior(store.getState())
      .refCount();
  }

  function createMiddleware(store, epics) {

    const input$ = new Rx.Subject();

    const actions =
      epics.map(epic =>
        epic(input$, store));

    const combinedActions$ = Rx.Observable
      .merge(...actions)
      .publish();

    combinedActions$.subscribe(input$);
    combinedActions$.subscribe(action => store.dispatch(action));

    const sub = combinedActions$.connect();

    input$.subscribe({
      error: err => console.warn(err)
    });

    return {
      dispatch: (action) => input$.next(action),
      unsubscribe: () => sub.unsubscribe()
    };
  }

  root.DispatcherUtils = {
    createMiddleware,
    createStreamFromStore
  };

})(window);