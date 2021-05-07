import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { currentUser } from '../../models';
import AccountLink from './account-link';
import LogOut from './logout';
import Responsive from '../../components/responsive';

@observer
export default
class UserMenu extends React.Component {

    renderItems() {
        return (
            <>
                <Dropdown.Divider />
                <AccountLink />
                <Dropdown.Divider />
                <LogOut />
            </>
        );
    }

    renderDesktop() {
        return (
            <Dropdown
                className="user-menu"
            >
                <Dropdown.Toggle
                    id="user-menu"
                    data-username={currentUser.username}
                    variant="link"
                    aria-label="Account settings"
                >
                    <span className="initials">{currentUser.initials}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu alignRight>
                    {this.renderItems()}
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    render() {
        return (
            <Responsive
                desktop={this.renderDesktop()}
                mobile={this.renderItems()}
            />
        );
    }

}
