/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

(function (root) {

// A custom utility operator for only accepting messages
// of a certain type
  /**
   * @param target {string}
   * @returns {function(*): boolean}
   */
  function ofType(target) {
    return ({type}) => type === target;
  }

  function createMiddleware(store, streams$) {

    const {Subject, Observable} = Rx;

    const store$ = Observable.from(store)
      .map(() => store.getState())
      .publishBehavior(store.getState());

    const input$ = new Subject();

    const dispatch = (value) => input$.next(value);
    const getState$ = () => store$;

    const subscription =
      Observable.merge(
        ...streams$.map(processor => processor(input$, store$))
      )
        .do(input$)
        .subscribe(action => store.dispatch(action));

    subscription.add(store$.connect());

    return {
      dispatch: dispatch,
      getState$: getState$,
      unsubscribe: () => subscription.unsubscribe()
    };

  }

  root.DispatcherUtils = {
    ofType,
    createMiddleware
  };

})(window);