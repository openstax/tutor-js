import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { computed, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import { Course, NotesUX } from '../../models';
import TourRegion from '../tours/region';
import TourAnchor from '../tours/anchor';
import MyHighlightsIcon from './my-highlights-icon';
import SecondaryToolbarButton from '../navbar/secondary-toolbar-button';

@observer
export default
class NoteSummaryToggle extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course),
        type: PropTypes.oneOf(['reading', 'refbook']),
        model: PropTypes.shape({
            canAnnotate: PropTypes.bool,
        }),
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get isViewable() {
        const { course, model } = this.props;
        return get(model || course, 'canAnnotate', false);
    }

    render() {
        if (!this.isViewable) { return null; }

        return (
            <TourRegion
                id="student-highlighting-reading"
                courseId={this.props.course.id}
            >
                <TourAnchor id="student-highlighting-button">
                    <SecondaryToolbarButton
                        variant="plain"
                        bsPrefix="summary-toggle"
                        onClick={NotesUX.toggleSummary}
                        data-test-id="my-highlights-btn"
                    >
                        <MyHighlightsIcon className="ox-icon" />
                        <span className="my-highlights-label">My Highlights</span>
                    </SecondaryToolbarButton>
                </TourAnchor>
            </TourRegion>
        );
    }
}
