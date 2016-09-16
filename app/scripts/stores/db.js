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

