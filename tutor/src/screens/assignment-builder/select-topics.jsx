import PropTypes from 'prop-types';
import React from 'react';
import ScrollTo from '../../helpers/scroll-to';
import { constant, isEqual } from 'underscore';
import { observer } from 'mobx-react';
import Dialog from '../../components/dialog';
import { TaskPlanActions } from '../../flux/task-plan';
import SectionsChooser from '../../components/sections-chooser';
import styled from 'styled-components';
import CourseModel from '../../models/course';
import TourRegion from '../../components/tours/region';

const Wrapper = styled(TourRegion)`
  margin: 4rem auto;
`;

@observer
class SelectTopics extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(CourseModel).isRequired,
    planId: PropTypes.string.isRequired,
    onSectionChange: PropTypes.func.isRequired,
    hide: PropTypes.func.isRequired,
    selected: PropTypes.array,
    header: PropTypes.string.isRequired,
    cancel: PropTypes.func.isRequired,
    primary: PropTypes.object,
    type: PropTypes.string.isRequired,
    windowImpl:  PropTypes.object,
  };

  state = { initialSelected: this.props.selected };
  scroller = new ScrollTo({ windowImpl: this.props.windowImpl });

  componentDidMount() {
    this.scroller.scrollToSelector('.select-topics');
  }

  hasChanged = () => {
    return (
      this.props.selected && !isEqual(this.props.selected, this.state.initialSelected)
    );
  };

  onSectionChange = (sectionIds) => {
    TaskPlanActions.updateTopics(this.props.planId, sectionIds);
    return (
      (typeof this.props.onSectionChange === 'function' ? this.props.onSectionChange(sectionIds) : undefined)
    );
  };

  render() {
    const { course, selected, header, primary, cancel, type } = this.props;

    return (
      <Wrapper
        className={`${type}-plan-select-topics`}
        id={`add-${type}-choose-sections`}
        courseId={course.id}
      >
        <Dialog
          className="select-topics"
          header={header}
          primary={primary}
          confirmMsg="You will lose unsaved changes if you continue."
          cancel="Cancel"
          isChanged={constant(this.hasChanged())}
          onCancel={cancel}
        >
          <div key="select-chapters" className="select-chapters">
            <SectionsChooser
              course={course}
              book={course.referenceBook}
              selectedPageIds={selected}
              onSelectionChange={this.onSectionChange}
            />
          </div>
        </Dialog>
      </Wrapper>
    );
  }

}


export default SelectTopics;
