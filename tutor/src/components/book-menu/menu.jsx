import { React, cn, PropTypes, observer, computed } from '../../helpers/react';
import { map, partial } from 'lodash';
import TutorLink from '../link';


@observer
class BookMenuTocSection extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
    section: PropTypes.object,
  };

  @computed get title() {
    const { section } = this.props;

    return (
      <div className="chapter-section-title">
        {section.isChapterSectionDisplayed &&
          <span className="section-number">
            {section.chapter_section.asString}
          </span>}
        <span key="title">{section.title}</span>
      </div>
    );
  }

  @computed get linkedTitle() {
    const { ux, section } = this.props;
    return (
      <TutorLink
        {...ux.sectionLinkProps(section)}
        tabIndex={ux.isMenuVisible ? 0 : -1}
        className={section === ux.page ? 'active' : ''}
        onClick={partial(ux.onMenuSelection, section.chapter_section.asString)}
      >
        {this.title}
      </TutorLink>
    );
  }


  render() {
    const { ux, section } = this.props;

    return (
      <ul
        className="section"
        data-depth={section.depth}
      >
        <li data-section={section.chapter_section.asString}>
          {section.hasContent ? this.linkedTitle : this.title}
        </li>
        {map(this.props.section.children, child => (
          <li key={child.id} data-section={child.chapter_section.asString}>
            <BookMenuTocSection ux={ux} section={child} />
          </li>
        ))}
      </ul>
    );
  }
}


export default
@observer
class BookMenu extends React.Component {

  static propTypes = {
    ux: PropTypes.object.isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <div className={cn('book-menu', { open: ux.isMenuVisible, ontop: ux.isMenuOnTop })}>
        {map(ux.toc, child => (
          <BookMenuTocSection
            ux={ux}
            key={child.id}
            section={child}
          />
        ))}
      </div>
    );
  }

}
