import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { computed, modelize } from 'shared/model'
import { currentCourses, CourseUX } from '../models';

@observer
export default
class CourseTitleBanner extends React.Component {
    static propTypes = {
        courseId: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get course () {
        return currentCourses.get(this.props.courseId);
    }

    @computed get ux () {
        return new CourseUX(this.course);
    }

    render() {
        return (
            <div
                className="course-title-banner"
                {...this.ux.dataProps}
            >
                <div className='book-title'>
                    <h1 className='book-title-text'>{this.ux.dataProps['data-title']}</h1>
                </div>
                <div className='course-term'>
                    {this.course.termFull}
                </div>
            </div>
        );
    }
}
