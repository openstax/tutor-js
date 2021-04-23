import PropTypes from 'prop-types';
import React from 'react';
import Section from './section';

export default
class WeakerSections extends React.Component {
    static propTypes = {
        performance:  PropTypes.object.isRequired,
        weakerEmptyMessage:  PropTypes.string.isRequired,
    };

    renderLackingData = () => {
        return (
            <div className="lacking-data">
                {this.props.weakerEmptyMessage}
            </div>
        );
    };

    renderSections = () => {
        return this.props.performance.weakestSections().map((section, i) =>
            <Section key={i} section={section} {...this.props} />);
    };

    render() {

        return (
            <React.Fragment>
                {this.props.performance.canDisplayWeakest ? this.renderSections() : this.renderLackingData()}
            </React.Fragment>
        );
    }
}
