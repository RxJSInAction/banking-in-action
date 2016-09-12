/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const futureNYSE = fetch('/resources/dictionary.json')
  .then(resp => resp.json());

self.onmessage = function(e) {
  let { query, id, options: {limit, skip} } = e.data;
  const lcQuery = query.toLowerCase();

  futureNYSE.then(result => {
      let matches = new Array(limit || 10);
      for (let i = 0, j = 0, k = 0, ii = result.length;
           i < ii;
           i++
      ) {
        if (limit && j >= limit)
          break;

        let isMatch = result[i].code.toLowerCase().indexOf(lcQuery) > -1;
        if (isMatch) {
          if (++k < skip) {
            continue;
          }
          matches[j++] = result[i];
        }
      }
      self.postMessage({id, query, matches});
    });

};