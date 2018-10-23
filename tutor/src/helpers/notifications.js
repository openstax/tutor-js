import { NotificationActions } from 'shared';

export default {
  start(bootstrapData) {
    NotificationActions.startPolling();
    return (() => {
      const result = [];
      const object = bootstrapData.flash || {};
      for (let level in object) {
        const message = object[level];
        result.push(NotificationActions.display({ message, level }));
      }
      return result;
    })();
  },

  buildCallbackHandlers(comp) {
    // Require router here because requiring it in global scope
    // causes hot module reloading to fail in dev mode because this file is required outside the HMR scope
    const Router = require('./router');
    const { router } = comp.context;
    if (!router) {
      throw new Error('Component\'s context must have router present');
    }
    return {
      missing_student_id: {
        onAdd({ course }) {
          return router.history.push(
            Router.makePathname('changeStudentId', { courseId: course.id })
          );
        },
      },
    };
  },
};
