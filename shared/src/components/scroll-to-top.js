import { useEffect } from 'react';
import { withRouter } from 'react-router';

const ScrollToTop = ({ children, location: { pathname } }) => {
    useEffect(() => {
        if (window.scrollTo) {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return children || null;
};

export default withRouter(ScrollToTop);
