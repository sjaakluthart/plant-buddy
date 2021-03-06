import React from 'react';
import $ from 'jquery';

import text from './text.json';

import { Paper } from 'material-ui';
import { browserHistory, Link } from 'react-router';

class Home extends React.Component {
  componentWillMount() {
    $.ajax({ url: '/checkUser' })
    .then((data) => {
      if (data.authorised) {
        browserHistory.push('/plants');
      }
    });
  }

  render() {
    return (
      <section className="home">
        <h1>{text.appTitle}</h1>
        <h2>
          {text.homeTitle}
        </h2>
        <h3>
          {text.homeSubtitle}
        </h3>
        <Paper style={{ borderRadius: '10px' }} className="app-icon" zDepth={2}>
          <img src="/assets/app-icon.svg" alt="app-icon" />
        </Paper>
        <Link className="button-start" to={'/register'}>
          aan de slag
        </Link>
        <Link className="login" to={'/login'}>
          ik heb al een account
        </Link>
      </section>
    );
  }
}

export default Home;
