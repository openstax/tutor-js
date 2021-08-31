import React from 'react';
import { Button } from 'react-bootstrap';
import { partial, isEmpty, isObject } from 'lodash';
import Dialog from '../tutor-dialog';
import TutorRouter from '../../helpers/router';
import TimeHelper from '../../helpers/time';
import ServerErrorMessage from './server-error-message';
import { reloadOnce } from '../../helpers/reload';
import { UserMenu, currentErrors } from '../../models';

const goToDashboard = function(context) {
    const { course } = context;
    context.history.push(
        TutorRouter.makePathname('dashboard', { courseId: course.id })
    );
    return Dialog.hide();
};

const hideModal = () => {
    Dialog.hide();
    currentErrors.clear()
};

const reloadOnceIfShouldReload = function() {
    const { navigation } = currentErrors
    currentErrors.clear()
    if (isEmpty(navigation)) { return; }
    if (navigation.shouldReload) {
        reloadOnce();
    } else if (navigation.href) {
        window.location.href = navigation.href;
    }
};

const cannotDeleteTemplate = (reason) => {
    return {
        className: 'error',
        title: 'Template cannot be deleted',
        body: (
            <div className="template-del-failure">
                <p className="lead">
                    {reason}
                </p>
            </div>
        ),
        buttons: [
            <Button
                key="ok"
                onClick={hideModal}
                variant="primary"
            >
        OK
            </Button>,
        ],
    };
};

