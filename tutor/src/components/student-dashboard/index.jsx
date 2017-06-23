import React from 'react';

import { StudentDashboardStore, StudentDashboardActions } from '../../flux/student-dashboard';
import LoadableItem from '../loadable-item';

import StudentDashboard from './dashboard';

import TermsModal from '../terms-modal';
import PaymentsModal from '../payments/modal';

export default class StudentDashboardShell extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.object.isRequired,
  }

  render() {
    const { params, params: { courseId } } = this.props;

    return (
      <div className="student-dashboard ">
        <TermsModal />

        <PaymentsModal /> {/* FOR TESTING ONLY */}

        <LoadableItem
          id={courseId}
          store={StudentDashboardStore}
          actions={StudentDashboardActions}
          renderItem={() => <StudentDashboard params={params} courseId={courseId} />}
        />
      </div>
    );
  }
}
