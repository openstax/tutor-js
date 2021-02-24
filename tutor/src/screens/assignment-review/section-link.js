import { React, PropTypes, observer } from 'vendor';
import { get } from 'lodash';
import BookPartTitle from '../../components/book-part-title';

const SectionLink = observer(({ ux, info }) => {
    const exercisePage = get(info, 'exercise.page');
    const book = get(info, 'exercise.book');

    if(!exercisePage || !exercisePage.title || !book) return null;
    return (
        <a target="_blank" href={`/book/${ux.course.id}/page/${exercisePage.id}`} className="section-link">
            <BookPartTitle part={exercisePage} displayChapterSection />
        </a>
    );
});
SectionLink.propTypes = {
    ux: PropTypes.object.isRequired,
    info: PropTypes.object.isRequired,
};

export default SectionLink;
