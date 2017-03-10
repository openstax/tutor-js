import React from 'react';
import observable from 'mobx';
import { Provider, observer } from 'mobx-react';
import { pick } from 'lodash';

import TourContext from '../../models/tour/context';

@observer
export default class TourWrapper extends React.PureComponent {

  static defaultProps = {
    courseId: false,
  }

  static propTypes = {
    tourIds: React.PropTypes.arrayOfType(React.PropTypes.string).isRequired,
    children: React.PropTypes.node.isRequired,
    courseId: React.PropTypes.string,
  }

  @observable tourContext;

  constructor(props) {
    super(props);
    this.tourContext = new TourContext(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.tourContext.update(nextProps);
  }

  componentWillUnmount() {
    this.tourContext.shutdown();
  }

  renderCurrentTour() {
    const { tour } = this.tourContext;
    if (tour) {

    }
  }

  render() {
    return (
      <Provider tour={this.tour}>
      {this.renderCurrentTour()}
        {this.props.children}
      </Provider>
    );
  }

}
