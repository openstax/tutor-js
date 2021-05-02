import { React, PropTypes, observer, styled, action } from 'vendor';
import { Modal, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import DateTimeInput from '../../components/date-time-input';
import { Formik, Form } from 'formik';
import { colors, fonts } from 'theme';
import { Time } from '../../models'
// import Time from '../../helpers/time';
import ExtensionIcon, { GreenCircle, EIcon  } from '../../components/icons/extension';
import CheckBoxInput from '../../components/checkbox-input';
import SearchInput from '../../components/search-input';

const StudentExtensionInfo = observer(({ ux, student }) => {
    if (!student.extension) { return null; }

    return (
        <ExtensionIcon
            extension={student.extension}
            timezone={ux.course.timezone}
            inline={true}
        />
    );
});

const StudentWrapper = styled.div`
  ${GreenCircle} {
    margin-left: 0.8rem;
    margin-top: -1px;
  }
  width: 100%;
  margin: 10px 25px 9px 0;
  display: flex;
  align-items: center;

  &:first-child:nth-last-child(n + 11),
  &:first-child:nth-last-child(n + 11) ~ & {
    width: 335px;
  }

  &:first-child:nth-last-child(n + 21),
  &:first-child:nth-last-child(n + 21) ~ & {
    width: 215px;
  }

  label {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const DateTimes = styled.div`
  display: flex;
  > * { flex: 1; }
  .date-time-input + .date-time-input {
    margin-left: 1rem;
  }
  .date-time-input {
    display: flex;
    align-items: center;
    label {
      margin-right: 24px;
      margin-bottom: 0;
    }
  }
`;

const StudentsList = styled.div`
  margin: 10px 0 36px;
  display: flex;
  flex-wrap: wrap;

  label {
    margin-left: 17px;
    margin-bottom: 0;
  }
`;

const LegendBar = styled.div`
  margin: 2.5rem 2rem 2rem 0;
  display: flex;
  align-items: baseline;
`;

const ExtensionText = styled.div`
  ${fonts.faces.light};
  font-size: 1.4rem;
  line-height: 2.2rem;
  margin-left: 1rem;
  color: ${colors.neutral.lite};
  max-width: 525px;
`;

const SelectTitle = styled.div`
  font-weight: bold;
  margin-bottom: 1rem;
`;

const Toolbar = styled.div`
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  input { height: 100%; }
  .input-group { width: 255px; }
`;

const StyledModal = styled(Modal)`
  .modal-dialog {
    min-width: 800px;
  }

  .modal-footer {
    padding: 0 40px 40px;
  }

  .modal-body {
    padding: 22px 40px;
  }

  .modal-header {
    padding: 25px 40px;
    font-weight: bold;
    font-size: 1.8rem;

    .close {
      font-size: 3rem;
      margin-top: -1.8rem;
    }
  }

  .extension-icon {
    width: 1.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
  }
`;

const SelectAll = styled.div`
  ${props => props.hide && 'visibility: hidden;'}

  label {
    margin-left: 17px;
    margin-bottom: 0;
  }
`;

const ExtendModal = observer(({ ux, form: { isValid, values } }) => {
    return (
        <StyledModal
            show={ux.isDisplayingGrantExtension}
            backdrop="static"
            onHide={ux.cancelDisplayingGrantExtension}
        >
            <Form>
                <Modal.Header closeButton={true}>
          Grant extension for {ux.selectedPeriod.name}
                </Modal.Header>
                <Modal.Body>
                    <Toolbar>
                        <SelectTitle>Select student(s):</SelectTitle>
                        <SearchInput onChange={ux.onSearchExtensionStudentChange} />
                    </Toolbar>
                    <SelectAll hide={ux.hideToggleGrantExtensionAllStudents}>
                        <CheckBoxInput
                            onChange={ux.toggleGrantExtensionAllStudents}
                            label="Select all"
                            labelSize="lg"
                            standalone={true}
                            checked={ux.allExtensionStudentsSelected}
                        />
                    </SelectAll>
                    <StudentsList>
                        {ux.extensionStudents.map(student => <Student key={student.role_id} ux={ux} student={student} />)}
                    </StudentsList>
                    <DateTimes>
                        <DateTimeInput
                            label="New due date:"
                            name="extension_due_date"
                            disabledDate={ux.course.isInvalidAssignmentDate}
                            timezone={ux.course.timezone}
                            validate={(d) => { // eslint-disable-line consistent-return
                                if (!d) { return 'must be valid date' }
                                if (d.isBefore(Time.now)) return 'Due date cannot be set in the past';
                                if (d.isAfter(values.extension_close_date)) return 'Due date cannot be after Close date';
                            }}
                        />
                        <DateTimeInput
                            label="New close date:"
                            name="extension_close_date"
                            timezone={ux.course.timezone}
                            disabledDate={ux.course.isInvalidAssignmentDate}
                            validate={d => {
                                if (!d) { return 'must be valid date' }
                                return d.isBefore(values.extension_due_date) && 'Close date cannot be before Due date'
                            }}
                        />
                    </DateTimes>
                    <LegendBar>
                        <EIcon />
                        <ExtensionText>
              Students who’ve been granted an extension are denoted with a green circle with E.
              Hover over the icon to see the new due date for that student.
                        </ExtensionText>
                    </LegendBar>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        size="lg"
                        variant="default"
                        className="btn-standard"
                        onClick={ux.cancelDisplayingGrantExtension}
                    >Cancel</Button>
                    <Button
                        size="lg"
                        variant="primary"
                        className="btn-standard"
                        type="submit"
                        disabled={isValid == false || (!ux.isPendingExtensions)}
                    >Save</Button>
                </Modal.Footer>
            </Form>
        </StyledModal>
    );
});

const Student = observer(({ student, ux }) => {
    const checked = !!ux.pendingExtensions.get(student.role_id.toString(10));
    return (
        <StudentWrapper>
            <CheckBoxInput
                onChange={action(({ target: { checked } }) => ux.pendingExtensions.set(student.role_id.toString(10), checked))}
                checked={checked}
                standalone={true}
                label={`${student.first_name} ${student.last_name}`}
                labelSize="lg"
            />
            <StudentExtensionInfo ux={ux} student={student} />
        </StudentWrapper>
    );
});

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
                    onClick={action(() => ux.isDisplayingGrantExtension = true)}
                >
                    Grant Extension
                </Button>
            </OverlayTrigger>
            {ux.isDisplayingGrantExtension && (
                <Formik
                    onSubmit={ux.saveDisplayingGrantExtension}
                    initialValues={{
                        extension_due_date: ux.course.dateTimeInZone().plus({ day: 1 }),
                        extension_close_date: ux.course.dateTimeInZone().plus({ week: 1 }),
                    }}
                >
                    {(form) => <ExtendModal ux={ux} form={form} />}
                </Formik>)}
        </>
    );
});

GrantExtension.propTypes = {
    ux: PropTypes.object.isRequired,
};


export default GrantExtension;
