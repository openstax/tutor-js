import React from 'react';
import observable from 'mobx';
import { Provider, observer } from 'mobx-react';
import { extend } from 'lodash';

import TourContext from '../../models/tour/context';

@observer
export default class TourWrapper extends React.PureComponent {

  static defaultProps = {
    courseId: false,
  }

  static propTypes = {
    courseId: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
  }

  @observable tour;

  constructor(props) {
    super(props);
    this.tour = new TourContext(extend({}, props, { wrapper: this }));
  }

  componentWillReceiveProps(nextProps) {
    this.tour.update(nextProps);
  }

  componentWillUnmount() {
    this.tour.shutdown();
  }

  render() {

    return (
      <Provider tour={this.tour}>
        <Tour tour={this.tour} />
        {this.props.children}
      </Provider>
    );
  }

}
