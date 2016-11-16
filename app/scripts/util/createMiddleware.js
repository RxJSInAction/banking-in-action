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

  function createMiddleware(store, factories) {

    const {Subject, Observable} = Rx;

    const input$ = new Subject();
    const output$ = Observable.from(store)
      .map(() => store.getState())
      .publishBehavior(store.getState())
      .refCount();

    const action$ = factories.map(processor => processor(input$, output$));

    const combined$ = Observable.merge(...action$).publish().refCount();

    const sub1 = combined$.subscribe(input$);
    const sub2 = combined$.subscribe(action => store.dispatch(action));

    return {
      dispatch: (value) => { input$.next(value); },
      get output$() { return output$; }
    };

  }

  root.DispatcherUtils = {
    ofType,
    createMiddleware
  };

})(window);