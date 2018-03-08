import React from 'react';
import { Grid, Navbar, Nav, NavItem, } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';

import UX from './ux';
import Search from './components/search';

import { startAPI } from './routes';

// import _ from 'underscore';
// import BS from 'react-bootstrap';
// import classnames from 'classnames';
// import Location from 'stores/location';
//
// import ErrorModal from './error-modal';
// import UserActionsMenu from 'components/user-actions-menu';
// import { SuretyGuard } from 'shared';
// import NetworkActivity from './network-activity-spinner';
// import { VocabularyStore, VocabularyActions } from 'stores/vocabulary';
// import RecordNotFoundWarning from './record-not-found';

export default class App extends React.Component {

  ux = new UX();

  componentWillMount() {
    startAPI();
  }

  render() {
    const { ux } = this;

    return (
      <BrowserRouter>
        <Grid fluid className="exercises">
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#home">OX Exercises</a>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <NavItem href="/exercise/new">
                New exercise
              </NavItem>
              <NavItem>
                <Route path="/search" component={Search.Controls} ux={ux} />
              </NavItem>
            </Nav>
          </Navbar>
          <div className="exercises-body">
            <Route path="/search" render={() => <Search ux={ux} />} />
          </div>
        </Grid>
      </BrowserRouter>

    );
  }
}




// let { view, id, args } = this.props.location.getCurrentUrlParts();
// if (id === 'new') {
//   id = this.state.newId || this.createNewRecord(view);
// }

// const { Body, Controls, store, actions } = this.props.location.partsForView(view);

// const guardProps = {
//   onlyPromptIf(ev) {
//     return (
//       id && (store != null ? store.isChanged(id) : undefined)
//     );
//   },

//   placement: 'right',
//   message: 'You will lose all unsaved changes',
// };

// const componentProps = {
//   id,
//   location: this.props.location,
// };

// const classes = classnames(view, 'openstax', 'editor-app', 'container-fluid');

// <div className={classes}>
// <ErrorModal />
// <nav className="navbar navbar-default">
// <div className="container-fluid controls-container">
// <div className="navbar-header">
// <BS.ButtonToolbar className="navbar-btn">
// {view ?
//   <SuretyGuard onConfirm={this.onSearch} {...guardProps}>
//     <BS.Button className="btn btn-danger back">
//       Search
//     </BS.Button>
//   </SuretyGuard> : undefined}
// <SuretyGuard onConfirm={_.partial(this.onNewRecord, 'exercises')} {...guardProps}>
// <a className="btn btn-success exercises blank">
// New Exercise
// </a>
// </SuretyGuard>
// <SuretyGuard onConfirm={_.partial(this.onNewRecord, 'vocabulary')} {...guardProps}>
// <a className="btn btn-success vocabulary blank">
// New Vocabulary Term
// </a>
// </SuretyGuard>
// </BS.ButtonToolbar>
// </div>
// <div className="navbar-header view-controls">
// <Controls {...componentProps} />
// </div>
// <UserActionsMenu user={this.props.data.user} />
// </div>
// </nav>
// <RecordNotFoundWarning />
// <NetworkActivity
// {...componentProps}
// isLoading={!!(store != null ? store.isLoading(id) : undefined)} />
// <Body {...componentProps} />
// </div>
