import { React, PropTypes, observer, styled, moment } from 'vendor';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DateTime from '../../components/date-time-input';
import { Formik, Form } from 'formik';
import { colors } from 'theme';
import ExtensionIcon, { GreenCircle, EIcon  } from '../../components/icons/extension';

// https://projects.invisionapp.com/d/main#/console/18937568/411294724/preview


const StudentExtensionInfo = observer(({ student }) => {
  if (!student.hasBeenExtended) { return null; }

  return <ExtensionIcon />;
});

const CheckBox = styled.input.attrs({
  type: 'checkbox',
})`
    margin-right: 1rem;
`;

const Label = styled.label`
  margin-bottom: 1rem;
`;

const StudentWrapper=styled(Label)`
  display: flex;
  justify-content: flex-start;
  span {
    flex: 0;
  }
  ${GreenCircle} {
    margin-left: 1rem;
  }
`;

const Student = observer(({ student, ux }) => {
  const checked = !!ux.pendingExtensions.get(student.role_id);

  return (
    <StudentWrapper>
      <CheckBox
        onChange={({ target: { checked } }) => ux.pendingExtensions.set(student.role_id, checked)}
        checked={checked}
      />
      <span>{student.last_name}, {student.first_name}</span>
      <StudentExtensionInfo ux={ux} student={student} />
    </StudentWrapper>
  );
});

const Box=styled.div`
  display: flex;
  > * { flex: 1; }
  .date-time-input + .date-time-input {
    margin-left: 1rem;
  }
`;

const StudentsList = styled.div`
  column-count: 3;
  column-gap: 2rem;
  margin-bottom: 2rem;
`;

const LegendBar = styled.div`
  margin: 2rem;
  display: flex;
  align-items: center;
`;
const ExtensionText = styled.div`
  font-size 10px;
  margin-left: 1rem;
  color: ${colors.neutral.gray};
`;

const StyledModalHeader = styled(Modal.Header)`
  font-weight: bold;
`;

const SelectTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const GrantExtension = observer(({ ux }) => {
  if (!ux.taskPlan.canGrantExtension) {
    return null;
  }

  return (
    <>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>Select and grant time extension to student(s)</Tooltip>}
      >
        <Button
          variant="light"
          className="btn-standard"
          onClick={() => ux.isDisplayingGrantExtension=true}
        >
          Grant Extension
        </Button>
      </OverlayTrigger>
      <Formik
        onSubmit={ux.saveDisplayingGrantExtension}
        initialValues={{ extension_due_date: moment(), extension_close_date: moment().add(1, 'week') }}
      >
        <Modal
          show={ux.isDisplayingGrantExtension}
          backdrop="static"
          onHide={ux.cancelDisplayingGrantExtension}
        >
          <Form>
            <StyledModalHeader>
              Grant extension for {ux.selectedPeriod.name}
            </StyledModalHeader>
            <Modal.Body>
              <SelectTitle>Select student(s):</SelectTitle>
              <Label>
                <CheckBox
                  onChange={ux.toggleGrantExtensionAllStudents}
                />
                Select all
              </Label>
              <StudentsList>
                {ux.scores.students.map(student => <Student key={student.role_id} ux={ux} student={student} />)}
              </StudentsList>
              <Box>
                <DateTime
                  label="New due date"
                  name="extension_due_date"
                />
                <DateTime
                  label="New close date"
                  name="extension_close_date"
                />
              </Box>
              <LegendBar>
                <EIcon />
                <ExtensionText>
                  Students who’ve been granted an extension are denoted with a green circle with E.
                  Hover over the icon to see the new due date for that studen.
                </ExtensionText>
              </LegendBar>
            </Modal.Body>
            <Modal.Footer>
              <Button
                size="lg"
                variant="default"
                onClick={ux.cancelDisplayingGrantExtension}
              >Cancel</Button>
              <Button
                size="lg"
                variant="primary"
                type="submit"
                disabled={!ux.isPendingExtensions}
              >Save</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Formik>
    </>
  );
});
GrantExtension.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default GrantExtension;
