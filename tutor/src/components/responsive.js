import { React, PropTypes, computed, observer, modelize } from 'vendor';
import { defaults } from 'lodash';
import { WindowSize } from '../models';

const DEFAULT_BREAKPOINTS = {
    tablet: 600,
    desktop: 999,
};


@observer
class Responsive extends React.Component {
    static propTypes = {
        windowImpl: PropTypes.object,
        breakpoints: PropTypes.object,
        mobile: PropTypes.node,
        tablet: PropTypes.node,
        desktop: PropTypes.node,
    }

    windowSize = new WindowSize({ windowImpl: this.props.windowImpl });

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get breakpoints() {
        return defaults({}, this.props.breakpoints, DEFAULT_BREAKPOINTS);
    }

    render() {
        const { desktop, tablet, mobile } = this.props;

        if (this.windowSize.width > this.breakpoints.desktop) {
            return desktop;
        }
        if (this.windowSize.width > this.breakpoints.tablet) {
            return tablet || desktop;
        }
        return mobile;
    }
}

export default Responsive;
