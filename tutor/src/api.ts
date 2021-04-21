import { r, makeUrlFunc } from 'shared/api/request'
import { ID } from 'shared/types'

// POST: 'create',
// GET: 'read',
// PUT: 'update',
// DELETE: 'delete',

interface BookId { bookId: ID }
interface StepId { stepId: ID }
interface TaskId { taskId: ID }
interface NoteId { noteId: ID }
interface TourId { tourId: ID }
interface CourseId { courseId: ID }
interface PeriodId { periodId: ID }
interface StudentId { studentId: ID }
interface PageUUID { pageUUID: string }
interface BookUUID { bookUUID: string }
interface GradingTemplateId { templateId: ID }
interface EcosystemIdAction { ecosystemId: ID, action: string }
interface ExerciseNumber { courseId: ID, exerciseNumber: string }
interface EventCategory { category: string, code: string }
interface TermIds { termIds: ID[] }
interface TaskStepId { taskStepId: ID }
interface TaskPlanQuery { start_at: string, end_at: string }
interface TaskPlanId { taskPlanId: ID }
interface PQCourseId extends CourseId { practiceQuestionId: ID }
interface EcosystemCnxId { ecosystemId: ID, cnxId: ID }

const Definitions = {
    bootstrap:              r('GET', '/user/bootstrap'),

    saveOwnStudentId:       r<CourseId>('POST', 'user/courses/{courseId}/student'),
    updateStudent:          r<StudentId>('POST', 'students{studentId}'),
    dropStudent:            r<StudentId>('DELETE', 'students/{studentId}'),
    unDropStudent:          r<StudentId>('POST', 'students/{studentId}/undrop'),

    fetchReferenceBook:     r<BookId>('GET', 'ecosystems/{bookId}/readings'),
    fetchReferenceBookPage: r<EcosystemCnxId>('GET', 'ecosystems/{ecosystemId}/pages/{cnxId}'),

    courseEnroll:           r('POST', 'enrollment'),
    fetchEnrollmentChoices: r<{enrollmentCode: string}>('GET', 'enrollment/{enrollmentCode}/choices'),
    confirmCourseEnroll:    r<{enrollmentId: ID}>('PUT', 'enrollment/{enrollmentId}/approve'),

    fetchCourseRoster:      r<CourseId>('GET', 'courses/{courseId}/roster'),

    fetchCourseLMS:         r<CourseId>('GET', 'lms/courses/{courseId}'),

    practiceWorstTasks:     r<CourseId>('GET', 'courses/{courseId}/practice/worst'),
    practiceSavedTasks:     r<CourseId>('GET', 'courses/{courseId}/practice/saved'),

    fetchStudentTaskStep:   r<StepId>('GET', 'steps/{stepId}'),
    saveStudentTaskStep:    r<StepId>('POST', 'steps/{stepId}'),

    fetchStudentTask:       r<TaskId>('GET', 'tasks/{taskId}'),
    saveStudentTask:        r<TaskId>('PUT', 'tasks/{taskId}'),

    createExercise:         r<CourseId>('POST', 'courses/{courseId}/exercises'),
    deleteExercise:         r<ExerciseNumber>('DELETE', 'courses/{courseId}/exercises/{exerciseNumber}'),

    fetchExercises:         r<EcosystemIdAction>('GET', 'ecosystems/{ecosystemId}/{action}'),
    fetchLimitedExercises:  r<EcosystemIdAction & { limit: string }>('GET', 'ecosystems/{ecosystemId}/{action}/{limit}'),

    fetchCourses:           r('GET', 'courses'),

    fetchCourse:            r<CourseId>('GET', 'course/{courseId}'),
    updateCourse:           r<CourseId>('POST', 'course/{courseId}'),
    createCourse:           r('POST', 'course'),
    cloneCourse:            r<CourseId>('PUT', 'courses/{courseId}/clone'),
    saveExerciseExclusion:  r<CourseId>('PUT', 'courses/{courseId}/exercises/exclude'),

    createCoursePeriod:     r<CourseId>('POST', 'courses/{courseId}/periods'),
    updateCoursePeriod:     r<PeriodId>('PUT', 'periods/{periodId}'),
    archiveCoursePeriod:    r<PeriodId>('DELETE', 'periods/{periodId}'),
    restoreCoursePeriod:    r<PeriodId>('PUT', 'periods/{periodId}'),

    createTeacherStudent:   r<PeriodId>('PUT', 'periods/{periodId}/teacher_student'),

    fetchPageNotes:         r<PageUUID>('GET', 'pages/{pageUUID}/notes'),
    fetchHighlightedPages:  r<BookUUID>('GET', 'books/{bookUuid}/highlighted_sections'),

    createNote:             r<PageUUID>('POST', 'pages/{pageUUID}/notes'),
    saveNote:               r<NoteId>('PUT', 'notes/{noteId}'),
    deleteNote:             r<NoteId>('DELETE', 'notes/{noteId}'),

    fetchGradingTemplates:  r<CourseId>('GET','courses/{courseId}/grading_templates'),
    createGradingTemplate:  r<CourseId>('POST', 'courses/{courseId}/grading_templates'),
    saveGradingTemplate:    r<GradingTemplateId>('PUT', 'grading_templates/{id}'),
    deleteGradingTemplate:  r<GradingTemplateId>('DELETE', 'grading_templates/{id}'),

    saveTourView:           r<TourId>('PUT', 'user/tours/{tourId}'),
    logUserEvent:           r<EventCategory>('POST', 'log/event/{category}/{code}'),

    suggestCourseSubject:   r('POST', 'user/suggest'),

    fetchEcosystems:        r('GET', 'ecosystems'),

    fetchUserTerms:         r('GET', 'terms'),
    signUserTerms:          r<TermIds>('PUT', 'terms/{termIds}'),

    gradeTaskStep:          r<TaskStepId>('PUT', 'steps/{taskStepId}/grade'),

    fetchTaskPlans:         r<CourseId, TaskPlanQuery>('GET', 'courses/{course.id}/dashboard'),

    fetchPastTaskPlans:     r<CourseId>('GET', 'courses/{courseId}/plans'),
    fetchTaskPlan:          r<TaskPlanId>('GET', 'plans/{taskPlanId}'),
    deleteTaskPlan:         r<TaskPlanId>('DELETE', 'plans/{id}'),
    saveTaskPlan:           r<TaskPlanId>('PUT', 'plans/{id}'),
    saveDroppedQuestions:   r<TaskPlanId>('PUT', 'plans/{id}'),
    createTaskPlan:         r<CourseId>('POST', 'courses/${courseId}/plans'),

    grantTaskExtensions:    r<TaskPlanId>('PUT', 'plans/{id}'),

    fetchStudentTasks:      r<CourseId>('GET', 'courses/{courseId}/dashboard'),

    fetchTaskPlanStats:     r<TaskPlanId>('GET', 'plans/{taskPlanId}/stats'),
    fetchTaskPlanReview:    r<TaskPlanId>('GET', 'plans/{id}/review'),
    fetchTaskPlanScores:    r<TaskPlanId>('GET', 'plans/{id}/scores'),
    fetchCourseScores:      r<CourseId>('GET', 'courses/{courseId}/performance'),

    responseValidation:     r<any, {uid: string, response: string}>('GET', 'validate'),

    fetchPracticeQuestions: r<CourseId>('GET', 'courses/{courseId}/practice_questions'),
    createPracticeQuestion: r<CourseId>('POST', 'courses/{courseId}/practice_questions'),
    deletePracticeQuestion: r<PQCourseId>('DELETE', 'courses/{courseId}/practice_questions/{id}'),

    pushLmsScores:          r<CourseId>('PUT', 'lms/courses/{courseId}/push_scores'),
    scoresExport:           r<CourseId>('PUT', 'courses/{courseId}/performance/export'),

    fetchOfferings:         r('GET', 'offerings'),

    saveResearchSurvey:     r<{ surveyId: ID }>('PUT', 'research_surveys/{id}'),

}

