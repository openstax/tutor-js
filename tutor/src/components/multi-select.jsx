import PropTypes from 'prop-types';
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { find } from 'lodash';
import classnames from 'classnames';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import Icon from './icon';

@observer
class MultiSelect extends React.Component {

  static propTypes = {
    title:      PropTypes.string.isRequired,
    className:  PropTypes.string,
    closeAfterSelect: PropTypes.bool,

    selections: PropTypes.arrayOf(
      PropTypes.shape({
        id:       PropTypes.string,
        title:    PropTypes.oneOfType([
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
        find(this.props.selections, { id: selection })
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
        className="multi-selection-option"
      >
        <Icon type={selection.selected ? 'check-square-o' : 'square-o'} />
        <span className="title">{selection.title}</span>
        {onlyToggle}
      </Dropdown.Item>
    );
  };

  render() {
    return (
      <div className={classnames('multi-select', this.props.className)}>
        <Dropdown.Toggle
          id="multi-select"
          aria-label={this.props.title}
          onSelect={this.onSelect}
          title={this.props.title}
          onToggle={this.onToggle}
          open={this.isOpen}
          tabIndex={this.props.tabIndex}
        >
          {Array.from(this.props.selections).map((selection) => this.renderMenuSelection(selection))}
        </Dropdown.Toggle>
      </div>
    );
  }
}


export default MultiSelect;
