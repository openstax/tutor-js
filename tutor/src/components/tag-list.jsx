import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import Theme from '../theme';
import isEmpty from 'lodash/isEmpty';

const TagListWrapper = styled.div`
  > * {
    margin: 1.5rem 0 0 0.5rem;
    user-select: none;
  }
`;

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

const ClearAllButton = styled.a`
  display: inline-block;
  vertical-align: middle;
  margin-left: 20px;
`;

@observer
class TagList extends React.Component {
    static propTypes = {
        items: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.oneOfType([
                    PropTypes.string, PropTypes.number,
                ]),
                uuid: PropTypes.string,
                title: PropTypes.oneOfType([
                    PropTypes.string, PropTypes.element,
                ]),
            })
        ).isRequired,

        onRemove: PropTypes.func,
        onClearAll: PropTypes.func,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onRemove(item) {
        if (this.props.onRemove) {
            this.props.onRemove(item);
        }
    }

    @action.bound onClearAll() {
        if (this.props.onClearAll) {
            this.props.onClearAll();
        }
    }

    renderItem = (item) => {
        return (
            <TagListItem
                key={item.id}
            >
                <IconWrapper
                    onClick={() => this.onRemove(item)}
                    className="remove-tag"
                    aria-label="Remove"
                >
                    <Icon type="close" />
                </IconWrapper>
                {item.title}
            </TagListItem>
        );
    };

    renderClearAllButton = () => {
        if (isEmpty(this.props.items)) { return null; }

        return (
            <ClearAllButton href="#" onClick={this.onClearAll}>Clear All</ClearAllButton>
        );
    }

    render() {
        if (!this.props.items) { return null; }

        return (
            <TagListWrapper>
                {Array.from(this.props.items).map((item) => this.renderItem(item))}
                {this.renderClearAllButton()}
            </TagListWrapper>
        );
    }
}

export default TagList;
