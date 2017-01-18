/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
/**
 * SEARCH
 */
function searchEpic(action$) {
  return action$
    .ofType(INVOKE_SEARCH)
    .debounceTime(500)
    .switchMap(
      ({query}) => search(query, {limit: 20})
    ).map(updateSearchResults);
}