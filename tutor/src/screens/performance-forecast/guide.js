import PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import classnames from 'classnames';
import Chapter from './chapter';
import WeakerCard from './weaker-panel';
import ChapterSectionType from './chapter-section-type';

export default class PerformanceForecast extends React.Component {

    static propTypes = {
        courseId:    PropTypes.string.isRequired,
        roleId:   PropTypes.string,
        allSections: PropTypes.array.isRequired,
        chapters:    PropTypes.arrayOf(ChapterSectionType),
        heading:     PropTypes.element,
        canPractice:  PropTypes.bool,
        weakerTitle: PropTypes.string.isRequired,
        weakerExplanation: PropTypes.element,
        isLoading: PropTypes.bool,
        loadingMessage: PropTypes.string,
        emptyMessage: PropTypes.string,
    };

    renderBody = () => {
        return (
            <div className="guide-group">
                <WeakerCard sections={this.props.allSections} {...this.props} />
                <Row>
                    <h3>
            Individual Chapters
                    </h3>
                </Row>
                {(this.props.chapters || []).map((chapter, i) =>
                    <Chapter key={i} chapter={chapter} {...this.props} />)}
            </div>
        );
    };

    render() {
        let body;
        const className = classnames(
            'guide-container',
            {
                'is-loading': (typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined),
                'is-empty': isEmpty(this.props.allSections),
            },
        );

        if ((typeof this.props.isLoading === 'function' ? this.props.isLoading() : undefined)) {
            body = this.props.loadingMessage;
        } else if (isEmpty(this.props.allSections)) {
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
