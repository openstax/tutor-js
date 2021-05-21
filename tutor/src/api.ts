import { r, makeUrlFunc } from 'shared/api/request'
import { ID } from 'shared/types'

// POST: 'create',
// GET: 'read',
// PUT: 'update',
// DELETE: 'delete',
interface JobId { jobId: ID }
interface BookId { bookId: ID }
interface RoleId { roleId: ID }
interface StepId { stepId: ID }
interface TaskId { taskId: ID }
interface NoteId { noteId: ID }
interface TourId { tourId: ID }
interface TeacherId { teacherId: ID }
interface CourseId { courseId: ID }
interface PeriodId { periodId: ID }
interface RoleIdParam { role_id: ID }
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
interface TaskingPlanId { taskingPlanId: ID }
interface PQCourseId extends CourseId { practiceQuestionId: ID }
interface EcosystemCnxId { ecosystemId: ID, cnxId: ID }

const Definitions = {
    bootstrap:              r('GET', 'user/bootstrap'),

    saveOwnStudentId:       r<CourseId>('PUT', 'user/courses/{courseId}/student'),
    updateStudent:          r<StudentId>('PUT', 'students/{studentId}'),
    dropStudent:            r<StudentId>('DELETE', 'students/{studentId}'),
    unDropStudent:          r<StudentId>('PUT', 'students/{studentId}/undrop'),

    dropTeacher:            r<TeacherId>('DELETE', 'teachers/{teacherId}'),

    fetchReferenceBook:     r<BookId>('GET', 'ecosystems/{bookId}/readings'),
    fetchReferenceBookPage: r<EcosystemCnxId>('GET', 'ecosystems/{ecosystemId}/pages/{cnxId}'),

    courseEnroll:           r('POST', 'enrollment'),
    fetchEnrollmentChoices: r<{enrollmentCode: string}>('GET', 'enrollment/{enrollmentCode}/choices'),
    confirmCourseEnroll:    r<{enrollmentId: ID}>('PUT', 'enrollment/{enrollmentId}/approve'),

    fetchCourseRoster:      r<CourseId>('GET', 'courses/{courseId}/roster'),

    fetchCourseLMS:         r<CourseId>('GET', 'lms/courses/{courseId}'),

    practiceWorstTasks:     r<CourseId>('POST', 'courses/{courseId}/practice/worst'),
    practiceSavedTasks:     r<CourseId>('POST', 'courses/{courseId}/practice/saved'),

    fetchStudentTaskStep:   r<StepId>('GET', 'steps/{stepId}'),
    saveStudentTaskStep:    r<StepId>('PUT', 'steps/{stepId}'),

    fetchStudentTask:       r<TaskId, RoleIdParam>('GET', 'tasks/{taskId}'),
    saveStudentTask:        r<TaskId>('PUT', 'tasks/{taskId}'),

    createExercise:         r<CourseId>('POST', 'courses/{courseId}/exercises'),
    deleteExercise:         r<ExerciseNumber>('DELETE', 'courses/{courseId}/exercises/{exerciseNumber}'),

    fetchExercises:         r<EcosystemIdAction>('GET', 'ecosystems/{ecosystemId}/{action}'),
    fetchLimitedExercises:  r<EcosystemIdAction & { limit: string }>('GET', 'ecosystems/{ecosystemId}/{action}/{limit}'),

    fetchCourses:           r('GET', 'user/courses'),

    fetchCourse:            r<CourseId>('GET', 'course/{courseId}'),
    updateCourse:           r<CourseId>('PUT', 'courses/{courseId}'),
    createCourse:           r('POST', 'courses'),
    cloneCourse:            r<CourseId>('POST', 'courses/{courseId}/clone'),
    saveExerciseExclusion:  r<CourseId>('PUT', 'courses/{courseId}/exercises/exclude'),

    createCoursePeriod:     r<CourseId>('POST', 'courses/{courseId}/periods'),
    updateCoursePeriod:     r<PeriodId>('PUT', 'periods/{periodId}'),
    archiveCoursePeriod:    r<PeriodId>('DELETE', 'periods/{periodId}'),
    restoreCoursePeriod:    r<PeriodId>('PUT', 'periods/{periodId}'),

    createTeacherStudent:   r<PeriodId>('PUT', 'periods/{periodId}/teacher_student'),

    fetchPageNotes:         r<PageUUID>('GET', 'pages/{pageUUID}/notes'),
    fetchHighlightedPages:  r<BookUUID>('GET', 'books/{bookUUID}/highlighted_sections'),

    createNote:             r<PageUUID>('POST', 'pages/{pageUUID}/notes'),
    saveNote:               r<NoteId>('PUT', 'notes/{noteId}'),
    deleteNote:             r<NoteId>('DELETE', 'notes/{noteId}'),

    fetchGradingTemplates:  r<CourseId>('GET','courses/{courseId}/grading_templates'),
    createGradingTemplate:  r<CourseId>('POST', 'courses/{courseId}/grading_templates'),
    saveGradingTemplate:    r<GradingTemplateId>('PUT', 'grading_templates/{templateId}'),
    deleteGradingTemplate:  r<GradingTemplateId>('DELETE', 'grading_templates/{templateId}'),

    saveTourView:           r<TourId>('PUT', 'user/tours/{tourId}'),
    logUserEvent:           r<EventCategory>('POST', 'log/event/{category}/{code}'),

    suggestCourseSubject:   r('POST', 'user/suggest'),

    fetchEcosystems:        r('GET', 'ecosystems'),

    fetchUser:              r('GET', 'user'),
    fetchUserTerms:         r('GET', 'terms'),
    signUserTerms:          r<TermIds>('PUT', 'terms/{termIds}'),

    gradeTaskStep:          r<TaskStepId>('PUT', 'steps/{taskStepId}/grade'),

    fetchTaskPlans:         r<CourseId, TaskPlanQuery>('GET', 'courses/{courseId}/dashboard'),

    fetchPastTaskPlans:     r<CourseId>('GET', 'courses/{courseId}/plans'),
    fetchTaskPlan:          r<TaskPlanId>('GET', 'plans/{taskPlanId}'),
    deleteTaskPlan:         r<TaskPlanId>('DELETE', 'plans/{taskPlanId}'),
    saveTaskPlan:           r<TaskPlanId>('PUT', 'plans/{taskPlanId}'),
    saveDroppedQuestions:   r<TaskPlanId>('PUT', 'plans/{taskPlanId}'),
    createTaskPlan:         r<CourseId>('POST', 'courses/{courseId}/plans'),
    publishTaskingScores:   r<TaskingPlanId>('PUT', 'tasking_plans/{taskingPlanId}/grade'),

    grantTaskExtensions:    r<TaskPlanId>('PUT', 'plans/{taskPlanId}'),

    fetchStudentTasks:      r<CourseId>('GET', 'courses/{courseId}/dashboard'),

    fetchTaskPlanStats:     r<TaskPlanId>('GET', 'plans/{taskPlanId}/stats'),
    fetchTaskPlanReview:    r<TaskPlanId>('GET', 'plans/{taskPlanId}/review'),
    fetchTaskPlanScores:    r<TaskPlanId>('GET', 'plans/{taskPlanId}/scores'),
    fetchCourseScores:      r<CourseId, RoleIdParam>('GET', 'courses/{courseId}/performance'),

    responseValidation:     r<any, {uid: string, response: string}>('GET', 'validate'),

    fetchPracticeQuestions: r<CourseId, RoleIdParam>('GET', 'courses/{courseId}/practice_questions'),
    createPracticeQuestion: r<CourseId, RoleIdParam>('POST', 'courses/{courseId}/practice_questions'),
    deletePracticeQuestion: r<PQCourseId, RoleIdParam>('DELETE', 'courses/{courseId}/practice_questions/{practiceQuestionId}'),

    pairToLMS:              r<CourseId>('POST', 'lms/courses/{courseId}/pair'),

    pushLmsScores:          r<CourseId>('PUT', 'lms/courses/{courseId}/push_scores'),
    scoresExport:           r<CourseId>('POST', 'courses/{courseId}/performance/export'),

    fetchOfferings:         r('GET', 'offerings'),

    saveResearchSurvey:     r<{ surveyId: ID }>('PUT', 'research_surveys/{surveyId}'),

    requestRefund:          r<{ itemUUID: string }>('PUT', 'purchases/{itemUUID}/refund'),
    fetchPaymentHistory:    r('GET', 'purchases'),

    getMyPerformance:       r<CourseId>('GET', 'courses/{courseId}/guide'),
    getTeacherPerformance:  r<CourseId>('GET', 'courses/{courseId}/teacher_guide'),
    getStudentPerformance:  r<CourseId & RoleId>('GET', 'courses/{courseId}/guide/role/{roleId}'),

    requestJobStatus:       r<JobId>('GET', 'jobs/{jobId}'),
}

export { Definitions }

const urlFor = makeUrlFunc(Definitions)
export default urlFor
