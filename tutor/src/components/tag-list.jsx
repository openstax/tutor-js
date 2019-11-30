import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import Theme from '../theme';

const TagListItem = styled.div`
  display: inline-block;
  width: 100px; // +20 for the icon
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${Theme.colors.neutral.dark};
  vertical-align: middle;
`;

const IconWrapper = styled.span`
  cursor: pointer;
  font-size: 0.85em;
`;

@observer
class TagList extends React.Component {

  static propTypes = {
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([
          PropTypes.string, PropTypes.number,
        ]),
        title: PropTypes.oneOfType([
          PropTypes.string, PropTypes.element,
        ]),
      })
    ).isRequired,

    onRemove: PropTypes.func,
  };

  @action.bound onRemove(item) {
    if (this.props.onRemove) {
      this.props.onRemove(item);
    }
  }

  renderItem = (item) => {
    return (
      <TagListItem
        key={`tag-list-item-${item.uuid}`}
        eventKey={item.uuid}
      >
        <IconWrapper
          onClick={() => this.onRemove(item)}
        >
          <Icon type="close" />
        </IconWrapper>
        {item.title}
      </TagListItem>
    );
  };

  render() {
    if (!this.props.items) { return null; }

    return (
      <div>
        {Array.from(this.props.items).map((item) => this.renderItem(item))}
      </div>
    )
  }
}

export default TagList;
