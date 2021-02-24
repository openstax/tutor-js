import { React, PropTypes, styled } from 'vendor';
import ScoresHelper from '../helpers/scores';

const StyledTable = styled.table`
  td + td {
    text-align: right;
  }
`;

const LatePointsInfo = ({ step }) => {
    const originalPoints = step.published_points_without_lateness;
    const lateWorkPenalty = step.published_late_work_point_penalty;
    return (
        <StyledTable data-test-id="late-info-points-table">
            <tbody>
                <tr>
                    <td>Points earned:</td>
                    <td>
                        {ScoresHelper.formatPoints(originalPoints)}
                    </td>
                </tr>
                <tr>
                    <td>Late penalty:</td>
                    <td>
                        {ScoresHelper.formatLatePenalty(lateWorkPenalty)}
                    </td>
                </tr>
                <tr>
                    <td><strong>Final points:</strong></td>
                    <td>
                        <strong>
                            {ScoresHelper.formatPoints(step.pointsScored)}
                        </strong>
                    </td>
                </tr>
            </tbody>
        </StyledTable>
    );
};
LatePointsInfo.propTypes = {
    step: PropTypes.object.isRequired,
};

export default LatePointsInfo;
