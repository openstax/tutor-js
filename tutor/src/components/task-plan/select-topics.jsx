import React from 'react';
import { constant, isEqual } from 'underscore';
import { observer } from 'mobx-react';
import Dialog from '../dialog';
import { TocStore, TocActions } from '../../flux/toc';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import SectionsChooser from '../sections-chooser';

import CourseModel from '../../models/course';

import TourRegion from '../tours/region';

@observer
class SelectTopics extends React.Component {

  static propTypes = {
    course: React.PropTypes.instanceOf(CourseModel).isRequired,
    planId: React.PropTypes.string.isRequired,
    onSectionChange: React.PropTypes.func.isRequired,
    hide: React.PropTypes.func.isRequired,
    selected: React.PropTypes.array,
    header: React.PropTypes.string.isRequired,
    cancel: React.PropTypes.func.isRequired,
  };

  state = { initialSelected: this.props.selected };

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
    const { course, planId, selected, hide, header, primary, cancel, ecosystemId, type } = this.props;

    return (
      <TourRegion
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
          <div className="select-chapters" data-ecosystem-id={ecosystemId}>
            <SectionsChooser
              book={course.referenceBook}
              selectedPageIds={selected}
              onSelectionChange={this.onSectionChange}
            />
          </div>
        </Dialog>
      </TourRegion>
    );
  }

}


export default SelectTopics;
