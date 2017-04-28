import React from 'react';
import { observer } from 'mobx-react';


// import { OfferingsStore, OfferingsActions } from '../../flux/offerings';

import Wizard from './wizard';

@observer
export default class NewCourse extends React.PureComponent {

  render() {
    const isBusy = true; // FIXME replace with model loader once merged
    return (
      <div className="new-course">
        <Wizard isLoading={isBusy} />
      </div>
    );
  }

}
