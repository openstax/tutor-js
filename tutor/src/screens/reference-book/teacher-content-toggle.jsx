import { React, PropTypes, observer } from 'vendor';
import { Popover, OverlayTrigger } from 'react-bootstrap';


const NoContent = (
    <Popover id="no-content">
        <Popover.Content>
            No teacher edition content is available for this page.
        </Popover.Content>
    </Popover>
)

const TeacherContentToggle = observer(({ ux }) => {
    const teacherLinkText = ux.isShowingTeacherContent ? 'Hide Teacher Edition' : 'Show Teacher Edition';

    if (ux.hasTeacherContent) {
        return (
            <button
                className="teacher-content-toggle has-content"
                onClick={ux.toggleTeacherContent}
            >
                {teacherLinkText}
            </button>
        );
    } else {
        return (
            <OverlayTrigger
                placement="bottom"
                trigger="click"
                overlay={NoContent}
            >
                <span className="no-content teacher-content-toggle">
                    {teacherLinkText}
                </span>
            </OverlayTrigger>
        );
    }
})

TeacherContentToggle.propTypes = {
    ux:  PropTypes.object.isRequired,
};

export default TeacherContentToggle
