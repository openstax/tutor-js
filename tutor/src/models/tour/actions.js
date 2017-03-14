import { findModel } from 'mobx-decorated-models';

import './actions/open-user-menu';
import './actions/open-calendar-sidebar';
import './actions/reposition';

export default {

  forIdentifier(id) {
    return findModel(`tour/action/${id}`);
  },

};
