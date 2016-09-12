/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
class AppRouter {
  constructor() {
    this._url = new Rx.ReplaySubject(1);
  }
  redirectTo(url) {
    this._url.next(url);
  }

  get url() {
    return this._url.asObservable();
  }
}


const Router = new AppRouter();

Router.url.subscribe(x => console.log(`Redirecting to ${x}`));