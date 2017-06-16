import React from 'react';
import { observer } from 'mobx-react';
import User from '../../models/user';
import Loader from '../../models/loader';
import Offerings from '../../models/course/offerings';
import TermsModal from '../terms-modal';
import Wizard from './wizard';

@observer
export default class NewCourse extends React.PureComponent {

  loader = new Loader({ model: Offerings, fetch: true });

  render() {
    if (User.terms_signatures_needed) return <TermsModal />;

    return (
      <div className="new-course">
        <Wizard isLoading={this.loader.isBusy} />
      </div>
    );
  }

}
