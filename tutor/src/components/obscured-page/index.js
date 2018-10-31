import { React, action, observer, cn } from '../../helpers/react';
import styled, { css } from 'styled-components';
import keymaster from 'keymaster';
import { DefaultRegistry, OverlayRegistry } from './overlay-registry';

const Overlay = styled.div`
  display: flex;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: 0%;
  z-index: 20;
  overflow: auto;
  transition: height 0.4s;
  ${props => props.isHidden && css`
    display: none;
  `}
  ${props => props.isExpanded && css`
    height: 100%;
  `}
`;

@observer
export default class ObscuredPage extends React.Component {

  static propTypes = {
    children: React.PropTypes.node.isRequired,
    registry: React.PropTypes.instanceOf(OverlayRegistry),
  }

  static defaultProps = {
    registry: DefaultRegistry,
  }

  @action.bound setPage(el) {
    this.props.registry.page = el;
  }


  componentDidMount() {
    keymaster('esc', this.props.registry.onEscKey);
  }

  componentWillUnmount() {
    keymaster.unbind('esc', this.props.registry.onEscKey);
  }

  get ariaLiveProps() {
    return this.props.registry.isOverlayExpanded ? {
      'aria-live': 'polite',
      'aria-atomic': 'true',
      'aria-relevant': 'additions',
    } : {};
  }

  render() {
    const { registry, children } = this.props;

    return (
      <div className="obscured-page">
        <div className={registry.pageClassName}>{children}</div>
        <Overlay
          isExpanded={registry.isOverlayExpanded}
          isHidden={registry.isOverlayHidden}
          onTransitionEnd={registry.onOverlayAnimated}
          className={registry.overlayClassName}
          {...this.ariaLiveProps}
        >
          {registry.overlay}
        </Overlay>
      </div>
    );
  }

}
