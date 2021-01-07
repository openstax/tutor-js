import {
  React, PropTypes, observer, ArrayOrMobxType, styled,
} from 'vendor';
import { map, isEmpty } from 'lodash';
import ExercisePreview from '../../../components/exercises/preview';
import BookPartTitle from '../../../components/book-part-title';
import ScrollTo from '../../../helpers/scroll-to';
import { ExercisesMap } from '../../../models/exercises';
import Exercise from '../../../models/exercises/exercise';
import Book from '../../../models/reference-book';
import NoExercisesFound from '../../../components/exercises/no-exercises-found';
import { colors, breakpoints } from '../../../theme';

const Wrapper = styled.div`
  &:not(:first-child) {
    padding-top: 5rem;
  }

  @media ${breakpoints.mdUp} {
    .card {
      margin: 5px;
    }
  }

  .exercise-card {
    page-break-inside: avoid;
    break-inside: avoid;
    display: inline-block;
    width: 100%;

    .selected-mask {
      background-color: ${colors.exercises.selected};
    }
    .controls-overlay {
      background-color: ${colors.exercises.hovered};
    }
  }
`;

const Columns = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > div {
    flex: 0 1 49%;
  }

  padding-bottom: 1.6rem;
`;

const SectionLabel = styled.label`
  font-size: 2.8rem;
  font-weight: bold;
  line-height: 3.5rem;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  margin: 1.6rem 0;
`;

const Title = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  margin-right: 1.6rem;
`;

const HintText = styled.div`
  color: ${colors.neutral.thin};
`;

const Exercises = observer(({ id, exercises, title, hintText, ...previewProps }) => {
  if (isEmpty(exercises)) { return null; }

  return (
    <div key={id}>
      <Header>
        <Title>{title}</Title>
        <HintText>{hintText}</HintText>
      </Header>
      <Columns>
        {map(exercises, (exercise) =>
          <ExercisePreview key={exercise.id} {...previewProps} exercise={exercise} />)}
      </Columns>
    </div>
  );
});

Exercises.propTypes = {
  id: PropTypes.string,
  exercises: PropTypes.array,
  title: PropTypes.string.isRequired,
  hintText: PropTypes.string.isRequired,
};

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
    const pageExercises = exercises.byPageId[pageId];
    if(isEmpty(pageExercises)) {
      return null;
    }

    const mcExercises = pageExercises.filter(e => e.content.questions[0].isMultipleChoice);
    const oeExercises = pageExercises.filter(e => e.content.questions[0].isOpenEnded);

    // IMPORTANT: the 'data-section' attribute is used as a scroll-to target and must be present
    return (
      <Wrapper data-section={page.chapter_section.asString}>
        <SectionLabel>
          <BookPartTitle part={page} displayChapterSection />
        </SectionLabel>
        <Exercises
          title="Multiple Choice Questions"
          hintText="(MCQs are auto-graded by Tutor)"
          exercises={mcExercises}
          id={`mc-${pageId}`}
          {...previewProps}
        />
        <Exercises
          title="Written Response Questions"
          hintText="(WRQs have to be manually graded by the teacher)"
          exercises={oeExercises}
          id={`oe-${pageId}`}
          {...previewProps}
        />
      </Wrapper>
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
    goBackward:             PropTypes.func.isRequired,
    focusedExercise:        PropTypes.instanceOf(Exercise),
    topScrollOffset:        PropTypes.number,
    disableScroll:          PropTypes.bool,
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
    if (!this.props.disableScroll){
      if (this.props.focusedExercise) {
        this.scroller.scrollToSelector(`[data-exercise-id="${this.props.focusedExercise.content.uid}"]`, { immediate: true });
      } else {
        this.scroller.scrollToSelector('[data-section]');
      }
    }
  }

  onAfterScroll = (el) => {
    if (this.props.focusedExercise) { el.focus(); }
  }

  render() {
    const { pageIds, exercises, goBackward, ...sectionProps } = this.props;

    if (exercises.noneForPageIds(pageIds)) {
      return <NoExercisesFound 
        isHomework={true}
        sectionHasExercises={exercises.noneForPageIds(pageIds) ? false : true}
        onSelectSections={goBackward}/>;
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
