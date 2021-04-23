import PropTypes from 'prop-types';
import React from 'react';
import { uniqueId } from 'lodash';
import classnames from 'classnames';
import ButtonWithTip from '../../components/buttons/button-with-tip';
import Practice from './practice';

export default
class PracticeButton extends React.Component {

    static displayName = 'PracticeButton';

    static propTypes = {
        course:       PropTypes.object.isRequired,
        performance:  PropTypes.object.isRequired,
        section:      PropTypes.object.isRequired,
        practiceType: PropTypes.string,
        title:        PropTypes.string.isRequired,
    };

    id = uniqueId('practice-button-tooltip-');

    getTip = (props) => {
        if (props.isDisabled) {
            return 'No problems are available for practicing';
        }
        return '';
    };

    render() {
        const { section, course } = this.props;

        const classes = classnames('practice', this.props.practiceType);

        return (
            <Practice course={course} page_ids={section.page_ids}>
                <ButtonWithTip
                    id={this.id}
                    variant="light"
                    className={classes}
                    getTip={this.getTip}
                    placement="top"
                >
                    {this.props.title}
                </ButtonWithTip>
            </Practice>
        );
    }
}
