import { React, observer, action, observable, modelize } from 'vendor';
import {
    get, forEach, first, last, invoke, defer, map, compact, uniq,
} from 'lodash';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router';
import { LoadingAnimation, SpyMode, ArbitraryHtmlAndMath } from 'shared';
import classnames from 'classnames';
//import { ReferenceBookExerciseShell } from './book-page/exercise';
import PageTitle from './page-title';
import NotesWidget from './notes';
import { currentCourses, currentMedia } from '../models'
import dom from '../helpers/dom';
import Router from '../helpers/router';
// import { MediaStore } from '../flux/media';
import MediaPreview from './media-preview';
import ScrollTo from '../helpers/scroll-to';
import imagesComplete from '../helpers/images-complete';
import { BookUX } from '../helpers/reference-book-base-ux'

// According to the tagging legend exercises with a link should have `a.os-embed`
// but in the content they are just a vanilla link.
const EXERCISE_LINK_SELECTOR = 'a[href][data-type="exercise"]';
const SPLASH_IMAGE_MIN_WIDTH = 400;
const LEARNING_OBJECTIVE_SELECTORS = '.learning-objectives, [data-type=abstract]';
const IS_INTRO_SELECTORS = '.splash img, [data-type="cnx.flag.introduction"]';
const INTER_BOOK_LINKS = 'a[href^=\'/book/\']';
const IMAGE_SIZE_CLASSES = [
    'full-width', 'scaled-down', 'scaled-down-60', 'full-width', 'scaled-down-30',
];

function getClosestFigureLikeElement(el) {
    return el.closest('.os-figure')
    || el.closest('figure')
    || el.closest('[data-type=media]');
}

// called with the context set to the image
function processImage() {
    const img = dom(this);
    const figure = getClosestFigureLikeElement(img);
    if (!figure) { return; }

    if (figure.querySelector('.splash')) {
        figure.classList.add('full-width');
    }
    let isScaled = false;
    for (let i = 0; i < IMAGE_SIZE_CLASSES.length; i++) {
        const cls = IMAGE_SIZE_CLASSES[i];
        if (figure.querySelector(`.${cls}`)) {
            figure.classList.add(cls);
            isScaled = true;
        }
    }

    // don't autosize splash or manually scaled images
    if (isScaled || figure.classList.contains('splash')) {
        return;
    }

    const { parentNode } = figure;
    if (parentNode && parentNode.nodeName === 'FIGURE') {
        parentNode.classList.add('with-child-figures');
    }

    this.title = this.alt;
    const aspectRatio = this.naturalWidth / this.naturalHeight;

    // let wide, square, and almost square figures be natural.
    if (
        (aspectRatio > 0.9) ||
      ((figure.parentNode != null ? figure.parentNode.dataset.orient : undefined) === 'horizontal')
    ) {

        figure.classList.add('tutor-ui-horizontal-img');
        if (this.naturalWidth < 350) {
            figure.classList.add('small-img-width');
        } else {
            figure.classList.add('medium-img-width');
        }
    } else {
        figure.classList.add('tutor-ui-vertical-img');
    }
}

async function scheduleSplashImageDetection(wrapper) {
    await imagesComplete(wrapper);
    const img = wrapper.querySelector('img');
    if (img.naturalWidth > SPLASH_IMAGE_MIN_WIDTH) {
        wrapper.classList.add('splash');
    }
}

interface BookPageProps {
    ux: BookUX,
    className?: string
    children?: any
    query?: string
    cnxId?: string
    title?: string
    history?: any
}

@withRouter
@observer
class BookPage extends React.Component<BookPageProps> {

    static displayName = 'BookPage';

    @observable needsLearningObjectivesPreamble = false;
    @observable linkContentIsMounted = false;

    scoller = new ScrollTo();

    getCnxId() {
        return this.props.ux.page.cnx_id;
    }

    constructor(props) {
        super(props);
        modelize(this);
        this.props.ux.page.ensureLoaded();
    }

    processVideo(root) {
        const video = root.querySelector('.splash-video');
        if (!video){ return; }
        const figure = getClosestFigureLikeElement(dom(video));
        if (figure) {
            figure.classList.add('splash');
            video.classList.remove('splash-video');
        }
    }

    cleanupContent(root) {
        this.detectImgAspectRatio(root);
        this.cleanUpAbstracts(root);
        this.insertSplash(root);
        this.processLinks(root);
        this.processVideo(root);
    }

    componentDidMount() {
        this.props.ux.checkForTeacherContent();
        this.linkContentIsMounted = true;
        const { root } = this;
        this.insertCanonicalLink(root);
        this.cleanupContent(root);
        if (this.props.history) {
            this.removeHistoryChangeListener = this.props.history.listen(this.scrollToSelector);
        }
        this.scrollToSelector(window.location);
    }


