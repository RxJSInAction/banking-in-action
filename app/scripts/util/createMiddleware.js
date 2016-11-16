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
   * @param targets {string[]}
   * @returns {function(*): boolean}
   */
  Rx.Observable.prototype.ofType = function (...targets) {
    return this.filter(type => {
      switch (targets.length) {
        case 0:
          throw new Error('Must define at least one filter type');
        case 1:
          return targets[0] === type;
        default:
          return targets.indexOf(type) > -1;
      }

    });
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