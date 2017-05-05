import React from 'react';
import { observer } from 'mobx-react';

import Loader from '../../models/loader';
import Offerings from '../../models/course/offerings';

import Wizard from './wizard';

@observer
export default class NewCourse extends React.PureComponent {

  loader = new Loader({ model: Offerings, fetch: true });

  render() {
    return (
      <div className="new-course">
        <Wizard isLoading={this.loader.isBusy} />
      </div>
    );
  }

}
