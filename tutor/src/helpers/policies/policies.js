const freeResponse = {
    name: 'free-response',
    optional: 'checkQuestionFormat',
    passCheck: ['free_response'],

    actions: [
        'fillFreeResponse',
        'saveFreeResponse',
    ],
};

const multipleChoice = {
    name: 'multiple-choice',
    aliases: ['true-false', 'fill-in-the-blank'],
    optional: 'checkQuestionFormat',
    passCheck: ['answer_id', 'is_completed'],

    actions: [
        'pickMultipleChoice',
        'saveMultipleChoice',
    ],
};

const review = {
    name: 'review',
    canReview: true,
    canWrite: true,

    actions: [
        'clickContinue',
    ],
};

const teacherReadOnly = {
    name: 'teacher-read-only',
    canWrite: false,

    actions: [
        'clickContinue',
    ],
};

const teacherReview = {
    name: 'teacher-read-only',
    canReview: true,
    canWrite: false,

    actions: [
        'clickContinue',
    ],
};

const view = {
    name: 'view',
    canReview: true,

    actions: [
        'clickContinue',
    ],
};

const stepNoFeedback = [
    freeResponse,
    multipleChoice,
];

const stepFeedbackImmediate = [
    freeResponse,
    multipleChoice,
    review,
];

const stepViewOnly = [
    view,
];

const stepTeacherReview = [
    teacherReview,
];

const stepTeacherReadOnly = [
    teacherReadOnly,
];

// Policy Shape
//
//   #{taskType}:
//     #{stepType}:
//       #{for}:
//         default: #{info}
//         check: #{stateType}
//         states:
//           #{state}: #{info}

const defaultPolicies = {
    exercise: {
        panels: {
            default: stepFeedbackImmediate,
            check: 'role',

            states: {
                teacher: stepTeacherReview,
            },
        },
    },

    reading: {
        panels: {
            default: stepViewOnly,
            check: 'role',

            states: {
                teacher: stepTeacherReview,
            },
        },
    },

    video: {
        panels: {
            default: stepViewOnly,
            check: 'role',

            states: {
                teacher: stepTeacherReview,
            },
        },
    },

    interactive: {
        panels: {
            default: stepViewOnly,
            check: 'role',

            states: {
                teacher: stepTeacherReview,
            },
        },
    },

    placeholder: {
        panels: {
            default: stepViewOnly,
            check: 'role',

            states: {
                teacher: stepTeacherReview,
            },
        },
    },
};

const policies = {
    homework: {
        exercise: {
            panels: {
                default: {
                    check: 'dueState',

                    states: {
                        before: stepNoFeedback,
                        after: stepFeedbackImmediate,
                    },
                },

                check: 'role',

                states: {
                    teacher: {
                        check: 'dueState',

                        states: {
                            before: stepTeacherReadOnly,
                            after: stepTeacherReview,
                        },
                    },
                },
            },
        },

        placeholder: {
            panels: {
                default: stepViewOnly,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    practice: {
        exercise: {
            panels: {
                default: stepFeedbackImmediate,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    chapter_practice: {
        exercise: {
            panels: {
                default: stepFeedbackImmediate,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    page_practice: {
        exercise: {
            panels: {
                default: stepFeedbackImmediate,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    practice_worst_topics: {
        exercise: {
            panels: {
                default: stepFeedbackImmediate,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    concept_coach: {
        exercise: {
            panels: {
                default: stepFeedbackImmediate,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    reading: defaultPolicies,

    external: {
        external_url: {
            panels: {
                default: stepViewOnly,
                check: 'role',

                states: {
                    teacher: stepTeacherReview,
                },
            },
        },
    },

    default: defaultPolicies,
};

export default policies;
