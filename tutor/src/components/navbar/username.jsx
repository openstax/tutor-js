import React from 'react';
import { currentUser } from '../../models';
import { observer } from 'mobx-react';

@observer
export default
class UserName extends React.Component {

    render() {
        return (
            <span {...this.props}>
                {currentUser.name}
            </span>
        );
    }
}
