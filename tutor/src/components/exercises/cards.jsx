import {
  React, PropTypes, observer, ArrayOrMobxType,
} from 'vendor';
import { map, isEmpty } from 'lodash';
import ChapterSection from '../chapter-section';
import ExercisePreview from './preview';
import ScrollTo from '../../helpers/scroll-to';
import { ExercisesMap } from '../../models/exercises';
import Exercise from '../../models/exercises/exercise';
import Book from '../../models/reference-book';
import NoExercisesFound from './no-exercises-found';

@observer
class SectionsExercises extends React.Component {
  static propTypes = {
    pageId:                 PropTypes.string.isRequired,
    book:                   PropTypes.instanceOf(Book).isRequired,
    exercises:              PropTypes.instanceOf(ExercisesMap).isRequired,
    onShowDetailsViewClick: PropTypes.func.isRequired,
    onExerciseToggle:       PropTypes.func.isRequired,
    getExerciseIsSelected:  PropTypes.func.isRequired,
    getExerciseActions:     PropTypes.func.isRequired,
  };

  render() {
    const { pageId, book, exercises, ...previewProps } = this.props;
    const page = book.pages.byId.get(pageId);
    const title = page.title;
    const sectionExercises = exercises.byPageId[pageId];
    if (isEmpty(sectionExercises)) { return null; }

    // IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
    return (
      <div className="exercise-sections" data-section={page.chapter_section.asString}>
        <label className="exercises-section-label">
          <ChapterSection chapterSection={page.chapter_section} />
          {' '}
          {title}
        </label>
        <div className="exercises">
          {map(sectionExercises, (exercise) =>
            <ExercisePreview key={exercise.id} {...previewProps} exercise={exercise} />)}
        </div>
      </div>
    );
  }

}


export default
@observer
class ExerciseCards extends React.Component {

  static propTypes = {
    pageIds:                ArrayOrMobxType.isRequired,
    book:                   PropTypes.instanceOf(Book).isRequired,
    exercises:              PropTypes.instanceOf(ExercisesMap).isRequired,
    onExerciseToggle:       PropTypes.func.isRequired,
    getExerciseIsSelected:  PropTypes.func.isRequired,
    getExerciseActions:     PropTypes.func.isRequired,
    onShowDetailsViewClick: PropTypes.func.isRequired,
    focusedExercise:        PropTypes.instanceOf(Exercise),
    topScrollOffset:        PropTypes.number,
    windowImpl:             PropTypes.object,
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
      this.scroller.scrollToSelector('.exercise-sections');
    }
  }

  onAfterScroll = (el) => {
    if (this.props.focusedExercise) { el.focus(); }
  }

  render() {
    const { pageIds, exercises, ...sectionProps } = this.props;

    if (exercises.noneForPageIds(pageIds)) {
      return <NoExercisesFound />;
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
