import { React, PropTypes, styled } from 'vendor';
import LMSPushBtn from './lms-push-btn';
import ExportBtn from './export-btn';
import SettingBtn from './settings-btn';
import UX from './ux';
import SearchInput from '../../components/search-input';
import { colors } from 'theme';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  .input-group {
    width: 250px;
    input {
      height: 100%;
    }
  }
  & .btn.btn-plain {
    border: 1px solid ${colors.neutral.pale};
    padding: 5px 10px;

    &:hover, &.gradebook-btn-selected {
      background-color: ${colors.neutral.lighter}
    }
    &:not(:last-child) {
      margin-right: 16px;
    }
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
  flex: auto;
  justify-content: flex-end;
`;

const Controls = ({ ux }) => {
    return (
        <Wrapper>
            {ux.isTeacher && <SearchInput onChange={ux.onSearchStudentChange} />}
            <RightSide>
                <LMSPushBtn course={ux.course} />
                <ExportBtn course={ux.course} />
                <SettingBtn ux={ux} />
            </RightSide>
        </Wrapper>
    );
};
Controls.propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
};

export default Controls;
