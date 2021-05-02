import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import PropTypes from 'prop-types';
import { modelize, action } from 'shared/model';
import UX from './ux';
import Search from './components/search';
import ExerciseMap from './models/exercises';
import Exercise from './components/exercise';
import Preview from './components/preview';
import Toasts from 'shared/components/toasts';
import UserActionsMenu from './components/user-actions-menu';

export default class App extends React.Component {

    ux = new UX();

    constructor(props) {
        super(props)
        modelize(this)
    }

    static propTypes = {
        data: PropTypes.object,
    }

    @action.bound onNav(ev) {
        ev.preventDefault();
        this.router.history.push(ev.currentTarget.pathname);
    }

    @action.bound onNew(ev) {
        ev.preventDefault();
        ExerciseMap.createNewRecord();
        this.router.history.push(ev.currentTarget.pathname);
    }

    render() {
        const { ux, props: { data: { user } } } = this;

        return (
            <Provider ux={ux}>
                <BrowserRouter ref={br => this.router = br}>
                    <div>
                        <Navbar bg="light" expand="lg" className="justify-content-between">
                            <Navbar.Brand onClick={this.onNav} href="/">OX Exercises</Navbar.Brand>

                            <Nav className="exercise-navbar-controls" >
                                <Nav.Link onClick={this.onNav} href="/search">
                                    Search
                                </Nav.Link>
                                <Nav.Link onClick={this.onNew} href="/exercise/new">
                                    New
                                </Nav.Link>
                                <Route path="/search" component={Search.Controls} />
                                <Route path="/exercise/:uid" component={Exercise.Controls} />
                                <Route path="/preview/:uid" component={Preview.Controls} />
                                <UserActionsMenu user={user} />
                            </Nav>
                        </Navbar>
                        <Container fluid className="openstax exercises">
                            <Toasts />
                            <div className="exercises-body">
                                <Route path="/search" component={Search} />
                                <Route path="/exercise/:uid" component={Exercise} />
                                <Route path="/preview/:uid" component={Preview} />
                            </div>
                        </Container>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }

}
