import React from 'react';

export default class AbsentCell extends React.PureComponent {

  static propTypes = {
    headings: React.PropTypes.array.isRequired,
    columnIndex: React.PropTypes.number.isRequired,
  }

  findTypeFromColumn() {
    const { headings, columnIndex } = this.props;
    return (
      (headings[columnIndex] != null ? headings[columnIndex].type : undefined)
    );
  }

  render() {
    const columnType = this.findTypeFromColumn();

    if ((columnType === 'reading') || (columnType === 'external')) {
      return (
        <div className="scores-cell">
          <div className="worked not-started wide">
            ---
          </div>
        </div>
      );
    } else {
      return (
        <div className="scores-cell">
          <div className="score not-started">
            ---
          </div>
          <div className="worked not-started">
            ---
          </div>
        </div>
      );
    }
  }
}