export { Definitions }

const urlFor = makeUrlFunc(Definitions)
export default urlFor

//export default Api
//     // "User" is actually an instance, but connectModel works at the class level
//     connectModelRead(User.constructor, 'fetch',
//         { pattern: 'user' }
//     );

//     // notes
//     connectModelRead(Stats, 'fetch', {
//         url: '/stats', onSuccess: 'onLoaded',
//     });

//     // notes
//
//     connectModelUpdate(Survey, 'save',
//     );
//     connectModelRead(Purchases.constructor, 'fetch', { onSuccess: 'onLoaded', url: 'purchases' });
//     connectModelUpdate(
//         Purchase,
//         'refund',
//         {
//             onSuccess: 'onRefunded',
//             pattern: 'purchases/{item_uuid}/refund',
//             method: 'PUT',
//             data() { return { survey: this.refund_survey }; },
//         },
//     );
//     connectModelRead(Offerings.constructor, 'fetch', { url: 'offerings', onSuccess: 'onLoaded' });
//
//     connectModelDelete(StudentTaskPlan, 'hide', { onSuccess: 'onHidden', pattern: 'tasks/{id}' });


//     connectModelUpdate(CoursePairLMS, 'save', { method: 'POST', pattern: 'lms/courses/{course.id}/pair', onSuccess: 'onPaired' });

//     connectModelDelete(CourseTeacher, 'drop', { pattern: 'teachers/{id}', onSuccess: 'onDropped' });
//     connectModelUpdate(TaskResult, 'acceptLate', { method: 'PUT', pattern: 'tasks/{id}/accept_late_work', onSuccess: 'onLateWorkAccepted' });

//     connectModelUpdate(TaskResult, 'rejectLate', { method: 'PUT', pattern: 'tasks/{id}/reject_late_work', onSuccess: 'onLateWorkRejected' });

//     connectModelRead(Job, 'requestJobStatus', { onSuccess: 'onJobUpdate', onFail: 'onJobUpdateFailure', pattern: 'jobs/{jobId}' });
//     connectModelRead(TaskPlanStats, 'fetch', {
//         onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}/stats',
//     });

//     connectModelRead(Courses.constructor, 'fetch', { onSuccess: 'onLoaded', url: 'user/courses' });
// };
// export default {
//     boot: startAPI,
// };
//
// TODO: convert flux
//     connectRead(CourseGuideActions, { pattern: 'courses/{id}/guide' });

//     connectRead(PerformanceForecast.Student.actions, function(id) {
//         const course = Courses.get(id);
//         const params = {};
//         if (course && course.current_role_id) {
//             params.role_id = course.current_role_id;
//         }
//         return { url: `courses/${id}/guide`, params };
//     });
//     connectRead(PerformanceForecast.Teacher.actions, { pattern: 'courses/{id}/teacher_guide' });
//     connectRead(PerformanceForecast.TeacherStudent.actions, function(id, { roleId }) {
//         const url = `courses/${id}/guide/role/${roleId}`;
//         const data = { id, roleId };
//         return { url, data };
//     });

//     connectRead(ReferenceBookExerciseActions, { url(url) { return url; } });
