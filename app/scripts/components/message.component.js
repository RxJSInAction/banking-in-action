/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
(function(global) {

  const Message = (props) => {
    const {Alert} = ReactBootstrap;
    const {severity, text, opacity} = props.message;
    return (
      React.createElement(Alert, {bsStyle: severity, style: {opacity}}, text)
    );
  };

  const MessageList = window.MessageList = React.createClass({
    getInitialState() {
      return {messages: []};
    },
    componentDidMount() {
      this.props.appState$
        .distinctUntilKeyChanged('messages')
        .pluck('messages')
        .subscribe(messages => {
          this.setState({messages});
        })
    },
    render(){
      return (
        React.DOM.div(null,
          this.state.messages.map((message, key) =>
            React.createElement(Message, {message, key})
          ))
      );
    }
  });

  window.MessageComponent = (props) => {
    return (
      React.createElement(MessageList, props)
    );
  };


})();