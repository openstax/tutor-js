import { React, PropTypes, runInAction } from '../../vendor'
import { isEmpty, extend } from 'lodash';
import { observable, action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { Course, currentExercises, ExercisesMap } from '../../models';
import SectionsChooser from './sections-chooser';
import ExercisesDisplay from './exercises-display';
import Router from '../../helpers/router';
import Loading from 'shared/components/loading-animation';
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
    @observable isReady = false;
    @observable isShowingExercises = false;
    @observable showingDetails = false;
    @observable focusedExercise = false;
    @observable chapterIds;
    @observable pageIds = [];
    @observable defaultExercise;
    windowImpl;
    history;

    constructor(props) {
        super(props)
        modelize(this);

        this.windowImpl = props.windowImpl
        this.history = props.history
        const { pageIds, exerciseId } = Router.currentQuery()
        if (pageIds) {
            this.displayExercises(pageIds.split(','), exerciseId)
        } else {
            this.isReady = true
        }
    }

    @action async displayExercises(pageIds, exerciseId) {
        this.pageIds = pageIds
        this.isShowingExercises = true
        await this.props.exercises.fetch({
            limit: false,
            course: this.props.course,
            page_ids: this.pageIds,
        });
        if (exerciseId) {
            this.defaultExercise = this.props.exercises.get(exerciseId)
            this.showingDetails = true
        }
        runInAction(() => this.isReady = true);
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
        if (!this.isReady) {
            return <Loading />
        }

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
                        defaultExercise={this.defaultExercise}
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
