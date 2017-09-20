import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { autobind } from 'core-decorators';


export default class TableFilters extends React.PureComponent {

  static propTypes = {
    displayAs: React.PropTypes.string.isRequired,
    changeDisplayAs: React.PropTypes.func.isRequired,
  }

  @autobind
  clickDisplay(mode) {
    this.props.changeDisplayAs(mode);
  }

  activeButton(state, option) {
    if (state === option) {
      return 'selected';
    }
    return '';
  }

  renderButtons(method, state, options) {
    return (
      Array.from(options).map((option, i) =>
        <Button
          onClick={method.bind(this, option)}
          bsStyle="default"
          bsSize="small"
          className={this.activeButton(state, option)}
          key={i}>
          {option}
        </Button>)
    );
  }

  render() {
    const { displayAs } = this.props;
    return (
      <div className="filter-row">
        <div className="filter-item">
          <div className="filter-label">
            Display as
          </div>
          <ButtonGroup className="filter-group">
            {this.renderButtons(this.clickDisplay, displayAs, ['percentage', 'number'])}
          </ButtonGroup>
        </div>
      </div>
    );
  }
}
