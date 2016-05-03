// Modules
import React from 'react';
import { browserHistory, Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';

import text from './text.json';

// Material-UI
import {
  AppBar,
  Avatar,
  CircularProgress,
  Drawer,
  FloatingActionButton,
  List,
  ListItem,
  MenuItem
} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

class PlantList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: [],
      loading: true,
      userId: '',
      username: ''
    };
    this.toggleMenu = this.toggleMenu.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  componentWillMount() {
    $.ajax({ url: '/check-user' })
    .then((data) => {
      if (data.authorised) {
        if (!data.user.onBoard) {
          browserHistory.push('/on-boarding');
          return false;
        }
        this.setState({
          userId: data.user._id,
          username: data.user.username
        });
      } else {
        browserHistory.push('/login');
      }
    });
  }

  componentDidMount() {
    $.ajax({ url: '/plant-list' })
    .then((data) => {
      this.setState({ plants: data, loading: false });
    });
  }

  showLoading() {
    return <CircularProgress className="loader" style={ { position: 'absolute' } } />;
  }

  showContent() {
    const listStyle = {
      textTransform: 'capitalize'
    };
    const buttonStyle = {
      position: 'absolute',
      right: '5%'
    };

    if (this.state.plants.length === 0) {
      return <p>Je hebt nog geen plantjes, voeg er eentje toe.</p>;
    }

    return (
      <div>
        <List>
          {this.state.plants.map(plant => (
            <Link to={`/plant/${plant._id}`} key={plant._id}>
              <ListItem
                primaryText={`${plant.name} ${plant.species}`}
                secondaryText={`Geplant op: ${moment(plant.plantedOn).format('DD-MM-YY')}`}
                leftAvatar={<Avatar src={`assets/${plant.species}.svg`} />}
                style={listStyle}
              />
            </Link>
          ))}
        </List>
        <Link to="/add-plant">
          <FloatingActionButton mini style={buttonStyle}>
            <ContentAdd />
          </FloatingActionButton>
        </Link>
      </div>
    );
  }

  toggleMenu() {
    this.setState({
      open: !this.state.open
    });
  }

  logOut() {
    $.ajax({
      method: 'POST',
      url: '/log-out',
      data: { username: this.state.username }
    })
    .then((res) => {
      if (res.error) {
        alert(res.error);
        return false;
      }

      browserHistory.push('/');
      return res;
    });
  }

  render() {
    return (
      <section className="plant-list">
        <AppBar
          title={this.state.username ? `${this.state.username}'s Plantjes` : text.appTitle}
          onLeftIconButtonTouchTap={this.toggleMenu}
        />
        <Drawer
          docked={false}
          width={200}
          open={this.state.open}
          onRequestChange={(open) => this.setState({ open })}
        >
          <MenuItem onTouchTap={this.toggleMenu}>Instellingen</MenuItem>
          <MenuItem onTouchTap={this.toggleMenu}>Over de app</MenuItem>
          <MenuItem onTouchTap={this.toggleMenu}>Stuur feedback</MenuItem>
          <MenuItem
            style={{ position: 'absolute', bottom: 0, width: '100%' }}
            onTouchTap={this.logOut}
          >Log Uit</MenuItem>
        </Drawer>
        {this.state.loading ? this.showLoading() : this.showContent()}
      </section>
    );
  }
}

export default PlantList;