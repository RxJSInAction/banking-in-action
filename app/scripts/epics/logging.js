/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const loggingEpic = (console = window.console) => (action$) => action$
  .do(
    action => {
      console.log(`Dispatch [${action.type}]`, action)
    },
    err => console.error(err)
  )
  .ignoreElements();