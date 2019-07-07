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
import UX from './ux';

const Wrapper = styled(TourRegion)`
  margin: 4rem auto;
`;

@observer
class SelectSections extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    // course: PropTypes.instanceOf(CourseModel).isRequired,
    // planId: PropTypes.string.isRequired,
    // onSectionChange: PropTypes.func.isRequired,
    // hide: PropTypes.func.isRequired,
    // selected: PropTypes.array,
    header: PropTypes.string.isRequired,
    // cancel: PropTypes.func.isRequired,
    primary: PropTypes.object,
    // type: PropTypes.string.isRequired,
    // windowImpl:  PropTypes.object,
  };

  wrapper = React.createRef();

  // state = { initialSelected: this.props.selected };
  // scroller = new ScrollTo({ windowImpl: this.props.windowImpl });

  componentDidMount() {
    this.props.ux.onSelectSectionsMount(this.wrapper.current);

  }

  hasChanged = () => {
    return (
      this.props.selected && !isEqual(this.props.selected, this.state.initialSelected)
    );
  };

  // onSectionChange = (sectionIds) => {
  //   TaskPlanActions.updateTopics(this.props.planId, sectionIds);
  //   return (
  //     (typeof this.props.onSectionChange === 'function' ? this.props.onSectionChange(sectionIds) : undefined)
  //   );
  // };
  //
  render() {
    const { ux, header, primary } = this.props;

    return (
      <Wrapper
        ref={this.wrapper}
        className={`${ux.plan.type}-plan-select-sections`}
        id={`add-${ux.plan.type}-choose-sections`}
        courseId={ux.course.id}
      >
        <Dialog
          className="select-sections"
          header={header}
          primary={primary}
          confirmMsg="You will lose unsaved changes if you continue."
          cancel="Cancel"
          isChanged={constant(this.hasChanged())}
          onCancel={ux.onSelectSectionsCancel}
        >
          <div key="select-chapters" className="select-chapters">
            <SectionsChooser
              course={ux.course}
              book={ux.referenceBook}
              selectedPageIds={ux.selectedPageIds}
              onSelectionChange={ux.onSectionIdsChange}
            />
          </div>
        </Dialog>
      </Wrapper>
    );
  }

}


export default SelectSections;
