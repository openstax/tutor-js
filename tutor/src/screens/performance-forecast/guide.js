import PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'react-bootstrap';
import classnames from 'classnames';
import Chapter from './chapter';
import WeakerCard from './weaker-panel';

export default class PerformanceForecast extends React.Component {

    static propTypes = {
        performance: PropTypes.object.isRequired,
        heading:     PropTypes.element,
        canPractice:  PropTypes.bool,
        weakerTitle: PropTypes.string.isRequired,
        weakerExplanation: PropTypes.element,
        isLoading: PropTypes.bool,
        loadingMessage: PropTypes.string,
        emptyMessage: PropTypes.any,
    };

    renderBody = () => {
        const { performance } = this.props

        return (
            <div className="guide-group">
                <WeakerCard {...this.props} />
                <Row>
                    <h3>
                        Individual Chapters
                    </h3>
                </Row>
                {(performance.children || []).map((chapter, i) =>
                    <Chapter key={i} chapter={chapter} {...this.props} />)}
            </div>
        );
    };

    render() {
        const { performance } = this.props

        let body;
        const className = classnames('guide-container', {
            'is-loading': (typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined),
            'is-empty': performance.isEmpty,
        });

        if (performance.isEmpty) {
            body = this.props.emptyMessage;
        } else {
            body = this.renderBody();
        }

        return (
            <div className={className}>
                {this.props.heading}
                {body}
            </div>
        );
    }
}
