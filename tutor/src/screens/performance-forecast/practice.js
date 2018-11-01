import PropTypes from 'prop-types';
import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import Router from '../../helpers/router';
import { CoursePracticeStore } from '../../flux/practice';

export default class extends React.Component {
  static contextTypes = {
    router: PropTypes.object,
  };

  static displayName = 'PracticeButton';

  static propTypes = {
    courseId: PropTypes.string.isRequired,
    page_ids: PropTypes.array.isRequired,
    children: PropTypes.element.isRequired,
  };

  onClick = () => {
    const { courseId, page_ids } = this.props;
    const route = Router.makePathname('practiceTopics', { courseId }, { query: { page_ids } });
    return this.context.router.history.push( route );
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
      'is-errored': this.isErrored(),
    });
    const props = { disabled: isDisabled, onClick: this.onClick, className };

    return React.cloneElement(this.props.children, props);
  }
}
