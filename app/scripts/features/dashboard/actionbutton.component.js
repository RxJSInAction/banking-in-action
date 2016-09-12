/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
/**
 * A single task button used for redirecting to one of the sub-pages
 */
const ActionButton = React.createClass({
  render() {
    return (
      React.DOM.div(
        {style: {display: 'inline-block', paddingLeft: '20px', textAlign: 'center'}},
        React.DOM.button(
          {
            className: 'btn btn-default',
            onClick: () => Router.redirectTo(this.props.target)
          },
          React.DOM.img(
            {
              src: this.props.src,
              alt: this.props.title,
              height: '48px',
              width: '48px'
            }
          )
        ),
        React.DOM.div(
          null,
          this.props.title
        )
      )
    );
  }
});


/**
 * Houses the buttons that will be used for common linking tasks
 */
const ActionButtons = React.createClass({
  render() {
    return (
      React.DOM.div(
        {
          className: 'col-md-offset-4 col-md-4',
          src: this.props.src
        },
        this.props.buttons.map(button => React.createElement(ActionButton, button))
      )
    );
  }
});