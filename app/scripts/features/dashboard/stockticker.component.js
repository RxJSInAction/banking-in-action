/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

class SearchEngine {
  constructor() {
    this._engine = new Rx.Subject();
  }
  search(query) {
    this._engine.next(query);
  }
  get searches() {
    return this._engine.asObservable();
  }
}

class StockStore {
  constructor() {
    this._store = new Rx.ReplaySubject([]);
  }
  get stocks() {
    return this._store.asObservable();
  }
  addStock(stock) {
    this._store.next([stock]);
  }
}

const Stocks = new StockStore();

Stocks.addStock({name: 'test', value: '40.04'});

const StockList = React.createClass({
  getInitialState() {
    return {stocks: []};
  },
  componentDidMount() {
    this.sub = Stocks.stocks.subscribe(stocks => {
      this.setState({stocks: stocks});
    });
    this.searchEngine = new SearchEngine();

    this.searchEngine.searches
      .filter(x => x.length && x.length > 0)
      .debounceTime(250)
      .switchMap(q => {
        return fetch(`http://finance.yahoo.com/webservice/v1/symbols`);
      })
      .subscribe(x => {
        console.log(x)
      });
  },
  componentDidUnMount() {
    this.sub.unsubscribe();
  },
  render() {
    return (
      React.DOM.div(
        null,
        React.DOM.div(
          null,
          React.DOM.input(
            {type: 'text', onKeyUp: (e) =>{
              this.searchEngine.search(e.target.value)
            }}
          ),
          React.DOM.button(
            null,
            'Add New'
          )
        ),
        React.DOM.ul(
          null,
          this.state.stocks.map((item, key) => {
            return React.DOM.li(
              {key: key},
              `${item.name} - ${item.value}`
            )
          })
        )
      )
    );
  }
});