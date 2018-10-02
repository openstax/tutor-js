import { React, observer } from '../../helpers/react';
import User from '../../models/user';
import TermsModal from '../../components/terms-modal';
import Wizard from './wizard';
import './styles.scss';

@observer
export default class NewCourse extends React.PureComponent {

  render() {
    if (User.terms_signatures_needed) return <TermsModal canBeDisplayed />;

    return (
      <div className="new-course-wizard">
        <Wizard />
      </div>
    );
  }

}
