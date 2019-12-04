import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import classnames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'shared';
import styled from 'styled-components';

const MultiSelectWrapper = styled.div`
  padding: ${props => props.useColumns ? '10px' : '0' };
  margin-top: ${props => !props.useColumns && props.showHelperControls ? '10px' : '0' };
  overflow-y: scroll;
  max-height: 640px;
  max-width: 976px;
`;

const MultiSelectItems = styled.div`
  column-count: ${props => props.useColumns ? '2' : 'inherit' };
  column-gap: 35px;

  @media only screen and (max-width: 979px) {
    column-count: inherit;
  }
`;

@observer
class MultiSelect extends React.Component {

  static propTypes = {
    title:      PropTypes.string.isRequired,
    className:  PropTypes.string,
    closeAfterSelect: PropTypes.bool,
    selections: PropTypes.arrayOf(
      PropTypes.shape({
        id:       PropTypes.oneOfType([
          PropTypes.string, PropTypes.number,
        ]),
        title: PropTypes.oneOfType([
          PropTypes.string, PropTypes.element,
        ]),
        selected: PropTypes.bool,
      })
    ).isRequired,

    onOnlySelection: PropTypes.func,
    onSelect: PropTypes.func,
    onSelectAll: PropTypes.func,
    onSelectNone: PropTypes.func,
    tabIndex: PropTypes.number,
    showHelperControls: PropTypes.bool,
    useColumns: PropTypes.bool,
  };

  static defaultProps = {
    closeAfterSelect: true,
    showHelperControls: false,
    useColumns: false,
    tabIndex: 0,
  };

  @observable isOpen = false;

  @action.bound toggleOnly(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    return this.props.onOnlySelection(ev.target.getAttribute('data-id'));
  }

  @action.bound onSelect(selection) {
    if (this.props.onSelect) {
      this.props.onSelect(
        this.props.selections.find(s => s.id == selection)
      );
    }
  }

  @action.bound onSelectAll() {
    if (this.props.onSelectAll) {
      this.props.onSelectAll();
    }
  }

  @action.bound onSelectNone() {
    if (this.props.onSelectNone) {
      this.props.onSelectNone();
    }
  }

  @action.bound onToggle(isOpen, ev, { source }) {
    if (this.props.closeAfterSelect || 'select' !== source) {
      this.isOpen = isOpen;
    }
  }

  renderMenuSelection = (selection) => {
    let onlyToggle;
    if (this.props.onOnlySelection) {
      onlyToggle = <span className="only" data-id={selection.id} onClick={this.toggleOnly}>
        only
      </span>;
    }

    return (
      <Dropdown.Item
        key={selection.id}
        eventKey={selection.id}
        onSelect={this.onSelect}
        className="multi-selection-option"
      >
        <Icon variant={selection.selected ? 'checkedSquare' : 'checkSquare'} size="lg" />
        <span className="title">{selection.title}</span>
        {onlyToggle}
      </Dropdown.Item>
    );
  };

  renderHelperControls = () => {
    if (!this.props.showHelperControls) { return null; }

    return (
      <div className="multi-select-helpers">
        <a href="#" className="select-all" onClick={this.onSelectAll}>All</a>
        <span className="divider">|</span>
        <a href="#" className="select-none" onClick={this.onSelectNone}>None</a>
      </div>
    );
  }

  render() {
    return (
      <Dropdown
        variant="default"
        className={classnames('multi-select', this.props.className)}
        onToggle={this.onToggle}
        show={this.isOpen}
      >
        <Dropdown.Toggle
          id="multi-select"
          variant="default"
          aria-label={this.props.title}
          tabIndex={this.props.tabIndex}
        >
          {this.props.title}
        </Dropdown.Toggle>
        <Dropdown.Menu
          flip={false}
          popperConfig={{
            modifiers: {
              preventOverflow: { enabled: false },
              hide: { enabled: false },
            }
          }}
        >
          <MultiSelectWrapper
            useColumns={this.props.useColumns}
            showHelperControls={this.props.showHelperControls}
          >
            {this.renderHelperControls()}
            <MultiSelectItems useColumns={this.props.useColumns}>
              {Array.from(this.props.selections).map((selection) => this.renderMenuSelection(selection))}
            </MultiSelectItems>
          </MultiSelectWrapper>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}


export default MultiSelect;
