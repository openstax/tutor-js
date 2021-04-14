import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { currentUser } from '../../models';
import { observer } from 'mobx-react';

@observer
export default
class AccountLink extends React.Component {

    static propTypes = {
        onClick: PropTypes.func,
    }

    render() {
        const { profile_url } = currentUser;
        if (!profile_url) { return null; }
        return (
            <Dropdown.Item {...this.props} href={profile_url} target="_blank">
        My Account
            </Dropdown.Item>
        );
    }
}
