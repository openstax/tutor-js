import { React, PropTypes, observer } from 'vendor';
import UX from './ux';
import withFooter from './with-footer';
import Instructions from './step/instructions';
import Header from '../../components/header';
import Router from '../../helpers/router';

@observer
class EventTask extends React.Component {

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    }

    render() {
        const { ux } = this.props;

        return (
            <>
                <Header
                    unDocked={true}
                    title={ux.task.title}
                    backTo={Router.makePathname('dashboard', { courseId: ux.course.id })}
                    backToText='Dashboard'
                />
                <Instructions ux={ux} />
            </>
        );
    }

}

export default withFooter(EventTask);
