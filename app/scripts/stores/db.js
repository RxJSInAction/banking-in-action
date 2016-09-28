/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
'use strict';

const DB = (function (tables) {
  return R.fromPairs(tables
    .map(tableName => [tableName, new PouchDB(tableName)]))
})([
  'accounts',
  'transactions',
  'portfolio'
]);


Rx.Observable.fromDBChanges = function dbChanges(db, opts, selector) {
  let changes = db.changes(opts);
  return Rx.Observable.fromEvent(changes, 'change', selector);
};
