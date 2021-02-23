import {
  React, PropTypes, observer, ArrayOrMobxType, styled, computed,
} from 'vendor';
import { map, isEmpty } from 'lodash';
import ExercisePreview from './preview';
import BookPartTitle from '../book-part-title';
import ScrollTo from '../../helpers/scroll-to';
import { ExercisesMap, exerciseSort } from '../../models/exercises';
import Exercise from '../../models/exercises/exercise';
import Course from '../../models/course';
import NoExercisesFound from './no-exercises-found';
import User from '../../models/user';

const SectionLabel = styled.label`
  font-size: 2.8rem;
  font-weight: bold;
  line-height: 3.5rem;
`;

@observer
class SectionsExercises extends React.Component {
  static propTypes = {
    pageId:                     PropTypes.string.isRequired,
    course:                     PropTypes.instanceOf(Course).isRequired,
    exercises:                  PropTypes.instanceOf(ExercisesMap).isRequired,
    getExerciseIsSelected:      PropTypes.func.isRequired,
    getExerciseActions:         PropTypes.func.isRequired,
    getExerciseDisableMessage:  PropTypes.func,
    onShowDetailsViewClick:     PropTypes.func,
    onExerciseToggle:           PropTypes.func,
  };

  @computed get exercises() {
    return exerciseSort(
      this.props.exercises.byPageId[this.props.pageId],
      this.props.course,
      User,
    );
  }

  render() {
    const { pageId, course, ...previewProps } = this.props;
    const sectionExercises = this.exercises;
    const page = course.referenceBook.pages.byId.get(pageId);

    if (isEmpty(sectionExercises)) { return null; }

    // IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
    return (
      <div className="exercise-sections" data-section={page ? page.chapter_section.asString : ''}>
        {
          page && 
          <SectionLabel>
            <BookPartTitle part={page} displayChapterSection />
          </SectionLabel>
        }
        <div className="exercises">
          {map(sectionExercises, (exercise) =>
            <ExercisePreview key={exercise.id} {...previewProps} exercise={exercise} />)}
        </div>
      </div>
    );
  }

}


@observer
export default
class ExerciseCards extends React.Component {

  static propTypes = {
    pageIds:                    ArrayOrMobxType.isRequired,
    course:                     PropTypes.instanceOf(Course).isRequired,
    exercises:                  PropTypes.instanceOf(ExercisesMap).isRequired,
    getExerciseIsSelected:      PropTypes.func.isRequired,
    getExerciseActions:         PropTypes.func.isRequired,
    getExerciseDisableMessage:  PropTypes.func,
    onExerciseToggle:           PropTypes.func,
    onShowDetailsViewClick:     PropTypes.func,
    focusedExercise:            PropTypes.instanceOf(Exercise),
    topScrollOffset:            PropTypes.number,
    windowImpl:                 PropTypes.object,
    exerciseType:               PropTypes.string,
    sectionHasExercises:        PropTypes.bool,
    onSelectSections:           PropTypes.func,
  };

  static defaultProps = {
    topScrollOffset: 110,
  };

  scroller = new ScrollTo({
    windowImpl: this.props.windowImpl,
    onAfterScroll: this.onAfterScroll,
  });

  componentDidMount() {
    if (this.props.focusedExercise) {
      this.scroller.scrollToSelector(`[data-exercise-id="${this.props.focusedExercise.content.uid}"]`, { immediate: true });
    } else {
      this.scroller.scrollToSelector('.exercise-sections', { scrollTopOffset: this.props.topScrollOffset });
    }
  }

  onAfterScroll = (el) => {
    if (this.props.focusedExercise) { el.focus(); }
  }

  render() {
    const { pageIds, exercises, ...sectionProps } = this.props;

    if (exercises.noneForPageIds(pageIds)) {
      return <NoExercisesFound
        isHomework={this.props.exerciseType === 'homework'}
        sectionHasExercises={this.props.sectionHasExercises}
        onSelectSections={this.props.onSelectSections} />;
    }

    let sections = map(pageIds, pageId => (
      <SectionsExercises
        key={pageId}
        exercises={exercises}
        pageId={pageId}
        {...sectionProps}
      />
    ));

    return (
      <div className="exercise-cards">{sections}</div>
    );
  }
}
