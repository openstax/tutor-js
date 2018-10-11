import { React, observer } from '../../helpers/react';
import { DefaultRegistry, OverlayRegistry } from './overlay-registry';

@observer
export default class Overlay extends React.Component {

  static propTypes = {
    id: React.PropTypes.string.isRequired,
    visible: React.PropTypes.bool.isRequired,
    children: React.PropTypes.func.isRequired,
    registry: React.PropTypes.instanceOf(OverlayRegistry),
  }

  static defaultProps = {
    registry: DefaultRegistry,
  }

  propsToRegistry() {
    this.props.registry.setOverlay({
      id: this.props.id,
      visible: this.props.visible,
      renderer: this.props.children,
    });
  }

  // componentWillmount() {
  //   this.propsToRegistry();
  // }


  componentDidMount() {  this.propsToRegistry(); }
  componentDidUpdate() { this.propsToRegistry(); }


  render() {
    return null;
  }

}
