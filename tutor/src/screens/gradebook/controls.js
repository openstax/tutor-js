import { React, PropTypes, styled, useState, useRef, useObserver } from 'vendor';
import { Button, Popover, Overlay } from 'react-bootstrap';
import { Icon } from 'shared';
import LMSPushBtn from './lms-push-btn';
import ExportBtn from './export-btn';
import UX from './ux';
import SearchInput from '../../components/search-input';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  .course-page .controls-wrapper > & {
    flex-direction: row;
    justify-content: space-between;
  }
  .input-group {
    width: 250px;
    input {
      height: 100%;
    }
  }
`;

const RightSide = styled.div`
  display: flex;
  align-items: center;
  justify-items: center;
`;

const Toggles = styled(Popover.Content)`
  padding: 1rem;
  label {
    display: block;
  }
  input {
    margin-right: 1rem;
  }
`;

const CB = ({ ux, title, property }) => useObserver(() => (
  <label>
    <input
      type="checkbox"
      checked={ux[property]}
      onChange={({ target }) => ux[property] = target.checked}
    />
    {title}
  </label>
));

CB.propTypes ={
  ux: PropTypes.instanceOf(UX).isRequired,
  title: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
};

const SelectionTypes = ({ ux }) => {
  const [show, setShow] = useState(false);
  const target = useRef(null);

  return useObserver(() => {
    return (
      <>
        <Button ref={target} onClick={() => setShow(!show)} variant={show ? 'secondary' : 'default'}>
          <Icon type="cog" />
        </Button>
        <Overlay rootClose target={target.current} placement="bottom" show={show} onHide={() => setShow(false)}>
          <Popover >
            <Toggles>
              <CB ux={ux} property="displayScoresAsPercent" title="Display scores as percentage %" />
              <CB ux={ux} property="arrangeColumnsByType" title="Arrange columns by assignment type" />
              <CB ux={ux} property="arrangeColumnsByPoints" title="Arrange columns by points" />
              <CB ux={ux} property="showDroppedStudents" title="Show dropped students" />
            </Toggles>
          </Popover>
        </Overlay>
      </>
    );
  });
};

const Controls = ({ ux }) => {
  return (
    <Wrapper>
      {ux.isTeacher && <SearchInput onChange={ux.onSearchStudentChange} />}
      <RightSide>
        <LMSPushBtn course={ux.course} />
        <ExportBtn course={ux.course} />
        <SelectionTypes ux={ux} />
      </RightSide>
    </Wrapper>
  );
};

SearchInput.propTypes = Controls.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default Controls;
