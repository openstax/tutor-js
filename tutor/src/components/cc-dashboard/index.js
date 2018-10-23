import React from 'react';
import BS from 'react-bootstrap';

import Router from '../../helpers/router';
import { CCDashboardStore, CCDashboardActions } from '../../flux/cc-dashboard';
import LoadableItem from '../loadable-item';
import CCDashboard from './dashboard';
import CCDashboardHelp from './help';
import classnames from 'classnames';


class DashboardShell extends React.Component {
  onLoadComplete = () => {
    const { courseId } = Router.currentParams();
    if (CCDashboardStore.isBlank(courseId)) {
      return <CCDashboardHelp courseId={courseId} />;
    } else {
      return <CCDashboard key={courseId} courseId={courseId} />;
    }
  };

  render() {
    const { courseId } = Router.currentParams();
    return (
      <LoadableItem
        store={CCDashboardStore}
        actions={CCDashboardActions}
        id={courseId}
        renderItem={this.onLoadComplete} />
    );
  }
}

export default DashboardShell;
