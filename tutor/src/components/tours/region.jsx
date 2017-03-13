import React from 'react';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import invariant from 'invariant';
import TourRegionModel from '../../models/tour/region';
import TourContext from '../../models/tour/context';


@inject('tourContext') @observer
export default class TourRegion extends React.PureComponent {

  static defaultProps = {
    courseId: undefined,
  }

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    courseId: React.PropTypes.string,
    children: React.PropTypes.node.isRequired,
    tourContext: React.PropTypes.instanceOf(TourContext).isRequired,
  }

  constructor(props) {
    super(props);
    this.region = TourRegionModel.forIdentifier(this.props.id);
    invariant(this.region, `Region for ID: ${this.props.id} was not found`);
  }

  componentDidMount() {
    this.region.el = this.wrapperEl;
    this.props.tourContext.openRegion(this.region, this.props);
  }

  // not really sure this is needed, but we may update the courseId somwhere
  componentWillReceiveProps({ id, ...otherProps }) {
    invariant(id === this.props.id,
              `Cannot update region id, was ${this.props.id} attempted to set ${id}`);
    this.region.courseId = otherProps.courseId;
  }

  componentWillUnmount() {
    this.props.tourContext.closeRegion(this.region);
  }

  render() {
    return (
      <div data-tour-region-id={this.props.id} ref={ref => (this.wrapperEl = ref)}>
        {this.props.children}
      </div>
    );
  }

}
