import { React, PropTypes, inject, observer } from 'vendor';
import { extend } from 'lodash';
import TourContext from '../../models/tour/context';
import cn from 'classnames';
import { ReactHelpers } from 'shared';

export default
@inject((allStores, props) => ({
  tourContext: ( props.tourContext || allStores.tourContext ),
}))
@observer
class TourAnchor extends React.Component {

  static defaultProps = {
    tag: 'div',
    className: '',
    tourContext: null,
  }

  static propTypes = {
    tag: PropTypes.string,
    className: PropTypes.string,
    id: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    tourContext: PropTypes.instanceOf(TourContext),
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
    const { id, tag, className, tourContext: _, ...otherProps } = this.props;

    return React.createElement(tag, extend({
      className: cn('tour-anchor', className),
      'data-tour-anchor-id': id,
      ref: ref => (this.wrapperEl = ref),
    }, ReactHelpers.filterProps(otherProps)), this.props.children);
  }

}
