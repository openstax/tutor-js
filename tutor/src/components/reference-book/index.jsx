import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import Courses from '../../models/courses-map';

import { action, observable } from 'mobx';
import ReferenceBook from './reference-book';
import LoadingScreen from '../loading-screen';
import UX from './ux';
@observer
export default class ReferenceBookShell extends React.Component {

  @observable isShowingTeacherContent;

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
      section: React.PropTypes.string,
    }).isRequired,
  }

  @computed get course() {
    const { courseId } = this.props.params;
    return Courses.get(courseId);
  }

  ux = new UX(this.course);

  componentWillMount() {
    this.ux.setSection(this.props.params.section);
  }

  componentWillReceiveProps(nextProps) {
    this.ux.setSection(nextProps.params.section);
  }

  @action.bound setTeacherContent(isShowing) {
    this.isShowingTeacherContent = isShowing;
  }

  renderNavbarControls() {
    if (!this.course.isTeacher) { return null; }
    return (
      <span key="teacher-content">
        <TeacherContentToggle
          isShowing={this.isShowingTeacherContent}
          onChange={this.setTeacherContent} />
      </span>
    );
  }

  render() {
    const { referenceBook } = this.course;

    if (!referenceBook.api.hasBeenFetched) {
      return <LoadingScreen />;
    }

    return (
      <ReferenceBook
        ux={this.ux}
        navbarControls={this.renderNavbarControls()}
        section={this.section}
        className={classnames({ 'is-teacher': this.isShowingTeacherContent })}
      />
    );
  }

}
