import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import Router from '../../helpers/router';
import { CoursePracticeStore } from '../../flux/practice';

export default class Practice extends React.Component {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    page_ids: React.PropTypes.array.isRequired,
    children: React.PropTypes.element.isRequired
  };

  static contextTypes = {
    router: React.PropTypes.object
  };

  onClick = () => {
    const { courseId, page_ids } = this.props;
    const route = Router.makePathname('practiceTopics', { courseId }, { query: { page_ids } });
    return this.context.router.history.push(route);
  };

  isDisabled = () => {
    const { page_ids, courseId } = this.props;

    // Used to disable for CoursePracticeStore.isDisabled(courseId, {page_ids}) as well
    //
    // CoursePracticeStore.isDisabled(courseId, {page_ids}) is true when practice
    // endpoint fails to return a practice.
    return _.isEmpty(page_ids);
  };

  isErrored = () => {
    const { page_ids, courseId } = this.props;

    return !this.isDisabled() && CoursePracticeStore.isDisabled(courseId, { page_ids });
  };

  render() {
    const isDisabled = this.isDisabled();
    const className = classnames({
      'is-errored': this.isErrored()
    });
    const props = { disabled: isDisabled, onClick: this.onClick, className };

    return React.cloneElement(this.props.children, props);
  }
};
