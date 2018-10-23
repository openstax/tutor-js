import PropTypes from 'prop-types';
import React from 'react';

// TODO find a better pluralizer
import pluralize from 'pluralize';
pluralize.addPluralRule('it', 'them');

export default class extends React.Component {
  static defaultProps = { items: [] };

  static displayName = 'Pluralize';

  static propTypes = {
    items: PropTypes.array.isRequired,
    children: PropTypes.string.isRequired,
  };

  render() {
    const { items } = this.props;
    return (
      <span>
        {pluralize(this.props.children, items.length)}
      </span>
    );
  }
}
