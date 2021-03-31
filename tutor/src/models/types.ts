export type ID = string | number

export type CourseTerm = 'spring' | 'summer' | 'fall' | 'winter' | 'unknown'

export interface RoleObj {
    id: ID
    joined_at: string
    research_identifier: string
    type: 'teacher' | 'student' | 'teacher_student'
}

export interface StudentObj {
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

export interface TeacherObj {
    id: ID
    course_id: ID
    role_id: ID
    name: string
    is_active: boolean
}

export interface TeacherProfileObj {
    id: ID
    name: string
}

export interface PeriodObj {
    id: ID
    enrollment_code: string
    enrollment_url: string
    is_archived: boolean
    name: string
    num_enrolled_students: number
}

export interface CourseObj {
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
    periods: PeriodObj[]
    reading_weight: number
    related_teacher_profile_ids: number[]
    roles: RoleObj[]
    salesforce_book_name: string
    spy_info: any
    starts_at: string
    students: StudentObj[]
    teachers: TeacherObj[]
    teacher_profiles: TeacherProfileObj[]
    term: CourseTerm
    timezone: string
    uses_pre_wrm_scores: boolean
    uuid: string
    webview_url: string
    year: number
    current_role_id?: string
}

export interface ActiveTermYearsObj {
    term: CourseTerm
    year: number
}

export interface OfferingObj {
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
    active_term_years: ActiveTermYearsObj[]
    os_book_id: string
}

export interface UserTermObj {
    id: ID
    name: string
    title: string
    is_signed: boolean
}

export interface UserObj {
    account_uuid: string
    available_terms: UserTermObj[]
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
    courses: CourseObj[]
    accounts_api_url: string
    accounts_profile_url: string
    errata_form_url: string
    feature_flags: { is_payments_enabled: boolean }
    flash: any
    hypothesis: any
    offerings: OfferingObj[]
    payments: { is_enabled: boolean, js_url: string, base_url: string }
    tutor_api_url: string
    ui_settings: any
    user: UserObj
}


export interface GradingTemplateObj {
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

export interface HighlightedPageObj {
    chapter_section: number[]
    id: number
    title: string
    uuid: string
}

export interface ReferenceBookNodeObj {
    chapter_section: number[]
    children: ReferenceBookNodeObj[]
    cnx_id: string
    type: 'unit' | 'chapter' | 'page'
    uuid: string
}

export interface ReferenceBookObj {
    id: ID
    title: string
    cnx_id: string
    type: 'book'
    uuid: string
    short_id: string
    version: string
    is_collated: boolean
    archive_url: string
    webview_url: string
    baked_at: string
    chapter_section: number[]
    children: ReferenceBookNodeObj
}

export interface ReferenceBookPageObj {
    chapter_section: number[]
    content_html: string
    spy: Record<string, any>
    title: string
}

// keep enums in sync with app/models/openstax/accounts/account.rb in accounts-rails gem
export type FacultyStatus = 'no_faculty_info' | 'pending_faculty' | 'confirmed_faculty' | 'rejected_faculty' | 'no_faculty_info'
export type SelfReportedRoles = 'unknown_role' | 'student' | 'instructor' | 'administrator' | 'librarian' | 'designer' | 'adjunct' | 'homeschool'

export interface ExercisePersonObj {
    user_id: ID
    name: string
}

export interface ExerciseAnswerObj {
    id: ID
    content_html: string
    correctness: string
    feedback_html: string
}

export interface ExerciseTagObj {
    id: ID
    type: string
    is_visible: boolean
    data: string
}

export interface ExerciseQuestionObj {
    id: ID
    is_answer_order_important: boolean
    stimulus_html: string
    stem_html: string
    answers: ExerciseAnswerObj[]
    hints: any[]
    formats: string[]
    combo_choices: any[]
    collaborator_solutions: any[]
}

export interface ExerciseObj {
    tags: string[]
    uuid: string
    group_uuid: string
    number: ID
    version: Number
    uid: string
    published_at: string
    authors: ExercisePersonObj[]
    copyright_holders: ExercisePersonObj[]
    derived_from: any[]
    is_vocab: boolean
    stimulus_html: string
    questions: ExerciseQuestionObj[]
    versions: number[]
    attachments: any[]
    delegations: any[]

}

export interface TutorExerciseObj {
    id: ID
    url: string
    content: ExerciseObj
    images: any[]
    tags: ExerciseTagObj[]
    pool_types: string[]
    is_excluded: boolean
    has_interactive: boolean
    has_video: boolean
    page_uuid: string
    author: ExercisePersonObj
    is_copyable: boolean
}

export interface TaskPlanExtensionObj {
    role_id: ID
    due_at: string
    closes_at: string
}
