import { React, ReactDOM, createRef, observer } from 'vendor'
import TutorPopover from './tutor-popover';
import { ArbitraryHtmlAndMath } from 'shared';
import { omit, pick } from 'lodash'
import { currentMedia, Media } from '../models'
import S from '../helpers/string';

function getTargetClassList(el) {
    if (el.parentElement && el.parentElement.matches('.os-figure')) {
        return el.parentElement.classList;
    }
    return el.classList;
}

interface MediaPreviewProps {
    mediaId: string
    mediaStore: Media
    bookHref: string
    cnxId: string
    mediaDOMOnParent?: any
    windowImpl?: Window
    buffer?: number
    shouldLinkOut?: boolean
    originalHref?: string
    html?: string
}

@observer
export default
class MediaPreview extends React.Component<MediaPreviewProps> {

    static defaultProps = {
        buffer: 160,
        shouldLinkOut: false,
        windowImpl: window,
        trigger: 'focus',
        mediaStore: currentMedia,
    };

    static displayName = 'MediaPreview';
    overlayRef = createRef<TutorPopover>()

    state = {
        popped: false,
        stick: false,
    };

    onMouseEnter = (mouseEvent) => {
        mouseEvent.preventDefault();
        return this.showMedia();
    };

    onMouseLeave = (mouseEvent) => {
        mouseEvent.preventDefault();
        if (this.isMouseExited(mouseEvent)) { this.hideMedia(); }
    };

    getLinkProps = (otherProps) => {
        const { mediaId, mediaDOMOnParent, bookHref, shouldLinkOut, originalHref } = this.props;
        const { media } = this;

        const linkProps = pick(otherProps, ['href', 'class'])
        linkProps['data-targeted'] = 'media';

        if (mediaDOMOnParent != null) {
            linkProps.href = `#${mediaId}`;
        } else if (media && shouldLinkOut) { // or not media
            linkProps.href = bookHref;
            if (mediaId) { linkProps.href += `#${mediaId}`; }
            linkProps.target = '_blank';
        } else if (!media) {
            linkProps.href = originalHref;
            linkProps.target = '_blank';
        }

        linkProps.onMouseEnter = this.onMouseEnter;
        linkProps.onMouseLeave = this.onMouseLeave;

        const defaultClassName = 'media-preview-link';
        if (linkProps.className != null) { linkProps.className += ` ${defaultClassName}`; }
        if (linkProps.className == null) { linkProps.className = defaultClassName; }

        return linkProps;
    };

    getOverlayProps = () => {
        return pick(this.props, 'containerPadding', 'trigger');
    };

    checkShouldPop = () => {
        if (!this.props.mediaDOMOnParent) { return true; }
        return !this.isMediaInViewport();
    };

    hideMedia = () => {
        if (this.state.popped) {
            if (!this.state.stick) {
                this.setState({ popped: false });
                this.overlayRef.current.hide();
            }
        } else {
            this.unhighlightMedia();
        }
    };

    highlightMedia = () => {
        const { mediaDOMOnParent } = this.props;
        return (mediaDOMOnParent != null ? getTargetClassList(mediaDOMOnParent).add('link-target') : undefined);
    };

    isMediaInViewport = () => {
        let middle;
        const { mediaDOMOnParent, buffer, windowImpl } = this.props;
        const mediaRect = mediaDOMOnParent != null ? mediaDOMOnParent.getBoundingClientRect() : undefined;

        return 0 <= ((middle = mediaRect.top + buffer)) && middle <= windowImpl.innerHeight;
    };

    // check that mouse has exited both the link and the overlay
    isMouseExited = (mouseEvent) => {
        if (
            ((mouseEvent.relatedTarget != null ? mouseEvent.relatedTarget.nodeType : undefined) == null)
            || (!this.overlayRef.current?.popover)
        ) {
            return true;
        }
        const linkDOM = ReactDOM.findDOMNode(this.overlayRef.current?.popper);
        const popoverDOM = ReactDOM.findDOMNode(this.overlayRef.current?.popover);
        return !(popoverDOM.contains(mouseEvent.relatedTarget) || linkDOM.isEqualNode(mouseEvent.relatedTarget));
    };

    showMedia = () => {
        if (this.state.stick) { return; }
        const shouldPop = this.checkShouldPop();
        if (shouldPop) {
            if (!this.state.popped) {
                this.setState({ popped: true });
                this.overlayRef.current.show();
            }
        } else {
            this.highlightMedia();
        }
    };

    stickMedia = () => {
        this.setState({ stick: true });
        if (!this.state.popped) {
            this.setState({ popped: true });
            this.overlayRef.current.show();
        }
    };

    unhighlightMedia = () => {
        const { mediaDOMOnParent } = this.props;
        return (mediaDOMOnParent != null ? getTargetClassList(mediaDOMOnParent).remove('link-target') : undefined);
    };

    get media() {
        return this.props.mediaStore.get(this.props.mediaId)
    }

    render() {
        const { html, windowImpl } = this.props;
        const media = this.media
        const overlayProps = this.getOverlayProps();
        let linkProps = this.getLinkProps(overlayProps);

        if (media != null) {
            let linkText;
            const contentHtml = media.html;
            const contentProps = { className: 'media-preview-content' };
            const popoverProps = {
                'data-content-type': media.name,
                className: 'media-preview',
                ref: 'popover',
                onMouseLeave: this.onMouseLeave,
            };

            const content = <ArbitraryHtmlAndMath {...contentProps} html={contentHtml} />;
            const allProps = { content, overlayProps, popoverProps, windowImpl };

            if (html !== '[link]') { linkText = html; }
            if (linkText == null) { linkText = `See ${S.capitalize(media.name)}`; }

            return (
                <TutorPopover {...allProps} ref={this.overlayRef}>
                    <a {...linkProps} dangerouslySetInnerHTML={{ __html: linkText }} />
                </TutorPopover>
            );
        } else {
            linkProps = omit(linkProps, 'onMouseEnter', 'onMouseLeave');
            return (
                <a {...linkProps} dangerouslySetInnerHTML={{ __html: html }} />
            );
        }
    }
}
