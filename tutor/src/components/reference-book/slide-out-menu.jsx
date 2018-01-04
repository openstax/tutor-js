import React from 'react';
import { observer } from 'mobx-react';
import { map, partial } from 'lodash';
import cn from 'classnames';
import TutorLink from '../link';
import UX from './ux';

@observer
class Section extends React.Component {
  static displayName = 'ReferenceBookTocSection';

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
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
            className={section === ux.activePage ? 'active' : ''}
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
            <Section ux={ux} section={child} />
          </li>
        ))}
      </ul>
    );
  }
}


@observer
export default class ReferenceBookTOC extends React.Component {

  static propTypes = {
    ux: React.PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux } = this.props;

    return (
      <div className="menu">
        {map(ux.toc, child => (
          <Section
            ux={ux}
            key={child.id}
            section={child}
          />
        ))}
      </div>
    );
  }

}
