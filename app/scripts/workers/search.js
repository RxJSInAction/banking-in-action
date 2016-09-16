/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const futureNYSE = fetch('/resources/dictionary.json')
  .then(resp => resp.json());

self.onmessage = function(e) {
  let { query, id, options: { limit, skip, exactMatch } } = e.data;
  const lcQuery = query.toLowerCase();

  let matcher = !exactMatch ?
    (target, query) => target.toLowerCase().indexOf(query) > -1 :
    (target, query) => target.toLowerCase() === query;

  exactMatch && (limit = 1);

  futureNYSE.then(result => {
      //Pre-allocate the match result
      let matches = new Array(limit || 10);

      for (let i = 0, j = 0, k = 0, ii = result.length;
           i < ii;
           i++
      ) {
        let curr = result[i];

        //If the limit has been reached stop the search
        if (limit && j >= limit)
          break;

        //Check the current sample against possible matches
        let isMatch = matcher(curr.code, lcQuery);

        if (isMatch) {
          if (++k < skip) {
            continue;
          }
          matches[j++] = curr;
        }
      }
      self.postMessage({id, query, matches});
    });

};