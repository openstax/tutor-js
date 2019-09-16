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
    const { history } = comp.props;
    if (!history) {
      throw new Error('Component\'s props must have history present');
    }
    return {
      missing_student_id: {
        onAdd({ course }) {
          return history.push(
            Router.makePathname('changeStudentId', { courseId: course.id })
          );
        },
      },
    };
  },
};
