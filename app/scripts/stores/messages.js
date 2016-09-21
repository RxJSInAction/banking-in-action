/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */

const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';
const DEGRADE_MESSAGES = 'DEGRADE_MESSAGES';

function displayMessage(text, severity = 'info', duration = 1.0) {
  return {type: DISPLAY_MESSAGE, message: {text, severity, duration}};
}

function degradeMessages(factor = 0.05) {
  return {type: DEGRADE_MESSAGES, factor};
}

function messages(state = [], action) {
  switch (action.type) {
    case DISPLAY_MESSAGE:
      return [...state, action.message];
    case DEGRADE_MESSAGES:
      const factorLens = R.lensProp('duration');
      return state
        .map(message => R.over(factorLens, R.add(-action.factor), message))
        .filter(message => message.duration > 0);
    default:
      return state;
  }
}