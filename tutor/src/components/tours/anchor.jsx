import React from 'react';
import { inject, observer } from 'mobx-react';
import { extend } from 'lodash';
import TourContext from '../../models/tour/context';
import cn from 'classnames';

@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
export default class TourAnchor extends React.PureComponent {

  static defaultProps = {
    tag: 'div',
    className: '',
    tourContext: null,
  }

  static propTypes = {
    tag: React.PropTypes.string,
    className: React.PropTypes.string,
    id: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
    tourContext: React.PropTypes.instanceOf(TourContext),
  }

  componentDidMount() {
    if (this.props.tourContext) {
      this.props.tourContext.addAnchor(this.props.id, `[data-tour-anchor-id="${this.props.id}"]`);
    }
  }

  componentWillUnmount() {
    if (this.props.tourContext) {
      this.props.tourContext.removeAnchor(this.props.id);
    }
  }

  render() {
    const { tag, className, tourContext: _, ...otherProps } = this.props;
    return React.createElement(tag, extend({
      className: cn('tour-anchor', className),
      'data-tour-anchor-id': this.props.id,
      ref: ref => (this.wrapperEl = ref),
    }, otherProps), this.props.children);
  }

}