    componentDidUpdate() {
        const { root } = this;
        this.props.ux.page.ensureLoaded();
        this.props.ux.checkForTeacherContent();
        this.updateCanonicalLink(root);
        this.cleanupContent(root);
    }

    componentWillUnmount() {
        this.linkContentIsMounted = false;
        this.cleanUpLinks();
        invoke(this, 'removeHistoryChangeListener');
        return this.removeCanonicalLink();
    }

    getCnxIdOfHref(href) {
        const beforeHash = first(href.split('#'));
        return last(beforeHash.split('/'));
    }

    isMediaLink(link) {
        // footnotes shouldn't show a preview of themselves
        if (link.matches('[data-type="footnote-ref-link"]')) {
            return false;
        }
        return true;
    }

    hasCNXId(link) {
        const trueHref = link.getAttribute('href');
        return (link.hash.length > 0) && (trueHref.substr(0, 1) !== '#');
    }

    getMedia(mediaId) {
        const { root } = this;
        try {
            return root.querySelector(`#${mediaId}`);
        } catch (error) {
            // silently handle error in case selector is
            // still invalid.
      console.warn(error); // eslint-disable-line
            return false;
        }
    }

    cleanUpLinks() {
        const { root } = this;
        const previewNodes = root.getElementsByClassName('media-preview-wrapper');

        forEach(previewNodes, previewNode => ReactDOM.unmountComponentAtNode(previewNode));
    }

    insertSplash(root) {
        let splashFigure = root.querySelector(`${LEARNING_OBJECTIVE_SELECTORS} + figure, [data-type="document-title"] + .os-figure`);
        if (!splashFigure) { return; }

        // abort if it already has a splash element
        if (!splashFigure.querySelector('.splash')) {
            splashFigure.classList.add('splash');
        }

        while (
            (splashFigure = splashFigure.nextSibling) &&
        (!splashFigure.matches || splashFigure.matches('.os-figure'))
        ) {
            if (splashFigure.hasChildNodes() && splashFigure.querySelector) {
                scheduleSplashImageDetection(splashFigure);
            }
        }
    }

    insertCanonicalLink() {
        this.linkNode = document.createElement('link');
        this.linkNode.rel = 'canonical';
        document.head.appendChild(this.linkNode);

        return this.updateCanonicalLink();
    }

    updateCanonicalLink() {
        const cnxId = this.props.cnxId || this.getCnxId();
        // leave versioning out of canonical link
        const canonicalCNXId = first(cnxId.split('@'));

        const { courseId, ecosystemId } = Router.currentParams();
        const course = courseId ? currentCourses.get(courseId) : currentCourses.forEcosystemId(ecosystemId);
        if (!course) { return; }
        const { webview_url } = course;
        if (!webview_url) { return; }
        const baseWebviewUrl = first(webview_url.split('/contents/'));

        // webview actually links to webview_url as it's canonical url.
        // will need to ask them why.
        this.linkNode.href = `${baseWebviewUrl}/contents/${canonicalCNXId}`;
    }

    removeCanonicalLink() {
        return invoke(this.linkNode, 'remove');
    }

    @action cleanUpAbstracts(root) {
        const abstract = root.querySelector(LEARNING_OBJECTIVE_SELECTORS);
        // dont clean up if abstract does not exist or if it has already been cleaned up
        if ((abstract == null) || !abstract.dataset || (abstract.dataset.isIntro != null)) { return; }
        abstract.classList.add('learning-objectives');
        for (let abstractChild of abstract.childNodes) {
            // leave the list alone -- this is the main content
            if ((abstractChild == null) || (abstractChild.tagName === 'UL')) { continue; }

            const text = (abstractChild.textContent || '').trim();

            // grab text if relevant and set as preamble
            if (((abstractChild.dataset != null ? abstractChild.dataset.type : undefined) !== 'title') && text) {
                abstract.dataset.preamble = text;
            }

            // remove all non-lists children to prevent extra text in preamble
            if (true !== invoke(abstractChild, 'matches', '[data-type="title"]')) {
                invoke(abstractChild, 'remove');
            }
        }

        abstract.dataset.isIntro = (root.querySelector(IS_INTRO_SELECTORS) != null);
        this.needsLearningObjectivesPreamble = !abstract.dataset.isIntro && !abstract.dataset.preamble && !abstract.querySelector('p');
    }

    detectImgAspectRatio(root) {
        forEach(root.querySelectorAll('figure img'), (img) =>
            img.complete ? processImage.call(img) : (img.onload = processImage));
    }

