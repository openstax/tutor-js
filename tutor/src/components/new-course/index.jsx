import React from 'react';
import { observer } from 'mobx-react';
import User from '../../models/user';
import TermsModal from '../terms-modal';
import Wizard from './wizard';

@observer
export default class NewCourse extends React.PureComponent {

  render() {
    if (User.terms_signatures_needed) return <TermsModal />;

    return (
      <div className="new-course">
        <Wizard />
      </div>
    );
  }

}
