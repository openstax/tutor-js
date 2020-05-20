import { React, PropTypes, observer, styled, moment } from 'vendor';
import { ToolbarButton } from 'primitives';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DateTime from '../../components/date-time-input';
import { Formik, Form } from 'formik';

// https://projects.invisionapp.com/d/main#/console/18937568/411294724/preview

const StudentWrapper=styled.label`
  display: block;
  input {
    margin-right: 1rem;
  }
`;

const Student = observer(({ student, ux }) => {
  const checked = !!ux.pendingExtensions.get(student.role_id);
  return (
    <StudentWrapper>
      <input
        type="checkbox"
        onChange={({ target: { checked } }) => ux.pendingExtensions.set(student.role_id, checked)}
        checked={checked}
      />
      {student.last_name}
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
        <ToolbarButton onClick={() => ux.isDisplayingGrantExtension=true}>Grant Extension</ToolbarButton>
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
            <Modal.Header>
              Grant extension for {ux.selectedPeriod.name}
            </Modal.Header>
            <Modal.Body>
              <StudentsList>
                {ux.scores.students.map(student => <Student key={student.role_id} ux={ux} student={student} />)}
              </StudentsList>
              <Box>
                <DateTime
                  label="New due date"
                  name="extension_due_date"
                  format="MMM D hh:mm A"
                />
                <DateTime
                  label="New close date"
                  name="extension_close_date"
                  format="MMM D hh:mm A"
                />
              </Box>
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="default"
                onClick={ux.cancelDisplayingGrantExtension}
              >Close</Button>
              <Button
                variant="primary"
                type="submit"
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
