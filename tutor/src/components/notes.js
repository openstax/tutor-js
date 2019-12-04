import { React, PropTypes, observer, cn } from 'vendor';
import { observable, action, when } from 'mobx';
import Raven from '../models/app/raven';
import { autobind } from 'core-decorators';
import { Icon, Logging } from 'shared';
import { last, debounce } from 'lodash';
import SummaryPage from './notes/summary-page';
import dom from '../helpers/dom';
import Router from '../helpers/router';
import imagesComplete from '../helpers/images-complete';
import Course from '../models/course';
import { PageNotes } from '../models/notes';
import EditBox from './notes/edit-box';
import NotesUX from '../models/notes/ux';
import SidebarButtons from './notes/sidebar-buttons';
import InlineControls from './notes/inline-controls';
import ScrollTo from '../helpers/scroll-to';
import Highlighter from '@openstax/highlighter';
import Page from '../models/reference-book/page';
import { Modal } from 'react-bootstrap';
import scrollIntoView from 'scroll-into-view';

const ignoreMutation = (m) => m.target.matches('.tutor-highlight,.MathJax,.MathJax_Preview,.media-preview-wrapper');

export default
class NotesWidgetWrapper extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    children: PropTypes.node.isRequired,
    windowImpl: PropTypes.shape({
      open: PropTypes.func,
      document: PropTypes.object,
    }),
    page: PropTypes.instanceOf(Page).isRequired,
  };

  constructor(props) {
    super(props);
    props.course.notes.ensurePageExists(props.page);
  }

  render() {
    const { course, page } = this.props;

    if (!course || !course.canAnnotate) { return this.props.children; }

    return (
      <NotesWidget
        key={`${course.id}.${page.id}`}
        notes={course.notes.forPage(page)}
        {...this.props}
      />
    );
  }

}

