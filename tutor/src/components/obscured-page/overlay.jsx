import PropTypes from 'prop-types';
import { React, observer } from 'vendor';
import { pick } from 'lodash';
import { DefaultRegistry, OverlayRegistry } from './overlay-registry';

@observer
export default
class Overlay extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    renderer: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    registry: PropTypes.instanceOf(OverlayRegistry),
  }

  static defaultProps = {
    registry: DefaultRegistry,
  }

  propsToRegistry() {
    this.props.registry.setOverlay(pick(this.props, 'id', 'visible', 'onHide', 'renderer'));
  }

  componentDidMount() {  this.propsToRegistry(); }
  componentDidUpdate() { this.propsToRegistry(); }

  render() {
    return null;
  }

}
