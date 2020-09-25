import { React, PropTypes, observer } from 'vendor';
import { get } from 'lodash';
import BookPartTitle from '../../components/book-part-title';

const SectionLink = observer(({ info }) => {
  const exercisePage = get(info, 'exercise.page');
  const book = get(info, 'exercise.book');

  if(!exercisePage || !exercisePage.title || !book) return null;
  return (
    <a target="_blank" href={`/book/${book.id}/page/${exercisePage.id}`}><BookPartTitle part={exercisePage} displayChapterSection /></a>
  );
});
SectionLink.propTypes = {
  info:  PropTypes.object.isRequired,
};

export default SectionLink;