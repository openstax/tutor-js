import { React, PropTypes, createRef } from 'vendor';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { compact, clone } from 'lodash';

export default
class TutorPopover extends React.Component {
    static defaultProps = {
        maxHeightMultiplier: 0.75,
        maxWidthMultiplier: 0.75,
        windowImpl: window,
    };

    static propTypes = {
        id: PropTypes.any,
        children: PropTypes.node,
        title: PropTypes.string,
        content: PropTypes.node.isRequired,
        popoverProps: PropTypes.object,
        contentProps: PropTypes.object,
        overlayProps: PropTypes.object,
        windowImpl: PropTypes.object,
        maxHeightMultiplier: PropTypes.number,
        maxWidthMultiplier: PropTypes.number,
    }

    popperRef = createRef<any>()
    popContentRef = createRef<HTMLDivElement>()

    state = {
        firstShow: true,
        placement: 'auto',
        show: false,
        scrollable: false,
        imagesLoading: [],
    };

    getImages = () => {
        const content = this.popContentRef.current;
        return content.querySelectorAll('img');
    };

    areImagesLoading = () => {
        return compact(this.state.imagesLoading).length !== 0;
    };

    hide = () => {
        this.setState({ show: false });
        return this.popper.hide();
    };

    imageLoaded = (iter) => {
        const { imagesLoading } = this.state;

        const currentImageStatus = clone(imagesLoading);
        currentImageStatus[iter] = false;

        return this.setState({ imagesLoading: currentImageStatus });
    };

    show = () => {
        this.setState({ show: true });
        return this.popper.show();
    };

    get popper() {
        return this.popperRef.current
    }

    render() {
        let contentClassName;
        let {
            children, content, popoverProps, overlayProps, id, title,
        } = this.props;
        const { scrollable, placement } = this.state;

        if (scrollable) {
            popoverProps = clone(popoverProps || {});
            if (popoverProps.className == null) { popoverProps.className = ''; }
            popoverProps.className += ' scrollable';
        }

        if (this.areImagesLoading()) {
            contentClassName = 'image-loading';
        }

        content = React.cloneElement(content, { className: contentClassName });
        const popoverId = `tutor-popover-${id || 'unknown'}`;

        const popover = (
            <Popover
                {...popoverProps}
                id={popoverId}
            >
                {title && <Popover.Title>{title}</Popover.Title>}
                <Popover.Content>
                    <div ref={this.poperContentRef}>
                        {content}
                    </div>
                </Popover.Content>
            </Popover>
        );

        return (
            <OverlayTrigger {...overlayProps} placement={placement} overlay={popover} ref={this.popperRef}>
                {children}
            </OverlayTrigger>
        );
    }
}
