export type ID = string | number

export type CourseTermName = 'spring' | 'summer' | 'fall' | 'winter' | 'unknown'

export type QuestionDropType = 'full_credit' | 'zeroed'

export interface RoleData {
    id: ID
    joined_at: string
    research_identifier: string
    type: 'teacher' | 'student' | 'teacher_student'
}

export interface StudentData {
    id: ID
    role_id: ID
    period_id: ID
    first_name: string
    is_active: boolean
    is_comped: boolean
    is_paid: boolean
    last_name: string
    name: string
    payment_due_at: string
    prompt_student_to_pay: boolean
    student_identifier: string
}

export interface StudentRoleData {
    role_id: ID
    name: string
}

export interface TeacherData {
    id: ID
    course_id: ID
    role_id: ID
    name: string
    is_active: boolean
}

export interface TeacherProfileData {
    id: ID
    name: string
}

export interface CourseLMSData {
    id: ID
    key: string
    secret: string
    launch_url: string
    configuration_url: string
    xml: string
    created_at: string
    updated_at: string
}

export interface CoursePeriodData {
    id: ID
    enrollment_code: string
    enrollment_url: string
    is_archived: boolean
    name: string
    num_enrolled_students: number
}

export interface CourseData {
    id: ID
    name: string
    appearance_code: string
    book_pdf_url: string
    does_cost: boolean
    ecosystem_book_uuid: string
    ecosystem_id: string
    ends_at: string
    homework_weight: number
    is_access_switchable: boolean
    is_active: boolean
    is_college: boolean
    is_lms_enabling_allowed: boolean
    is_preview: boolean
    num_sections: number
    offering_id: string
    past_due_unattempted_ungraded_wrq_are_zero: boolean
    periods: CoursePeriodData[]
    reading_weight: number
    related_teacher_profile_ids: number[]
    roles: RoleData[]
    salesforce_book_name: string
    spy_info: any
    starts_at: string
    students: StudentData[]
    teachers: TeacherData[]
    teacher_profiles: TeacherProfileData[]
    term: CourseTermName
    timezone: string
    uses_pre_wrm_scores: boolean
    uuid: string
    webview_url: string
    year: number
    current_role_id?: string
}

export interface ActiveTermYearsData {
    term: CourseTermName
    year: number
}

export interface OfferingData {
    id: ID
    title: string
    description: string
    is_concept_coach: boolean
    is_tutor: boolean
    is_preview_available: boolean
    is_available: boolean
    appearance_code: string
    default_course_name: string
    does_cost: boolean
    subject: string
    active_term_years: ActiveTermYearsData[]
    os_book_id: string
}

export interface UserTermData {
    id: ID
    name: string
    title: string
    is_signed: boolean
}

export interface UserData {
    account_uuid: string
    available_terms: UserTermData[]
    can_create_courses: boolean
    faculty_status: 'confirmed_faculty' | 'no_faculty_info' | 'pending_faculty' | 'rejected_faculty'
    name: string
    first_name: string
    last_name: string
    is_admin: boolean
    is_content_analyst: boolean
    is_customer_service: boolean
    is_researcher: boolean
    profile_id: ID
    created_at: string
    profile_url: string
    school_location: 'unknown_school_location' | 'domestic_school' | 'foreign_school'
    self_reported_role: 'faculty' | 'student'
    terms_signatures_needed: boolean
    viewed_tour_stats: any[]
}

export interface BootstrapData {
    courses: CourseData[]
    accounts_api_url: string
    accounts_profile_url: string
    errata_form_url: string
    feature_flags: { is_payments_enabled: boolean }
    flash: any
    hypothesis: any
    offerings: OfferingData[]
    payments: { is_enabled: boolean, js_url: string, base_url: string }
    tutor_api_url: string
    ui_settings: any
    assets_url: string
    is_impersonating: boolean
    osweb_base_url: string
    user: UserData
}


export interface GradingTemplateData {
    id: ID
    auto_grading_feedback_on: string
    cloned_from_id: ID
    completion_weight: number
    correctness_weight: number
    course_id: ID,
    created_at: string
    default_close_date_offset_days: number
    default_due_date_offset_days: number
    default_due_time: string
    default_open_time: string
    has_open_task_plans: boolean
    late_work_penalty: number
    late_work_penalty_applied: string
    manual_grading_feedback_on: string
    name: string
    task_plan_type: 'reading' | 'homework'
}

export interface HighlightedPageData {
    chapter_section: number[]
    id: number
    title: string
    uuid: string
}

export interface ReferenceBookNodeData {
    chapter_section: number[]
    children: ReferenceBookNodeData[]
    ox_id: string
    type: 'unit' | 'chapter' | 'page'
    uuid: string
}

export interface ReferenceBookData {
    id: ID
    title: string
    ox_id: string
    type: 'book'
    uuid: string
    short_id: string
    version: string
    is_collated: boolean
    archive_url: string
    webview_url: string
    baked_at: string
    chapter_section: number[]
    children: ReferenceBookNodeData
}

export interface ReferenceBookPageData {
    chapter_section: number[]
    content_html: string
    spy: Record<string, any>
    title: string
}

