import { React, PropTypes, observer, computed } from 'vendor';
import { isEmpty } from 'lodash';
import { AsyncButton } from 'shared';
import AddExercises from './add-exercises';
import Loading from 'shared/components/loading-animation';
import SelectSections from '../select-sections';
import UX from '../ux';

@observer
class ChooseExercises extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  };

  @computed get isFetchingExercises() {
    const { ux } = this.props;
    return ux.exercises.isFetching({ pageIds: ux.selectedPageIds });
  }

  renderExercises() {
    const { ux, ux: { exercises } } = this.props;
    if (!ux.isShowingExercises) { return null; }
    if (this.isFetchingExercises) {
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
            <AsyncButton
              id="add-sections-to-homework"
              variant="primary"
              waitingText="Loading…"
              isWaiting={this.isFetchingExercises}
              disabled={isEmpty(ux.selectedPageIds)}
              onClick={ux.onExercisesShow}
              key="show-problems" // need key because button is passed in and rendered in array
            >
              Show Problems
            </AsyncButton>
          }
          header="Add Questions"
        />
        {this.renderExercises()}
      </div>
    );
  }
}

export default ChooseExercises;
