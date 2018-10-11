import { React, action, observer } from '../../helpers/react';
import { DefaultRegistry, OverlayRegistry } from './overlay-registry';
import styled from 'styled-components';

const PageWrapper = styled.div`
  .overlay {
     display: flex;
     position: fixed;
     left: 0;
     right: 0;
     top: 0;
     height: 0%;
     z-index: 20;
overflow: hidden;
     transition: height 3s;
border: 1px solid red;
     &.visible {
        height: 100%;
     }
  }
`

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
  //
  //   componentDidMount() {
  //     this.props.registry.renderPage(this.props.children);
  //   }

  componentWillUnmount() {
    this.props.registry.closePage();
  }

  render() {
    const { registry } = this.props;

//

    return (
      <PageWrapper className="obscured-page">
        <div className={registry.pageClassName}>{this.props.children}</div>
        <div className={registry.overlayClassName}>{registry.overlay}</div>
      </PageWrapper>
    );
  }

}
