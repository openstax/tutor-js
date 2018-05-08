import React from 'react';
import { observer, propTypes as mobxPropTypes } from 'mobx-react';
import { map, partial } from 'lodash';
import cn from 'classnames';
import TutorLink from '../link';

@observer
class BookMenuTocSection extends React.Component {

  static propTypes = {
    ux: mobxPropTypes.observableObject.isRequired,
    section: React.PropTypes.object,
  };

  render() {
    const { ux, section } = this.props;
    return (
      <ul
        className="section"
        data-depth={section.depth}
      >
        <li data-section={section.chapter_section.asString}>
          <TutorLink
            {...ux.sectionLinkProps(section)}
            tabIndex={ux.isMenuVisible ? 0 : -1}
            className={section === ux.page ? 'active' : ''}
            onClick={partial(ux.onMenuSelection, section.chapter_section.asString)}
          >
            <span className="section-number">
              {section.chapter_section.asString}
            </span>
            {section.title}
          </TutorLink>
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


@observer
export default class BookMenu extends React.Component {

  static propTypes = {
    ux: mobxPropTypes.observableObject.isRequired,
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
