import { NotificationActions } from 'shared';
import Router from './router';

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
