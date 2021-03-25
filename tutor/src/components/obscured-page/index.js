import {
    React, action, observer, PropTypes, styled, css,
} from 'vendor';
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

const Page = styled.div`
  ${props => props.isHidden && 'display: none'};
`;

@observer
export default class ObscuredPage extends React.Component {

    static propTypes = {
        children: PropTypes.node.isRequired,
        registry: PropTypes.instanceOf(OverlayRegistry),
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

    render() {
        const { registry, children } = this.props;

        return (
            <div className="obscured-page">
                <Page
                    isHidden={registry.isPageHidden}
                    className={registry.pageClassName}
                >{children}</Page>
                <Overlay
                    isExpanded={registry.isOverlayExpanded}
                    isHidden={registry.isOverlayHidden}
                    onTransitionEnd={registry.onOverlayAnimated}
                    className={registry.overlayClassName}
                >
                    {registry.overlay}
                </Overlay>
            </div>
        );
    }

}
