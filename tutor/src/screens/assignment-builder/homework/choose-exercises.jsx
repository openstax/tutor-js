import { React, PropTypes, observer } from 'vendor';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import AddExercises from './add-exercises';
import Loading from 'shared/components/loading-animation';
import SelectSections from '../select-sections';
import UX from '../ux';

@observer
class ChooseExercises extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  renderExercises() {
    const { ux, ux: { exercises } } = this.props;
    if (!ux.isShowingExercises) { return null; }
    if (exercises.isFetching({ pageIds: ux.selectedPageIds })) {
      return <Loading />;
    }

    return (
      <AddExercises
        canAdd
        canEdit
        ux={ux}
        exercises={exercises}
      />
    );
  }

  render() {
    const { ux } = this.props;

    return (
      <div className="homework-plan-exercise-select-sections">
        <SelectSections
          ux={ux}
          primary={
            <Button
              id="add-sections-to-homework"
              variant="primary"
              disabled={isEmpty(ux.selectedPageIds)}
              onClick={ux.onExercisesShow}
              key="show-problems" // need key because button is passed in and rendered in array
            >
              Show Problems
            </Button>
          }
          header="Add Questions"
        />
        {this.renderExercises()}
      </div>
    );
  }
}

export default ChooseExercises;
