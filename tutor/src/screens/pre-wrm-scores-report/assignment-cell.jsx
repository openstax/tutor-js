import { React, PropTypes, cn, observer } from 'vendor';
import { extend } from 'lodash';

import ReadingCell from './reading-cell';
import HomeworkCell from './homework-cell';
import AbsentCell from './absent-cell';
import ExternalCell from './external-cell';
import UX from './ux';

const CellTypes = {
    external: ExternalCell,
    reading: ReadingCell,
    homework: HomeworkCell,
    default: AbsentCell,
};

@observer
export default
class AssignmentCell extends React.Component {
  static propTypes = {
      ux: PropTypes.instanceOf(UX).isRequired,
      rowIndex: PropTypes.number,
      columnIndex: PropTypes.number.isRequired,
  }

  render() {
      const { ux, rowIndex } = this.props;
      const student = ux.students[rowIndex || 0];
      const props = extend({}, this.props, {
          student,
          task: student.data[this.props.columnIndex],
          headings: ux.period.data_headings,
      });

      let Cell = CellTypes[props.task.type] || CellTypes.default;

      return (
          <div className={cn('scores-cell', {
              'is-dropped': student.is_dropped,
          })}>
              <Cell {...props} />
          </div>
      );
  }
}
