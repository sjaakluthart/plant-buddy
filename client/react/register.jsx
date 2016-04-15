import React from 'react';

import text from './text.json';

import { browserHistory, Link } from 'react-router';
import { AppBar, IconButton, RaisedButton, TextField } from 'material-ui';
import NavigationArrowBack from 'material-ui/lib/svg-icons/navigation/arrow-back';

class Register extends React.Component {

  handleSubmit(event) {
    event.preventDefault();
    browserHistory.push('/on-boarding');
  }

  renderTelInputs() {
    const inputs = [];
    for (let i = 0; i < this.state.persons; i++) {
      inputs.push(
        <TextField
          key={i}
          hintText={`Telefoon ${i + 1}`}
          floatingLabelText={`Telefoon ${i + 1}`}
          type="tel"
          fullWidth
        />
      );
    }

    return inputs;
  }

  render() {
    return (
      <section className="register">
        <AppBar
          title={text.registerTitle}
          iconElementLeft={
            <Link to={'/'}>
              <IconButton><NavigationArrowBack color="#FAFAFA" /></IconButton>
            </Link>
          }
        />
        <form onSubmit={this.handleSubmit}>
          <h1>{text.registerSubtitle}</h1>
          <h2>{text.registerSubtitle1}</h2>
          <TextField
            hintText="Naam"
            floatingLabelText="Naam"
            fullWidth
          />
          <TextField
            hintText="E-mail"
            floatingLabelText="E-mail"
            type="email"
            fullWidth
          />
          <TextField
            hintText="Wachtwoord"
            floatingLabelText="Wachtwoord"
            type="password"
            fullWidth
          />
          <TextField
            hintText="Bevestig wachtwoord"
            floatingLabelText="Bevestig wachtwoord"
            type="password"
            fullWidth
          />
          <p>
            {text.registerSecurityNotice}
          </p>
          <RaisedButton
            className="button-submit"
            label="registreer"
            primary
            type="submit"
          />
        </form>
      </section>
    );
  }

}

export default Register;