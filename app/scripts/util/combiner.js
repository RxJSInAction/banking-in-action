/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function combiner(reducers) {
  return function (state = {}, action) {
    let result = {};
    for (let key in reducers) {
      let transform = reducers[key];
      result[key] = transform(state[key], action);
    }

    return result;
  }
}