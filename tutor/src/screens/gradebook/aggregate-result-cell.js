import { React, PropTypes } from 'vendor';
import { getCell } from './styles';

const Cell = getCell('0 10px');


const AggregateResult = ({ drawBorderBottom }) => {
  return (
    <Cell striped drawBorderBottom={drawBorderBottom}>
          100
    </Cell>
  );
};
AggregateResult.propTypes = {
  drawBorderBottom: PropTypes.bool,
};

export default AggregateResult;
