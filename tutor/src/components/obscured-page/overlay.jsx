import { pick } from 'lodash';
import { React, observer } from '../../helpers/react';
import { DefaultRegistry, OverlayRegistry } from './overlay-registry';

@observer
export default class Overlay extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool.isRequired,
    renderer: React.PropTypes.func.isRequired,
    onHide: React.PropTypes.func.isRequired,
    registry: React.PropTypes.instanceOf(OverlayRegistry),
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
