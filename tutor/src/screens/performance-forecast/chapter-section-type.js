import PropTypes from 'prop-types';

export default PropTypes.shape({
    title:                    PropTypes.string,
    children:                 PropTypes.array,
    chapter_section:          PropTypes.object,
    clue:                     PropTypes.object,
    student_count:            PropTypes.number,
    questions_answered_count: PropTypes.number,
});