const ERROR_HANDLERS = {
    // The course's starts_at is in the future
    course_not_started(error, message, context) {
        const { course } = context;
        const navigateAction = partial(goToDashboard, context);
        return {
            title: 'Future Course',
            body: (
                <p className="lead">
          This course has not yet started.
          Please try again after it starts on {TimeHelper.toHumanDate(course.starts_at)}
                </p>
            ),
            buttons: [
                <Button key="ok" onClick={navigateAction} variant="primary">
          OK
                </Button>,
            ],
            onOk: navigateAction,
            onCancel: navigateAction,
        };
    },

    // The course's ends_at has past
    course_ended(error, message, context) {
        const { course } = context;
        const navigateAction = partial(goToDashboard, context);
        return {
            title: 'Past Course',
            body: (
                <p className="lead">
          This course ended on {TimeHelper.toHumanDate(course.ends_at)}. No
          new activity can be performed on it, but you can still review past activity.
                </p>
            ),
            buttons: [
                <Button key="ok" onClick={navigateAction} variant="primary">
          OK
                </Button>,
            ],
            onOk: navigateAction,
            onCancel: navigateAction,
        };
    },

    no_preview_courses_available() {
        return {
            title: 'This Preview isn’t quite ready yet.',
            body: (
                <p>
          We need a few minutes to load the sample data.
          Click “Create a Course” to see a real course now, or try the Preview a little later.
                </p>
            ),
            buttons: [
                <Button key="ok" onClick={function() { return Dialog.hide(); }} variant="primary">
          OK
                </Button>,
            ],
            onOk: hideModal,
            onCancel: hideModal,
        };
    },

    // No exercises were generated because BL was not available
    biglearn_not_ready(error, message, context) {
        const navigateAction = partial(goToDashboard, context);
        return {
            title: 'No exercises are available',
            body: (
                <div className="no-exercises">
                    <p className="lead">
            There are no practice questions available at this time. Please try again later.
                    </p>
                </div>
            ),
            buttons: [
                <Button key="ok" onClick={navigateAction} variant="primary">
          OK
                </Button>,
            ],
            onOk: navigateAction,
            onCancel: navigateAction,
        };
    },

    // No exercises were found, usually for personalized practice
    no_exercises(error, message, context) {
        const navigateAction = partial(goToDashboard, context);
        return {
            title: 'No exercises are available',
            body: (
                <div className="no-exercises">
                    <p className="lead">
                        There are no problems to show for this topic.
                    </p>
                </div>
            ),
            buttons: [
                <Button key="ok" onClick={navigateAction} variant="primary">
                    OK
                </Button>,
            ],
            onOk: navigateAction,
            onCancel: navigateAction,
        };
    },

    base_cannot_be_deleted_because_it_is_the_last_reading_grading_template() {
        return cannotDeleteTemplate(
            'Template cannot be deleted since it is currently the last Reading template.'
        );
    },

    base_cannot_be_deleted_because_it_is_the_last_homework_grading_template() {
        return cannotDeleteTemplate(
            'Template cannot be deleted since it is currently the last Homework template.'
        );
    },

    base_cannot_be_deleted_because_it_is_assigned_to_one_or_more_task_plans() {
        return cannotDeleteTemplate(
            'Template cannot be deleted since it is currently in use by assignments.'
        );
    },

    base_cannot_be_changed_because_this_template_is_assigned_to_one_or_more_open_task_plans() {
        return {
            className: 'error',
            title: 'Template cannot be updated',
            body: (
                <div className="template-del-failure">
                    <p className="lead">
                        Templated cannot be updated because this template is assigned to one or more assignments.
                    </p>
                </div>
            ),
            buttons: [
                <Button
                    key="ok"
                    onClick={hideModal}
                    variant="primary"
                >
                    OK
                </Button>,
            ],
        };
    },

    // Payment overdue: don't render the error dialog because we want to display the modal instead
    payment_overdue() {
        return null;
    },

    settings_cannot_be_updated_after_open() {
        return {
            className: 'error',
            title: 'Settings cannot be changed after assignment is open',
            body: (
                <div className="template-del-failure">
                    <p className="lead">
                        Assignment settings cannot be changed after the assignment is open.
                    </p>
                </div>
            ),
            buttons: [
                <Button
                    key="ok"
                    onClick={hideModal}
                    variant="primary"
                >
                    OK
                </Button>,
            ],
        };
    },

    already_redeemed() {
        return null;
    },

    base_already_graded() {
        return {
            className: 'error',
            title: 'Submission error',
            body: (
                <div data-test-id="base-already-graded-message">
                    <p className="lead">
                        The new response could not be submitted because the question has already been graded.
                    </p>
                </div>
            ),
            buttons: [
                <Button
                    key="ok"
                    onClick={reloadOnce}
                    variant="primary"
                >
                    OK
                </Button>,
            ],
        };
    },

    invalid_attempt_number() {
        return {
            className: 'error',
            title: 'Submission error',
            body: (
                <div data-test-id="invalid-attempt-number-message">
                    <p className="lead">
                        This question is already in progress in another tab or window; reload this page to continue.
                    </p>
                </div>
            ),
            buttons: [
                <Button
                    key="ok"
                    onClick={reloadOnce}
                    variant="primary"
                >
                    OK
                </Button>,
            ],
        };
    },

    invalid_attempt_number_graded() {
        return {
            className: 'error',
            title: 'Grading error',
            body: (
                <div data-test-id="invalid-attempt-number-graded-message">
                    <p className="lead">
                        A new response has been submitted, please reload your browser.
                    </p>
                </div>
            ),
            buttons: [
                <Button
                    key="ok"
                    onClick={reloadOnce}
                    variant="primary"
                >
                    OK
                </Button>,
            ],
        };
    },

    // The default error dialog that's displayed when we have no idea what's going on
    default(error, message, context) {
        if (context == null) { context = {}; }
        if (error.supportLinkBase == null) {
            const { course } = context;
            error.supportLinkBase = UserMenu.helpLinkForCourse(course);
        }
        return {
            title: 'Server Error',
            body: <ServerErrorMessage {...error} />,
            buttons: [
                <Button key="ok" onClick={function() { return Dialog.hide(); }} variant="primary">
                    OK
                </Button>,
            ],
            onOk: reloadOnceIfShouldReload,
            onCancel: reloadOnceIfShouldReload,
        };
    },
};


const ServerErrorHandlers = {

    forError(error, context) {
        const data = error.data;
        if (isObject(data)) {
            if (data.code && ERROR_HANDLERS[data.code]) {
                return ERROR_HANDLERS[data.code](error, data, context)
            }
        }
        return ERROR_HANDLERS.default(error, data, context);
    },

};

export default ServerErrorHandlers;
