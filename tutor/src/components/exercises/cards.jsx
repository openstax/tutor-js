import {
  React, PropTypes, observer, ArrayOrMobxType, styled,
} from 'vendor';
import { map, isEmpty } from 'lodash';
import ExercisePreview from './preview';
import BookPartTitle from '../book-part-title';
import ScrollTo from '../../helpers/scroll-to';
import { ExercisesMap } from '../../models/exercises';
import Exercise from '../../models/exercises/exercise';
import Book from '../../models/reference-book';
import NoExercisesFound from './no-exercises-found';


const SectionLabel = styled.label`
  font-size: 2.8rem;
  font-weight: bold;
  line-height: 3.5rem;
`;

@observer
class SectionsExercises extends React.Component {
  static propTypes = {
    pageId:                     PropTypes.string.isRequired,
    book:                       PropTypes.instanceOf(Book).isRequired,
    exercises:                  PropTypes.instanceOf(ExercisesMap).isRequired,
    getExerciseIsSelected:      PropTypes.func.isRequired,
    getExerciseActions:         PropTypes.func.isRequired,
    getExerciseDisableMessage:  PropTypes.func,
    onShowDetailsViewClick:     PropTypes.func,
    onExerciseToggle:           PropTypes.func,
  };

  render() {
    const { pageId, book, exercises, ...previewProps } = this.props;
    const page = book.pages.byId.get(pageId);
    const sectionExercises = exercises.byPageId[pageId];

    if (isEmpty(sectionExercises)) { return null; }

    // IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
    return (
      <div className="exercise-sections" data-section={page.chapter_section.asString}>
        <SectionLabel>
          <BookPartTitle part={page} displayChapterSection />
        </SectionLabel>
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
    pageIds:                    ArrayOrMobxType.isRequired,
    book:                       PropTypes.instanceOf(Book).isRequired,
    exercises:                  PropTypes.instanceOf(ExercisesMap).isRequired,
    getExerciseIsSelected:      PropTypes.func.isRequired,
    getExerciseActions:         PropTypes.func.isRequired,
    getExerciseDisableMessage:  PropTypes.func,
    onExerciseToggle:           PropTypes.func,
    onShowDetailsViewClick:     PropTypes.func,
    focusedExercise:            PropTypes.instanceOf(Exercise),
    topScrollOffset:            PropTypes.number,
    windowImpl:                 PropTypes.object,
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
