import { React, PropTypes, styled, observer } from '../../helpers/react';

const Wrapper = styled.div`
  cursor: default;
  pointer-events: auto;
  position: fixed;
  z-index: 1500;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
`;

const Hole = styled.div`
  border-radius: 4px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 0, 0, 0.5);
  position: absolute;
`;

export default
@observer
class TourSpotlight extends React.Component {

  static propTypes = {
    step: PropTypes.object.isRequired,
    ride: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
  }

  state = {
    position: null,
  }

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
    setTimeout(this.updatePosition);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidUpdate(oldProps) {
    if (oldProps.step !== this.props.step) {
      this.updatePosition();
    }
  }

  updatePosition = () => {

    if (!this._isMounted) { return; }

    const element = this.props.step.element ||
          this.props.ride.region.element;
    if (!element) { return; }

    const { spotLightPadding } = this.props.step;

    const rect = element.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    this.setState({
      position: {
        top: (rect.top + scrollTop) - spotLightPadding,
        left: (rect.left + scrollLeft) - spotLightPadding,
        width: rect.width + (spotLightPadding * 2),
        height: rect.height + (spotLightPadding * 2),
      },
    });
  }

  onClick(ev) {
    // react-bootstrap menu's use native browser events
    // so we need to access and cancel it
    ev.nativeEvent.stopImmediatePropagation();
  }

  render() {
    const { position } = this.state;

    return (
      <Wrapper onClick={this.onClick}>
        <Hole style={position} />
        {this.props.children}
      </Wrapper>
    );
  }


}
