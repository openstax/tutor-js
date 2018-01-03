import React from 'react';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';
import Courses from '../../models/courses-map';

import { action, observable } from 'mobx';
import ReferenceBook from './reference-book';
import LoadingScreen from '../loading-screen';
import UX from './ux';
import NavbarContext from '../navbar/context';

@inject('navBar')
@observer
export default class ReferenceBookShell extends React.Component {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
      section: React.PropTypes.string,
    }).isRequired,
    navBar: React.PropTypes.instanceOf(NavbarContext).isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @computed get course() {
    const { courseId } = this.props.params;
    return Courses.get(courseId);
  }

  ux = new UX(this.course, this.context.router);

  componentWillMount() {
    this.ux.setSection(this.props.params.section);
    this.ux.setNavBar(this.props.navBar);
  }

  componentWillReceiveProps(nextProps) {
    this.ux.setSection(nextProps.params.section);
  }

  render() {
    const { referenceBook } = this.course;

    if (!referenceBook.api.hasBeenFetched) {
      return <LoadingScreen />;
    }

    return (
      <ReferenceBook
        ux={this.ux}
        section={this.section}
        className={classnames({ 'is-teacher': this.ux.isShowingTeacherContent })}
      />
    );
  }

}
