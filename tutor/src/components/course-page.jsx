import { React, PropTypes, cn, computed, styled, css, Theme } from 'vendor';
import { ScrollToTop, Icon } from 'shared';
import { isNil } from 'lodash';
import Course from '../models/course';
import CourseUX from '../models/course/ux';
import TutorLink from './link';

const TitleWrapper = styled.div`
  display: flex;
  align-items: stretch;
  padding: 10px 40px;
  min-height: 100px;
  flex-wrap: wrap;
`;

const TitleInner = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  align-items: center;
  justify-content: space-between;

  ${props => props.appearance === 'light' && css`
    padding: 0 0 1.5rem;
    border-bottom: 1px solid ${Theme.colors.neutral.pale};`
  }
`;

const ItemsWrapper = styled.div`
  display: flex;
`;

const BreadcrumbsWrapper = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  flex-basis: 100%;
`;

const LeftSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const RightSideWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-weight: bold;
  font-size: 2.4rem;
  line-height: 4.5rem;
  margin: 0;
`;

const Subtitle = styled.h3`
  font-weight: 200;
  line-height: 1em;
  font-size: 1.6rem;
  margin: 0;
`;

export default class CoursePage extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    children: PropTypes.node.isRequired,
    titleControls: PropTypes.node,
    titleBreadcrumbs: PropTypes.node,
    controls: PropTypes.node,
    title: PropTypes.node,
    notices: PropTypes.node,
    subtitle: PropTypes.node,
    className: PropTypes.string,
    fullWidthChildren: PropTypes.node,
  }

  @computed get ux () {
    return new CourseUX(this.props.course);
  }

  renderTitle() {
    const { title, subtitle, titleControls, titleBreadcrumbs, titleAppearance } = this.props;
    if (isNil(title)) { return null; }

    return (
      <TitleWrapper className={cn({ 'title-wrapper': !titleAppearance })}>
        {this.renderBreadcrumbs()}
        <TitleInner appearance={titleAppearance}>
          <LeftSideWrapper>
            <Title>{title}</Title>
            {subtitle && <Subtitle>{subtitle}</Subtitle>}
          </LeftSideWrapper>
          {titleControls && <RightSideWrapper>{titleControls}</RightSideWrapper>}
        </TitleInner>
      </TitleWrapper>
    );
  }

  renderControls() {
    return isNil(this.props.controls) ? null: <div className="controls-wrapper">{this.props.controls}</div>;
  }

  renderBreadcrumbs() {
    if (isNil(this.props.titleBreadcrumbs)) { return null; }

    return (
      <BreadcrumbsWrapper>{this.props.titleBreadcrumbs}</BreadcrumbsWrapper>
    );
  }

  render() {
    return (
      <ScrollToTop>
        <div
          className={cn('course-page', this.props.className)}
          {...this.ux.dataProps}
        >
          <header>
            {this.renderTitle()}
            {this.props.notices}
            {this.renderControls()}
          </header>
          <div className="body-wrapper">
            <div className="body">
              {this.props.children}
            </div>
            {this.props.fullWidthChildren}
          </div>
        </div>
      </ScrollToTop>
    );
  }
}
