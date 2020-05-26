import React from 'react';
import { Button } from 'react-bootstrap';
import { partial, isEmpty, isObject } from 'lodash';
import Dialog from '../tutor-dialog';
import TutorRouter from '../../helpers/router';
import TimeHelper from '../../helpers/time';
import ServerErrorMessage from './server-error-message';
import { reloadOnce } from '../../helpers/reload';
import { AppStore, AppActions } from '../../flux/app';
import UserMenu from '../../models/user/menu';

const goToDashboard = function(context) {
  const { course } = context;
  context.history.push(
    TutorRouter.makePathname('dashboard', { courseId: course.id })
  );
  return Dialog.hide();
};

const hideModal = () => {
  Dialog.hide();
  AppActions.resetServerErrors();
};

const reloadOnceIfShouldReload = function() {
  const navigation = AppStore.errorNavigation();
  if (isEmpty(navigation)) { return; }
  if (navigation.shouldReload) {
    reloadOnce();
  } else if (navigation.href) {
    window.location.href = navigation.href;
  }
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

  base_cannot_be_deleted_because_it_is_assigned_to_one_or_more_task_plans() {
    return {
      className: 'error',
      title: 'Template cannot be deleted',
      body: (
        <div className="template-del-failure">
          <p className="lead">
            Template cannot be deleted since it is currently in use by assignments.
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
      const num_errors = data.errors != null ? data.errors.length : undefined;
      if (num_errors === 1) {
        const code = data.errors[0].code;
        if (code in ERROR_HANDLERS) {
          return ERROR_HANDLERS[code](error, data, context);
        }
      }
    }
    return ERROR_HANDLERS.default(error, data, context);
  },

};

export default ServerErrorHandlers;
