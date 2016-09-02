/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

/**
 * Generic Search API
 */
class SearchApi {

  constructor(opts) {
    let {baseUrl, delay} = opts;

    //Default to the server address as the base url
    this.baseUrl = baseUrl || 'http://localhost:9000';

    //A reasonable delay for the search to wait
    this.delay = delay || 500;
  }

  search(source) {
    return source.let((s) => SearchApi.withSearch(s, this.baseUrl, this.delay));
  }

  static withSearch(source, baseUrl, delay) {
    return (
      source
        .debounceTime(delay)
        .flatMap(q => SearchApi.executeQuery(baseUrl, q))
    );
  }

  static executeQuery(baseUrl, q) {
    return `${baseUrl}?q=${q}`;
  }

}
