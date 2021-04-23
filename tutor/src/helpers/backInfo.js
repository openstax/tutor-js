import { navHistory } from '../models'


const backInfo = () => {
    // Gets route to last path that was not the same as the current one
    // See TransitionStore for more detail.
    const historyInfo = navHistory.latest

    const text = historyInfo != null && !!historyInfo.name ? `Back to ${historyInfo.name}` : 'My Courses';
    const to =  historyInfo != null && !!historyInfo.path ? historyInfo.path : 'myCourses';

    return {
        text,
        to,
    };
};


export default backInfo;
