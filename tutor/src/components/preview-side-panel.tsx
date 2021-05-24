import { React, Box, observer } from '../vendor'
import { when } from 'mobx'
import { Button } from 'react-bootstrap'
import SidePanel from './side-panel'
import type { Course } from '../models'
import { CoursesMap, currentCourses } from '../models'
import TutorLink from './link';
import { Chat } from '../helpers/chat'
import { Icon } from 'shared'

interface PanelProps {
    course: Course
    courses?: CoursesMap
}

@observer
export
class PreviewCourseSidePanel extends React.Component<PanelProps> {

    chatRef = React.createRef<HTMLDivElement>()

    componentDidMount() {
        when(
            () => this.chatRef.current,
            () => Chat.setElementVisiblity(this.chatRef.current),
        );
    }

    render() {
        const { course, courses = currentCourses } = this.props
        if (!course ||
            !course.is_preview ||
            !course.offering.is_available ||
            !course.currentRole.isTeacher ||
            !course.appearanceCode ||
            !courses.nonPreview.where(c => c.offering_id == course.offering_id).isEmpty
        ) {
            return null
        }

        return (
            <SidePanel ignorePathIncludes={'t/month'}>
                <h3>Ready to begin?</h3>
                <p>Creating a course is the first step towards managing your class assignments.</p>
                <TutorLink
                    className="btn btn-primary"
                    to="createNewCourseFromOffering"
                    params={{ offeringId: course.offering_id }}
                    data-test-id="preview-panel-create-course"
                >
                    Create a course
                </TutorLink>
                <Box direction="column" margin={{ top: 'xlarge' }} ref={this.chatRef}>
                    <h3>Have questions?</h3>
                    <p>
                        Our support team is available to help!
                        <br />
                        <i>(9-5 CST)</i>
                    </p>
                    <Button onClick={Chat.start}>
                        <Icon type='comments-solid' color="white" />
                        <span>Chat with us</span>
                    </Button>
                </Box>
            </SidePanel>
        )
    }
}
