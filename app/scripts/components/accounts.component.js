/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
(function () {

  const BalanceComponent = window.BalanceComponent = (props) => {
    const {h1, h3} = React.DOM;
    const {Col} = ReactBootstrap;

    return (
      React.createElement(
        Col, {xs: 6},
        h3(null, `${props.name}:`),
        h1(null, `$${props.balance.toFixed(2)}`)
      )
    );
  };

  window.AccountWithdrawComponent = React.createClass({
    componentDidMount() {
    },
    render() {
      const {dispatch} = this.props;
      const {amount, withdraw, deposit, account} = balanceActions;
      const {createElement} = React;
      const {Panel, FormGroup, InputGroup, FormControl, Col, Button, ButtonToolbar, Radio} = ReactBootstrap;
      return (
        createElement(Panel, null,
          createElement(FormGroup, {bsSize: 'small'},
            createElement(Col, {xs: 6},
              createElement(Col, {xs: 3},
                createElement(InputGroup, null,
                  createElement(InputGroup.Addon, null, '$'),
                  createElement(FormControl, {
                    type: 'number',
                    onChange: (e) => dispatch({type: 'AMOUNT_CHANGED', value: e.target.value})
                  })
                )
              ),
              createElement(Col, {xs: 6},
                createElement(ButtonToolbar, null,
                  createElement(Button, {
                    bsStyle: 'primary',
                    onClick: () => dispatch(withdraw())
                  }, 'Withdraw'),
                  createElement(Button, {bsStyle: 'primary',
                    onClick: () => dispatch(deposit())
                  }, 'Deposit'),
                  createElement(FormGroup, {},
                    createElement(Radio, {
                      name: 'account',
                      inline: true,
                      onChange: () => dispatch({type: 'ACCOUNT_CHANGED', value: 'checking'})
                    }, 'Checking'),
                    createElement(Radio, {
                      name: 'account',
                      inline: true,
                      onChange: () => dispatch({type: 'ACCOUNT_CHANGED', value: 'savings'})
                    }, 'Savings')
                  )
                )
              )
            )
          )
        )
      );
    }

  });

  window.AccountBalanceComponent = React.createClass({
    getInitialState() {
      return {checking: 0, savings: 0};
    },
    componentDidMount() {
      this.props.appState$
        .distinctUntilKeyChanged('accounts')
        .pluck('accounts')
        .subscribe(({checking, savings}) =>
          this.setState({checking, savings})
        );
    },
    render() {
      const {Panel} = ReactBootstrap;
      return (
        React.createElement(Panel, null,
          React.createElement(BalanceComponent, {balance: this.state.checking, name: 'Checking'}),
          React.createElement(BalanceComponent, {balance: this.state.savings, name: 'Savings'})
        )
      )
    }
  });


})();