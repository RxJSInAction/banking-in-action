/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

(function(root) {

// A custom utility operator for only accepting messages
// of a certain type
  function ofType(target) {
    return source => source.filter(({type}) => type === target);
  }

  function createDispatcher(store) {

    const subscription = new Rx.Subscription();

    const store$ = Rx.Observable.create(observer => {
      const subscription = store.subscribe(() => {
        observer.next(store.getState());
      });

      return new Rx.Subscription(() => subscription());
    })
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

    function include(processor) {
      const newStream$ = processor(action$, store$);
      actionSubject.next(newStream$);
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
    createDispatcher
  };

})(window);