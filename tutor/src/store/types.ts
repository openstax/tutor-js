type ID = string | number

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
    teacher_profiles: TeacherProfile[]
    term: 'spring' | 'summer' | 'fall' | 'winter'
    timezone: string
    uses_pre_wrm_scores: boolean
    uuid: string
    webview_url: string
    year: number
}
