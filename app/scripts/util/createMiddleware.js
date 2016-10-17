/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

(function(root) {

// A custom utility operator for only accepting messages
// of a certain type
  /**
   * @param target {string}
   * @returns {function(Observable<T>): Observable<R>}
   */
  function ofType(target) {
    return ({type}) => type === target;
  }

  function createMiddleware(store, streams$) {

    const {Subscription, Observable} = Rx;

    const subscription = new Subscription();

    const store$ = Rx.Observable.from(store)
      .map(() => store.getState())
      .publishBehavior(store.getState());

    const actionSubject = new Rx.Subject();
    const action$ = actionSubject
      .flatMap(stream$ => stream$)
      .publish()
      .refCount();

    subscription.add(
      action$.subscribe(next => store.dispatch(next))
    );

    subscription.add(store$.connect());

    if (streams$) {
      include(streams$);
    }

    function include(processors) {
      processors.forEach(p => {
        const stream$ = p(action$, store$);
        actionSubject.next(stream$);
      });
    }

    function dispatch(action) {
      actionSubject.next([action]);
    }

    return {
      include: include,
      dispatch: dispatch,
      stream$: store$,
      unsubscribe: () => subscription.unsubscribe()
    };

  }

  root.DispatcherUtils =  {
    ofType,
    createMiddleware
  };

})(window);