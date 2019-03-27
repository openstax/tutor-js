import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';
import Router from '../../helpers/router';

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
    const { page_ids } = this.props;
    return isEmpty(page_ids);
  };

  render() {
    const isDisabled = this.isDisabled();

    const props = { disabled: isDisabled, onClick: this.onClick };

    return React.cloneElement(this.props.children, props);
  }
}
