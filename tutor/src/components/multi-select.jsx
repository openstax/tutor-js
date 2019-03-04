import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import classnames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import { Icon } from 'shared';

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
    tabIndex: PropTypes.number,
  };

  static defaultProps = {
    closeAfterSelect: true,
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
        <Icon type={selection.selected ? 'check-square' : 'square'} />
        <span className="title">{selection.title}</span>
        {onlyToggle}
      </Dropdown.Item>
    );
  };

  render() {
    return (
      <Dropdown variant="default" className={classnames('multi-select', this.props.className)}>
        <Dropdown.Toggle
          id="multi-select"
          variant="default"
          aria-label={this.props.title}
          onToggle={this.onToggle}
          open={this.isOpen}
          tabIndex={this.props.tabIndex}
        >
          {this.props.title}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          {Array.from(this.props.selections).map((selection) => this.renderMenuSelection(selection))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}


export default MultiSelect;
