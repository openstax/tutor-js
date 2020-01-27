import { React, PropTypes, observer, computed } from 'vendor';
import { isEmpty } from 'lodash';
import { AsyncButton } from 'shared';
import AddExercises from './add-exercises';
import Loading from 'shared/components/loading-animation';
import SelectSections from '../select-sections';

@observer
class ChooseExercises extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
  };

  @computed get isFetchingExercises() {
    const { ux } = this.props;
    return ux.exercises.isFetching({ pageIds: ux.selectedPageIds });
  }

  render() {
    const { ux, ux: { exercises } } = this.props;

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
}

export default ChooseExercises;