@observer
class NotesWidget extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    notes: PropTypes.instanceOf(PageNotes).isRequired,
    children: PropTypes.node.isRequired,
    windowImpl: PropTypes.shape({
      open: PropTypes.func,
      MutationObserver: PropTypes.func,
      document: PropTypes.object,
      getSelection: PropTypes.func,
      pageXOffset: PropTypes.number,
      pageYOffset: PropTypes.number,
    }),
    page: PropTypes.instanceOf(Page).isRequired,
  };

  static defaultProps = {
    windowImpl: window,
  };

  scrollHelper = new ScrollTo({ windowImpl: this.props.windowImpl, scrollingTargetClass: false });
  highlightScrollHandler = elements => this.scrollHelper.scrollToElement(last(elements), {
    scrollTopOffset: (window.innerHeight / 2) - 80,
  });

  @observable isMounted = false;
  @observable scrollToPendingNote;
  @observable highlighter;
  @observable activeNote;
  @observable pendingHighlight;

  componentDidMount() {
    this.isMounted = true;
    if (!this.props.course.canAnnotate) { return; }
    when(
      () => !this.props.notes.api.isPending,
      this.initializePage,
    );
  }

  componentWillUnmount() {
    if (this.highlighter) {
      this.highlighter.unmount();
    }
    this.isMounted = false;
  }

  setupPendingHighlightScroll(highlightId) {
    this.scrollToPendingNote = () => {
      const highlight = this.highlighter.getHighlight(highlightId);
      this.highlighter.clearFocus();
      if (highlight) {
        highlight.focus().scrollTo(this.highlightScrollHandler);
      } else {
        Logging.error(`Page attempted to scroll to note id '${highlightId}' but it was not found`);
      }
      this.scrollToPendingNote = null;
    };
  }

  async waitForPageReady() {
    await imagesComplete({ body: this.documentRoot });
    return new Promise(r => {
      when(
        () => !this.props.notes.api.isPending,
        r,
      );
    });
  }

  initializeHighlighter() {
    // if page changes quickly and then unmounts
    // a debounced call may be pending
    if (!this.isMounted) {
      return;
    }

    if (this.highlighter) {
      this.highlighter.eraseAll();
      this.highlighter.unmount();
    }

    // create a new highlighter
    this.highlighter = new Highlighter(this.documentRoot, {
      snapTableRows: true,
      snapMathJax: true,
      snapWords: true,
      className: 'tutor-highlight',
      onClick: this.onHighlightClick,
      onSelect: this.onHighlightSelect,
    });

    this.props.notes.forEach(note => {
      try {
        this.highlighter.highlight(note.highlight);
      } catch(error) {
        console.warn(error); // eslint-disable-line no-console
      }
    });
    // scroll if needed
    if (this.scrollToPendingNote && !this.props.notes.isEmpty) {
      this.scrollToPendingNote();
    }

  }

  initializePage = debounce(async () => {
    if (!this.isMounted) {
      return;
    }
    NotesUX.statusMessage.show({
      type: 'info',
      message: 'Waiting for page to finish loading…',
    });

    const { highlight } = Router.currentQuery();
    if (highlight && !this.scrollToPendingNote ) {
      this.setupPendingHighlightScroll(highlight);
    }
    try {
      await this.waitForPageReady();

      // create and attach notes to highlghter
      this.initializeHighlighter();

      NotesUX.statusMessage.hide();
    } catch(err) {
      // ignore errors that happened due to unmount
      if (this.isMounted) {
        Raven.captureException(err);
      }
    }
  }, 100)

  @action.bound onHighlightClick(highlight) {
    const note = highlight ? this.props.notes.get(highlight.id) : null;
    this.pendingHighlight = null;
    this.activeNote = note;

    this.highlighter.clearFocus();
    if (highlight) {
      highlight.focus().scrollTo(this.highlightScrollHandler);
    }
  }

  cantHighlightReason(highlights, highlight) {
    if (highlights.length > 0) {
      return 'Highlights cannot overlap one another';
    }
    const node = dom(highlight.range.commonAncestorContainer);

    if (!node.closest('.book-content')) {
      return 'Only content can be highlighted';
    }

    for (const re of this.referenceElements) {
      if (dom(re).isParent(node.el)) {
        return null;
      }
    }

    return 'Only content that is enclosed in paragraphs can be highlighted';
  }

  @action.bound onHighlightSelect(highlights, highlight) {
    this.activeNote = null;
    const error = this.cantHighlightReason(highlights, highlight);

    if (error) {
      this.pendingHighlight = null;
      NotesUX.statusMessage.show({ message: error, autoHide: true });
    } else {
      this.pendingHighlight = highlight;
      NotesUX.statusMessage.hide();
    }
  }

  get documentRoot() {
    const doc = this.props.windowImpl.document;
    return doc.querySelector('[data-type="composite-page"]') || doc.querySelector('.book-content') || doc;
  }

  get referenceElements() {
    return Array.from(this.documentRoot.children)
      .filter(e => e.matches('[id]'))
      .reverse();
  }

  @autobind
  highlightAndClose() {
    return this.saveNewHighlight().then(
      action(note => {
        this.props.windowImpl.getSelection().removeAllRanges();
        this.pendingHighlight = null;
        this.highlighter.highlight(note.highlight);
        return note;
      }));
  }

  @autobind
  openAnnotator() {
    return this.highlightAndClose().then(note => this.activeNote = note);
  }

  @autobind
  saveNewHighlight() {
    const highlight = this.pendingHighlight;

    const referenceElement = this.referenceElements
      .find(re => dom(re).isParent(
        highlight.range.commonAncestorContainer)
      );

    const serializedHighlight = highlight.serialize(referenceElement);

    return this.props.notes.create({
      anchor: `#${referenceElement.id}`,
      title: this.props.page.title,
      page: this.props.page,
      rect: dom(highlight.range).boundingClientRect,
      ...serializedHighlight.data,
    });
  }

  getNoteByOffset(offset) {
    const note = this.activeNote;
    if (!note) {
      return null;
    }
    const highlight = this.highlighter.getHighlight(note.id);
    if (!highlight) {
      return null;
    }

    const highlights = this.highlighter.getHighlights();
    const targetIndex = highlights.indexOf(highlight) + offset;

    if (!highlights[targetIndex]) {
      return null;
    }

    const targetNoteId = highlights[targetIndex].id;

    return this.props.notes.get(targetNoteId);
  }

  get nextNote() {
    return this.getNoteByOffset(1);
  }

  get previousNote() {
    return this.getNoteByOffset(-1);
  }

  @action.bound onMutations(mutationsList) {
    // ignore muatations caused by highlights or mathjax
    if (!mutationsList.find(ignoreMutation)) {
      this.initializePage();
    }
  }

  @action.bound setElement(el) {
    if (this.contentObserver) {
      this.contentObserver.disconnect();
      this.contentObserver = null;
    }
    this.element = el;
    if (this.element) {
      this.contentObserver = new this.props.windowImpl.MutationObserver(this.onMutations);
      this.contentObserver.observe(el, { childList: true, subtree: true });
    }
  }

  get parentRect() {
    if (!this.element) {
      return { top: 0, bottom: 0, left: 0, right: 0 };
    }
    const wLeft = this.props.windowImpl.pageXOffset;
    const wTop = this.props.windowImpl.pageYOffset;
    const parentRect =  this.element.getBoundingClientRect();
    return {
      bottom: wTop + parentRect.bottom,
      left: wLeft + parentRect.left,
      right: wLeft + parentRect.right,
      top: wTop + parentRect.top,
    };
  }

  @action.bound seeAll() {
    NotesUX.isSummaryVisible = true;
    this.activeNote = null;
  }

  @action.bound editNote(note) {
    this.activeNote = note;

    this.highlighter.clearFocus();
    const highlight = this.highlighter.getHighlight(note.id);
    if (highlight) {
      highlight.focus().scrollTo(this.highlightScrollHandler);
    }
  }

  @action.bound hideActiveHighlight() {
    this.activeNote = null;
  }

  @action.bound onNoteDelete(note) {
    const highlight = this.highlighter.getHighlight(note.id);
    if (highlight) {
      this.highlighter.erase(highlight);
    }
  }

  @action.bound onModalScollTop() {
    scrollIntoView(document.querySelector('.modal-body .filter-area'), {
      time: 300,
      validTarget: (target) => {
        return target !== window && target.matches('.modal-body');
      },
    });
  }

  renderStatusMessage() {
    if (!NotesUX.statusMessage.display) { return null; }

    return (
      <div
        className={cn('status-message-toast', NotesUX.statusMessage.type)}
      >
        <Icon type={NotesUX.statusMessage.icon} /> {NotesUX.statusMessage.message}
      </div>
    );
  }

  render() {

    return (
      <div className="annotater">
        <EditBox
          note={this.activeNote}
          onHide={this.hideActiveHighlight}
          onDelete={this.onNoteDelete}
          goToNote={this.editNote}
          next={this.nextNote}
          previous={this.previousNote}
          seeAll={this.seeAll}
        />
        <SidebarButtons
          windowImpl={this.props.windowImpl}
          highlighter={this.highlighter}
          notes={this.props.notes}
          parentRect={this.parentRect}
          onClick={this.editNote}
          activeNote={this.activeNote}
        />

        <InlineControls
          pendingHighlight={this.pendingHighlight}
          windowImpl={this.props.windowImpl}
          parentRect={this.parentRect}
          annotate={this.openAnnotator}
          highlight={this.highlightAndClose}
        />

        <div className="annotater-content" ref={this.setElement}>
          <Modal
            show={NotesUX.isSummaryVisible}
            onHide={NotesUX.hideSummary}
            dialogClassName="notes-modal"
            scrollable={true}
          >
            <Modal.Header
              closeButton={true}
              closeLabel={'Close'}
            >
              <Modal.Title>My Highlights and Notes</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SummaryPage
                notes={this.props.course.notes}
                onDelete={this.onNoteDelete}
                page={this.props.page}
              />
              <Icon
                type="angle-up"
                buttonProps={{ bsPrefix: "modal-scroll-btn" }}
                color="#fff"
                aria-label="Scroll to top"
                onClick={this.onModalScollTop}
              />
            </Modal.Body>
          </Modal>
          {this.props.children}
        </div>
        {this.renderStatusMessage()}
      </div>
    );
  }

}