    linkPreview(link) {
        let mediaDOM;
        const mediaId = link.hash.replace('#', '');
        if (mediaId) { mediaDOM = this.getMedia(mediaId); }

        // no need to set up media preview if
        // media id is invalid.
        if (mediaDOM === false) { return link; }

        const mediaCNXId = this.getCnxIdOfHref(link.getAttribute('href')) ||
              this.props.cnxId ||
              this.getCnxId();

        const previewNode = document.createElement('span');
        previewNode.classList.add('media-preview-wrapper');
        if (link.parentNode != null) {
            link.parentNode.replaceChild(previewNode, link);
        }

        const mediaProps = {
            mediaId,
            cnxId: mediaCNXId,
            bookHref: this.props.ux.bookLinkFor(this.props),
            mediaDOMOnParent: mediaDOM,
            shouldLinkOut: true,
            originalHref: link.getAttribute('href'),
        };

        const mediaPreview = (
            <MediaPreview {...mediaProps} html={link.innerHTML} />
        );

        ReactDOM.render(mediaPreview, previewNode);
        return null;
    }

    processLink(link) {
        if (this.isMediaLink(link)) {
            return this.linkPreview(link);
        } else {
            return link;
        }
    }

    processLinks() {
        defer(() => {
            if (!this.linkContentIsMounted) { return; }
            const { root } = this;
            const mediaLinks = root.querySelectorAll(currentMedia.selector);
            const exerciseLinks = root.querySelectorAll(EXERCISE_LINK_SELECTOR);
            const otherLinks = uniq(compact(map(mediaLinks, l => this.processLink(l))));

            if (otherLinks != null ? otherLinks.length : undefined) {
                if (typeof this.renderOtherLinks === 'function') {
                    this.renderOtherLinks(otherLinks);
                }
            }
            if (exerciseLinks != null ? exerciseLinks.length : undefined) {
                if (typeof this.renderExercises === 'function') {
                    this.renderExercises(exerciseLinks);
                }
            }

            forEach(root.querySelectorAll(INTER_BOOK_LINKS), link => {
                link.target = '_self';
                this.props.ux.rewriteBookLink(link);
            });
        });
    }

    get root() {
        return ReactDOM.findDOMNode(this);
    }

    @action.bound scrollToSelector(location) {
        if (!location.hash) { return; }
        imagesComplete(this.root)
            .then(() => {
                this.scoller.scrollToSelector(location.hash, {
                    scrollTopOffset: 100,
                    updateHistory: false,
                });
            });
    }

    renderExercises(exerciseLinks) {
        // ReferenceBookExerciseStore.setMaxListeners(exerciseLinks.length);
        // const links = map(exerciseLinks, 'href');
        // if (!ReferenceBookExerciseStore.isLoaded(links)) { ReferenceBookExerciseActions.loadMultiple(links); }

        return forEach(exerciseLinks, this.renderExercise);
    }

    renderExercise(link) {
        //const exerciseAPIUrl = link.href;
        const exerciseNode = link.parentNode.parentNode;
        if (exerciseNode != null) {
            //return ReactDOM.render(<ReferenceBookExerciseShell exerciseAPIUrl={exerciseAPIUrl} />, exerciseNode);
        }
        return null;
    }

    render() {
        let isLoading;
        let { title, ux, ux: { page } } = this.props;

        if (!page || page.api.isPending) {
            if (ux.lastSection) {
                isLoading = true;
                page = ux.pages.byChapterSection.get(ux.lastSection);
            } else {
                return <LoadingAnimation />;
            }
        }

        return (
            <div
                className={classnames('book-page', this.props.className, {
                    'page-loading loadable is-loading': isLoading,
                    'book-is-collated': page.bookIsCollated,
                })}
                {...ux.courseDataProps}
            >
                {this.props.children}
                <div className="page center-panel">
                    <PageTitle
                        page={page}
                        title={title}
                        contentId={page.cnx_id}
                        chapter_section={page.chapter_section}
                        showObjectivesPreamble={this.needsLearningObjectivesPreamble}
                        isChapterSectionDisplayed={page.isChapterSectionDisplayed}
                    />
                    <NotesWidget
                        course={ux.course}
                        page={page}
                        windowImpl={ux.windowImpl}
                        documentId={page.cnx_id}
                    >
                        <ArbitraryHtmlAndMath
                            className="book-content"
                            block={true}
                            html={page.contents}
                        />
                    </NotesWidget>
                </div>
                <SpyMode.Content className="ecosystem-info">
          Page: {page.cnx_id}, Book: {get(page,'chapter.book.cnx_id')} Ecosystem: {get(page,'chapter.book.uuid')}
                </SpyMode.Content>

            </div>
        );
    }

}

export default BookPage;
