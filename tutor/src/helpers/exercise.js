import { extend } from 'lodash';
import { ExerciseHelpers } from 'shared';

const TutorHelpers = {

    openReportErrorPage(exercise, course) {

        return window.open(
            this.troubleUrl(extend({
                project: 'tutor',
                bookUUID: course.ecosystem_book_uuid,
                exerciseId: exercise.content.uid,
            }, exercise.page))
            , '_blank');
    },

};

export default extend(TutorHelpers, ExerciseHelpers);
