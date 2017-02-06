/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 *
 *  A Custom search algorithm to "simulate" an asynchronous search API.
 */

const futureCorpus = fetch('/resources/dictionary.json')
  .then(resp => resp.json());

self.onmessage = function(e) {
  let { query, id, options: { limit, skip, exact } } = e.data;
  const lcQuery = query.toLowerCase();

  let matcher = !exact ?
    (target, query) => target.toLowerCase().indexOf(query) > -1 :
    (target, query) => target.toLowerCase() === query;

  exact && (limit = 1);

  futureCorpus.then(result => {
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

        // If we have a match then add it to the results
        // Or optionally skip it
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