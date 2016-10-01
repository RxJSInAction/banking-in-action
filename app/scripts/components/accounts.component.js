/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
(function() {

  const BalanceComponent = window.BalanceComponent = (props) => {
    const {div, h1, h3} = React.DOM;
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
      const {Panel, FormGroup, InputGroup, FormControl, Col, ControlLabel, Button, ButtonToolbar, Radio, RadioGroup} = ReactBootstrap;
      return (
        React.createElement(Panel, null,
          React.createElement(FormGroup, {bsSize: 'small'},
            React.createElement(Col, {xs: 6},
              React.createElement(Col, {xs: 3},
                React.createElement(InputGroup, null,
                  React.createElement(InputGroup.Addon, null, '$'),
                  React.createElement(FormControl, {type: 'number', onChange: (e) => balanceActions.amount(e.target.value)})
                )
              ),
              React.createElement(Col, {xs: 6},
                React.createElement(ButtonToolbar, null,
                  React.createElement(Button, {bsStyle: 'primary', onClick: () => balanceActions.withdraw()}, 'Withdraw'),
                  React.createElement(Button, {bsStyle: 'primary', onClick: () => balanceActions.deposit()}, 'Deposit'),
                  React.createElement(FormGroup, {},
                    React.createElement(Radio, {name: 'account', inline: true, onChange: () => balanceActions.account('checking')}, 'Checking'),
                    React.createElement(Radio, {name: 'account', inline: true, onChange: () => balanceActions.account('savings')}, 'Savings')
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
      this.props.store
        .distinctUntilKeyChanged('accounts')
        .pluck('accounts')
        .subscribe(({checking, savings}) =>
          this.setState({checking, savings})
        );
    },
    render() {
      const { Panel } = ReactBootstrap;
      return (
        React.createElement(Panel, null,
          React.createElement(BalanceComponent, {balance: this.state.checking, name: 'Checking'}),
          React.createElement(BalanceComponent, {balance: this.state.savings, name: 'Savings'})
        )
      )
    }
  });



})();