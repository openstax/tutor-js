import { React, PropTypes, cn, computed, styled } from '../helpers/react';
import { ScrollToTop } from 'shared';
import { isNil } from 'lodash';
import Course from '../models/course';
import CourseUX from '../models/course/ux';

const TitleWrapper = styled.div.attrs({ className: 'title-wrapper' })`
  display: flex;
  align-items: stretch;
  padding: 10px 40px;
  min-height: 100px;
`;

const TitleInner = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: 1200px;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
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
  font-size: 36px;
  line-height: 45px;
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
    const { title, subtitle, titleControls } = this.props;
    if (isNil(title)) { return null; }

    return (
      <TitleWrapper>
        <TitleInner>
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
