import { React } from 'vendor';
import { useParams } from 'react-router'
import { ScrollToTop } from 'shared';
import Wizard from './wizard';
import './styles.scss';

const NewCourse = () => {
    const params = useParams()

    return (
        <ScrollToTop>
            <div className="new-course-wizard" data-test-id="new-course-wizard">
                <Wizard key={params.offeringId} />
            </div>
        </ScrollToTop>
    )
}

export default NewCourse
