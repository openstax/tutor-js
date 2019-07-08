import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import React from 'react';
import { constant, isEqual } from 'underscore';
import { observer } from 'mobx-react';
import Dialog from '../../components/dialog';
import SectionsChooser from '../../components/sections-chooser';
import styled from 'styled-components';
import TourRegion from '../../components/tours/region';
import UX from './ux';

const Wrapper = styled(TourRegion)`
  margin: 4rem auto;
`;

@observer
class SelectSections extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    header: PropTypes.string.isRequired,
    selected: PropTypes.array,
    primary: PropTypes.object,
  };

  componentDidMount() {
    const el = ReactDOM.findDOMNode(this);
    this.props.ux.onSelectSectionsMount(el);
  }

  hasChanged = () => {
    return (
      this.props.selected && !isEqual(this.props.selected, this.state.initialSelected)
    );
  };

  render() {
    const { ux, header, primary } = this.props;

    return (
      <Wrapper
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
          onCancel={ux.onSectExercisesCancel}
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
