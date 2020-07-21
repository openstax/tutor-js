import { React, PropTypes } from 'vendor';
import S from '../helpers/string';

const LatePointsInfo = ({ step }) => {
  const originalPoints = step.published_points_without_lateness;
  const lateWorkPenalty = step.published_late_work_point_penalty;
  const isLateWorkNotAccepted = step.task.late_work_penalty_applied === 'not_accepted';
  return (
    <table>
      <tbody>
        <tr>
          <td>Points earned:</td>
          <td>
            {originalPoints == 0
              ? originalPoints
              : S.numberWithOneDecimalPlace(originalPoints)}
          </td>
        </tr>
        <tr>
          <td>{isLateWorkNotAccepted ? 'Not accepted' : 'Late penalty'}:</td>
          <td>
            {lateWorkPenalty == 0
              ? lateWorkPenalty
              : S.numberWithOneDecimalPlace(lateWorkPenalty)}
          </td>
        </tr>
        <tr>
          <td><strong>Final points:</strong></td>
          <td>
            <strong>
              {step.pointsScored == 0
                ? step.pointsScored
                : S.numberWithOneDecimalPlace(step.pointsScored)}
            </strong>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
LatePointsInfo.propTypes = {
  step: PropTypes.object.isRequired,
};

export default LatePointsInfo;