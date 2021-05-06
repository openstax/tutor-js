import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty, extend } from 'lodash';
import { observable, action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Course, currentExercises, ExercisesMap } from '../../models';
import SectionsChooser from './sections-chooser';
import ExercisesDisplay from './exercises-display';
import Router from '../../helpers/router';
import qs from 'qs'

@observer
class QuestionsDashboard extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
        exercises: PropTypes.instanceOf(ExercisesMap),
        windowImpl: PropTypes.shape({
            open: PropTypes.func,
        }),
        history: PropTypes.shape({
            replace: PropTypes.func,
        }).isRequired,
    };

    static defaultProps = {
        exercises: currentExercises,
        windowImpl: window,
        history: history,
    }

    @observable isShowingExercises = false;
    @observable showingDetails = false;
    @observable focusedExercise = false;
    @observable chapterIds;
    @observable pageIds = [];
    windowImpl;
    history;

    constructor(props) {
        super(props)
        modelize(this);

        this.windowImpl = props.windowImpl
        this.history = props.history

        const queriedPageIds = Router.currentQuery().pageIds

        if (queriedPageIds) {
            this.pageIds = queriedPageIds.split(',')

            this.isShowingExercises = true;
            this.props.exercises.fetch({
                limit: false,
                course: this.props.course,
                page_ids: this.pageIds,
            });
        }
    }

    @action.bound onShowDetailsViewClick() {
        this.showingDetails = true;
    }

    @action.bound onShowCardViewClick() {
        this.showingDetails = false;
    }

    @action.bound onSelectionsChange(pageIds) {
        this.pageIds = pageIds;
        this.isShowingExercises = !isEmpty(pageIds);
        this.setPageIdsQuery(this.pageIds);
    }

    @action.bound onSelectSections() {
        this.showingDetails = false;
        this.isShowingExercises = false;
        this.setPageIdsQuery()
    }

    @action.bound setPageIdsQuery(pageIds = []) {
        const query = extend(Router.currentQuery(this.windowImpl), { pageIds: pageIds.join(',') })
        this.props.history.replace(this.windowImpl.location.pathname + '?' + qs.stringify(query))
    }

    render() {
        const classes = classnames( 'questions-dashboard', { 'is-showing-details': this.focusedExercise } );
        return (
            <div className={classes}>
                {!this.isShowingExercises && (
                    <SectionsChooser
                        {...this.props}
                        pageIds={this.pageIds}
                        onSelectionsChange={this.onSelectionsChange}
                    />
                )}
                {this.isShowingExercises && (
                    <ExercisesDisplay
                        {...this.props}
                        onSelectSections={this.onSelectSections}
                        showingDetails={this.showingDetails}
                        onShowCardViewClick={this.onShowCardViewClick}
                        onShowDetailsViewClick={this.onShowDetailsViewClick}
                        pageIds={this.pageIds} />
                )}
            </div>
        );
    }
}

export default QuestionsDashboard;