// keep enums in sync with app/models/openstax/accounts/account.rb in accounts-rails gem
export type FacultyStatus = 'no_faculty_info' | 'pending_faculty' | 'confirmed_faculty' | 'rejected_faculty' | 'no_faculty_info'
export type SelfReportedRoles = 'unknown_role' | 'student' | 'instructor' | 'administrator' | 'librarian' | 'designer' | 'adjunct' | 'homeschool'

export interface ExercisePersonData {
    user_id: ID
    name: string
}

export interface ExerciseAnswerData {
    id: ID
    content_html: string
    correctness: string
    feedback_html: string
}

export interface ExerciseTagData {
    id: ID
    type: string
    is_visible: boolean
    data: string
}

export interface ExerciseQuestionData {
    id: ID
    is_answer_order_important: boolean
    stimulus_html: string
    stem_html: string
    answers: ExerciseAnswerData[]
    hints: any[]
    formats: string[]
    combo_choices: any[]
    collaborator_solutions: any[]
}

export interface ExerciseData {
    tags: string[]
    uuid: string
    group_uuid: string
    number: ID
    version: Number
    uid: string
    published_at: string
    authors: ExercisePersonData[]
    copyright_holders: ExercisePersonData[]
    derived_from: any[]
    is_vocab: boolean
    stimulus_html: string
    questions: ExerciseQuestionData[]
    versions: number[]
    attachments: any[]
    delegations: any[]

}

export interface TutorExerciseData {
    id: ID
    url: string
    content: ExerciseData
    images: any[]
    tags: ExerciseTagData[]
    pool_types: string[]
    is_excluded: boolean
    has_interactive: boolean
    has_video: boolean
    page_uuid: string
    author: ExercisePersonData
    is_copyable: boolean
}

export interface TaskPlanExtensionData {
    role_id: ID
    due_at: string
    closes_at: string
}

export type TaskPlanType = 'homework' | 'reading' | 'external' | 'event' | ''

export interface StudentTaskData {
    id: ID
    closes_at: string
    complete: boolean
    complete_exercise_count: number
    completed_on_time_exercise_steps_count: number
    completed_on_time_steps_count: number
    completed_steps_count: number
    correct_exercise_count: number
    due_at: string
    exercise_count: number
    gradable_step_count: number
    is_deleted: boolean
    is_extended: boolean
    is_past_due: boolean
    is_provisional_score: boolean
    opens_at: string
    published_points: number
    steps_count: number
    task_plan_id: ID
    title: string
    type: TaskPlanType
    ungraded_step_count: number
    steps: StudentTaskStepData[]
}

export interface TaskPlanDroppedQuestionData {
    id: ID
    points: number
}

export interface TeacherTaskPlanSettingsData {
    exercises?: {
        id: ID
        points: number[]
    }[]
    page_ids?: ID[]
    external_url?: string
}

export interface TeacherTaskPlanTaskingPlanData {
    id: ID
    opens_at: string
    due_at: string
    closes_at: string
    gradable_step_count: number
    target_id: ID
    target_type: 'course' | 'period'
    ungraded_step_count: number
}

export interface TeacherTaskPlanData {
    id: ID
    dropped_questions: TaskPlanDroppedQuestionData[]
    ecosystem_id: ID
    extensions: any[]
    first_published_at: string
    gradable_step_count: number
    grading_template_id: ID
    is_draft: boolean
    is_preview: boolean
    is_published: boolean
    is_publishing: boolean
    last_published_at: string
    num_completed_tasks: number
    num_in_progress_tasks: number
    num_not_started_tasks: number
    settings: TeacherTaskPlanSettingsData
    tasking_plans: TeacherTaskPlanTaskingPlanData[]
    title: string
    type: TaskPlanType
    ungraded_step_count: number
    wrq_count: number
}

export interface PeriodPerformanceHeadingData {
    available_points: number
    average_progress: number
    average_score: number
    due_at: string
    plan_id: ID
    title: number
    type: TaskPlanType
}

export interface StudentTaskPerformanceData {
    available_points: number
    completed_on_time_steps_count: number

    completed_step_count: number
    due_at: string
    id: ID
    is_provisional_score: boolean
    progress: number
    published_points: number
    published_score: number
    step_count: number
}

export interface PeriodPerformanceStudentData {
    course_average: number
    name: string
    first_name: string
    last_name: string
    data: StudentTaskPerformanceData[]
    homework_progress: number
    homework_score: number
    is_dropped: boolean
    reading_progress: number
    reading_score: number
    role: ID
}

export interface PeriodPerformanceData {
    period_id: ID
    data_headings: PeriodPerformanceHeadingData[]
    students: PeriodPerformanceStudentData[]
    overall_course_average: number
    overall_homework_progress: number
    overall_homework_score: number
    overall_reading_progress: number
    overall_reading_score: number
}

export interface PracticeQuestionData {
    id: ID
    exercise_id: ID
    available: boolean
    tasked_exercise_id: ID
}

export interface StudentTaskStepData {
    id: ID
    tasked_id: ID
    can_be_updated: boolean
    chapter_section: number[]
    content_url: string
    group: string
    is_completed: boolean
    is_core: boolean
    preview: string
    title: string
    type: string
}

export interface PurchaseProductData {
    uuid: string
    name: string
    price: string
}

export interface PurchaseData {
    order_id: ID
    identifier: string
    total: string
    sales_tax: string
    is_refunded: boolean
    purchased_at: string
    updated_at: string
    product: PurchaseProductData
}
