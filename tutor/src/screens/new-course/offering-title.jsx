import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';

import Offering from '../../models/course/offerings/offering';
import CourseInformation from '../../models/course/information';

@observer
export default
class CourseOfferingTitle extends React.Component {
    static propTypes = {
        offering: PropTypes.instanceOf(Offering).isRequired,
        className:  PropTypes.string,
        children:   PropTypes.node,
    }

    render() {
        const { offering: { appearance_code }, children, className } = this.props;
        const baseName = 'course-offering-title';
        const { title } = CourseInformation.information(appearance_code);
        return (
            <div
                className={classnames(baseName, className)}
                data-appearance={appearance_code}>
                <div className="contents">
                    <div className="title">
                        {title}
                    </div>
                    <div className="sub-title">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}
