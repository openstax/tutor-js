export type ID = string | number

type CourseTerm = 'spring' | 'summer' | 'fall' | 'winter'

export interface Role {
    id: ID
    joined_at: string
    research_identifier: string
    type: 'teacher' | 'student' | 'teacher_student'
}

export interface Student {
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

export interface Teacher {
    id: ID
    course_id: ID
    role_id: ID
    name: string
    is_active: boolean
}

export interface TeacherProfile {
    id: ID
    name: string
}

export interface Period {
    id: ID
    enrollment_code: string
    enrollment_url: string
    is_archived: boolean
    name: string
    num_enrolled_students: number
}

export interface Course {
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
    periods: Period[]
    reading_weight: number
    related_teacher_profile_ids: number[]
    roles: Role[]
    salesforce_book_name: string
    spy_info: any
    starts_at: string
    students: Student[]
    teachers: Teacher[]
    teacher_profiles: TeacherProfile[]
    term: CourseTerm
    timezone: string
    uses_pre_wrm_scores: boolean
    uuid: string
    webview_url: string
    year: number
    current_role_id?: string
}

export interface ActiveTermYears {
    term: CourseTerm
    year: number
}

export interface Offering {
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
    active_term_years: ActiveTermYears[]
    os_book_id: string
    number: number
}

export interface UserTerm {
    id: ID
    name: string
    title: string
    is_signed: boolean
}

export interface User {
    account_uuid: string
    available_terms: UserTerm[]
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
    courses: Course[]
    accounts_api_url: string
    accounts_profile_url: string
    errata_form_url: string
    feature_flags: { is_payments_enabled: boolean }
    flash: any
    hypothesis: any
    offerings: Offering[]
    payments: { is_enabled: boolean, js_url: string, base_url: string }
    tutor_api_url: string
    ui_settings: any
    user: User
}
