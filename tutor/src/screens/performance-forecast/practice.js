import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import Router from '../../helpers/router';
import { withRouter } from 'react-router-dom';
import { STUDENT_PRACTICE_TYPES } from '../../config'


@withRouter
export default class PracticeButton extends React.Component {

    static propTypes = {
        courseId: PropTypes.string.isRequired,
        page_ids: PropTypes.array.isRequired,
        children: PropTypes.element.isRequired,
        history: PropTypes.object.isRequired,
    };

    onClick = () => {
        const { courseId, page_ids } = this.props;
        const route = Router.makePathname('practiceTopics', { courseId }, { query: { page_ids, type: STUDENT_PRACTICE_TYPES.WORST } });
        return this.props.history.push(route);
    };

    isDisabled = () => {
        const { page_ids } = this.props;
        return isEmpty(page_ids);
    };

    render() {
        const isDisabled = this.isDisabled();

        const props = { disabled: isDisabled, onClick: this.onClick };

        return React.cloneElement(this.props.children, props);
    }
}
