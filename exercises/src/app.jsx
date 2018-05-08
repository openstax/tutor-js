import React from 'react';
import { Grid, Navbar, Nav, NavItem, } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider, observer } from 'mobx-react';

import UX from './ux';
import Search from './components/search';
import Exercise from './components/exercise';
import Preview from './components/preview';
import UserActionsMenu from './components/user-actions-menu';

export default class App extends React.Component {

  ux = new UX();

  render() {
    const { ux, props: { data: { user } } } = this;

    return (
      <Provider ux={ux}>
        <BrowserRouter>
          <Grid fluid className="exercises">
            <Navbar fixedTop>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="#home">OX Exercises</a>
                </Navbar.Brand>
              </Navbar.Header>
              <Nav className="exercise-navbar-controls" >
                <NavItem href="/search">
                  Search
                </NavItem>
                <NavItem href="/exercise/new">
                  New
                </NavItem>
                <Route path="/search" component={Search.Controls} />
                <Route path="/exercise/:uid" component={Exercise.Controls} />
                <Route path="/preview/:uid" component={Preview.Controls} />
              </Nav>
              <UserActionsMenu user={user} />
            </Navbar>
            <div className="exercises-body">
              <Route path="/search" component={Search} />
              <Route path="/exercise/:uid" component={Exercise} />
              <Route path="/preview/:uid" component={Preview} />
            </div>
          </Grid>
        </BrowserRouter>
      </Provider>
    );
  }

}
