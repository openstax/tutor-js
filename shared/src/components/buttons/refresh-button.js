import PropTypes from 'prop-types';
import React from 'react';

// eslint-disable-next-line
export default class RefreshButton extends React.Component {
    static defaultProps = {
        beforeText: 'There was a problem loading. ',
        buttonText: 'Refresh',
        afterText: ' to try again.',
    };

    static displayName = 'RefreshButton';

    static propTypes = {
        beforeText: PropTypes.string,
        buttonText: PropTypes.string,
        afterText: PropTypes.string,
    };

    render() {
        const { beforeText, buttonText, afterText } = this.props;

        // Wrap text in quotes so whitespace is preserved
        // and button is not right next to text.
        return (
            <span className="refresh-button">
                {beforeText}
                <a className="btn btn-primary" href={window.location.href}>
                    {buttonText}
                </a>
                {afterText}
            </span>
        );
    }
}
