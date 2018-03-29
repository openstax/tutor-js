import React from 'react';
import { observer } from 'mobx-react';
import { map, isEqual, isEmpty } from 'lodash';
import ChapterSection from '../task-plan/chapter-section';
import ExercisePreview from './preview';
import ScrollTo from '../../helpers/scroll-to';
import { ExercisesMap } from '../../models/exercises';
import Exercise from '../../models/exercises/exercise';
import Book from '../../models/reference-book';
import { ArrayOrMobxType } from 'shared/helpers/react';

@observer
class SectionsExercises extends React.Component {
  static propTypes = {
    pageId:                 React.PropTypes.string.isRequired,
    book:                   React.PropTypes.instanceOf(Book).isRequired,
    exercises:              React.PropTypes.instanceOf(ExercisesMap).isRequired,
    onShowDetailsViewClick: React.PropTypes.func.isRequired,
    onExerciseToggle:       React.PropTypes.func.isRequired,
    getExerciseIsSelected:  React.PropTypes.func.isRequired,
    getExerciseActions:     React.PropTypes.func.isRequired,
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
          <ChapterSection section={page.chapter_section.asString} />
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


@observer
export default class ExerciseCards extends React.Component {

  static propTypes = {
    pageIds:                ArrayOrMobxType.isRequired,
    book:                   React.PropTypes.instanceOf(Book).isRequired,
    exercises:              React.PropTypes.instanceOf(ExercisesMap).isRequired,
    onExerciseToggle:       React.PropTypes.func.isRequired,
    getExerciseIsSelected:  React.PropTypes.func.isRequired,
    getExerciseActions:     React.PropTypes.func.isRequired,
    onShowDetailsViewClick: React.PropTypes.func.isRequired,
    focusedExercise:        React.PropTypes.instanceOf(Exercise),
    topScrollOffset:        React.PropTypes.number,
    windowImpl:             React.PropTypes.object,
  };

  static defaultProps = {
    topScrollOffset: 110,
  };

  // Important! - as an optimization, this component will only update if props have changed.
  // This is necessary because there can be a very large number of exercise previews displaying at once
  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps, this.props)
    );
  }

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

  getScrollTopOffset = () => {
    // no idea why scrollspeed makes the difference, sorry :(
    if (this.props.scrollFast) {
      return this.props.topScrollOffset;
    } else {
      return this.props.topScrollOffset + 40;
    }
  };

  render() {
    const { pageIds, ...sectionProps } = this.props;

    let sections = map(pageIds, pageId => (
      <SectionsExercises
        key={pageId}
        pageId={pageId}
        {...sectionProps}
      />
    ));

    if (isEmpty(sections)) {
      sections = (
        <p className="no-exercises-found">
          No exercises found in the selected sections.
        </p>
      );
    }

    return (
      <div className="exercise-cards">{sections}</div>
    );
  }
}
