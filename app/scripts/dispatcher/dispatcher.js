/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

/**
 * A simple event emitter like class for propagating events.
 * We don't directly expose a subject because that tends to be a dangerous
 * idea
 */
class ReactiveDispatcher extends Rx.Observable {

  /**
   * Creates a new dispatcher
   */
  constructor() {
    super();
    this._subject = new Rx.Subject();
  }

  /**
   * Receives actions and immediately forwards them
   * @param action
   */
  dispatch(action) {
    this._subject.next(action);
  }

  /**
   *
   * @param observer
   * @returns {AnonymousSubscription|ISubscription|Subscription}
   * @private
   */
  _subscribe(observer) {
    return this._subject.subscribe(observer);
  }
}

// Root level dispatcher for the application
const AppDispatcher = new ReactiveDispatcher();