/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
function messageEpic(actions$) {
  return actions$
    .ofType(DISPLAY_MESSAGE)
    .flatMap(
      ({message}, id) => {
        const {duration, text, severity} = message;
        const steps = duration / 100;
        return Rx.Observable.timer(0, 100)
          .takeWhile(x => x < steps)
          .map(i => (steps - i) / steps)
          .map(opacity => updateMessage(id, text, severity, opacity))
          .concat(Rx.Observable.of(deleteMessage(id)));
      }
    );
}