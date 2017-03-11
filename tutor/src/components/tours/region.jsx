import React from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';

import TourContext from '../../models/tour/context';


@inject('tourContext') @observer
export default class TourRegion extends React.PureComponent {

  static defaultProps = {
    courseId: false,
  }

  static propTypes = {
    tourIds: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
    children: React.PropTypes.node.isRequired,
    courseId: React.PropTypes.string,
    tourContext: React.PropTypes.instanceOf(TourContext).isRequired,
  }

  constructor(props) {
    super(props);
//    this.tourContext = new TourContext(this.props);
  }
  //
  //   componentWillReceiveProps(nextProps) {
  //     this.tourContext.update(nextProps);
  //   }

  componentWillUnmount() {
    this.tourContext.shutdown();
  }

  render() {
    return (
      {this.props.children}
    );
  }

}
