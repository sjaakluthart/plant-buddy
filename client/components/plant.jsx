import React from 'react';
import $ from 'jquery';

import { browserHistory, Link } from 'react-router';

import { AppBar, CircularProgress, IconButton, Paper } from 'material-ui';
import NavigationArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

import Messages from './messages.jsx';
import PlantPicture from './plant-picture.jsx';
import GrowthBar from './growth-bar.jsx';
import Levels from './levels.jsx';

class Plant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true
    };
  }

  componentWillMount() {
    $.ajax({ url: '/checkUser' })
    .then((data) => {
      if (data.authorised) {
        this.setState({
          userId: data.user._id,
          username: data.user.username
        });
        this.getData();
      } else {
        browserHistory.push('/login');
      }
    });
  }

  getData() {
    $.ajax({
      url: '/plantData',
      data: { plantId: this.props.params.plantId }
    })
    .then((data) => {
      this.setState({ data, loading: false });
    });
  }

  showLoading() {
    return <CircularProgress className="loader" style={{ position: 'absolute' }} />;
  }

  showMessage() {
    const sensorReadings = this.state.data.sensorReadings;
    if (
      sensorReadings.moisture === null
      || sensorReadings.temperature === null
      || sensorReadings.light === null
    ) {
      return null;
    }

    return (
      <Messages
        referenceValues={this.state.data.referenceValues}
        sensorReadings={this.state.data.sensorReadings}
        name={this.state.data.name}
      />
    );
  }

  showLevels(style) {
    const sensorReadings = this.state.data.sensorReadings;

    if (
      sensorReadings.moisture === null
      || sensorReadings.temperature === null
      || sensorReadings.light === null
    ) {
      return (
        <Paper style={style}>
          <p>We hebben nog geen meting gedaan, kom later terug.</p>
        </Paper>
      );
    }

    return (
      <Paper>
        <Levels
          sensorData={this.state.data.sensorReadings}
          referenceValues={this.state.data.referenceValues}
          plantPage
        />
      </Paper>
    );
  }

  showContent() {
    const style = {
      padding: '20px',
      marginBottom: '15px'
    };

    const plantIcon = `/assets/${this.state.data.species}.svg`;
    return (
      <div className="plant">
        {this.showMessage(style)}
        {this.showLevels(style)}
        <PlantPicture
          plantId={this.state.data._id}
          plantPicture={this.state.data.plantPicture}
        />
        <GrowthBar
          plantedOn={this.state.data.plantedOn}
          harvestOn={this.state.data.harvestOn}
          plantIcon={plantIcon}
        />
      </div>
    );
  }

  render() {
    return (
      <section>
        <AppBar
          title={
            this.state.loading
            ? 'Plant wordt geladen...'
            : `${this.state.data.name} ${this.state.data.species}`
          }
          style={{
            textTransform: 'capitalize'
          }}
          iconElementLeft={
            <Link to={'/plants'}>
              <IconButton><NavigationArrowBack color="#FAFAFA" /></IconButton>
            </Link>
          }
        />
        {this.state.loading ? this.showLoading() : this.showContent()}
      </section>
    );
  }
}

Plant.propTypes = {
  params: React.PropTypes.object.isRequired
};

export default Plant;
