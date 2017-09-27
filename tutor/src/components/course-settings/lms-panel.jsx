import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import LoadingScreen from '../loading-screen';
import Course from '../../models/course';
import CopyOnFocusInput from '../copy-on-focus-input';
import Icon from '../icon';

@observer
export default class LMSAccessPanel extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
  };

  componentWillMount() {
    this.props.course.lms.fetch();
  }

  render() {
    const { course: { lms } } = this.props;

    if (lms.hasApiRequestPending) { return <LoadingScreen />; }

    return (
      <div className="lms-access">
        <CopyOnFocusInput label="Secret" value={lms.secret} />
        <CopyOnFocusInput label="Key" value={lms.key} />
        <CopyOnFocusInput label="URL" value={lms.url} />
        <a href="http://4tk3oi.axshare.com/salesforce_support_page_results.html" target="_blank">
          <Icon type="info-circle" /> How do I do this?
        </a>
      </div>
    )
  }


}
