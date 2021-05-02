import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, observable, modelize } from 'shared/model'
import cn from 'classnames';
import { Icon } from 'shared';
import { Note, PageNotes, WindowSize } from '../../models';
import getRangeRect from './getRangeRect';

@observer
class NoteButton extends React.Component {
    static propTypes = {
        isActive: PropTypes.bool,
        note: PropTypes.instanceOf(Note).isRequired,
        highlighter: PropTypes.object,
        onClick: PropTypes.func.isRequired,
        activeNote: PropTypes.instanceOf(Note),
        containerTop: PropTypes.number.isRequired,
        windowImpl: PropTypes.object,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    calculateTop() {
        const { note, highlighter, windowImpl } = this.props ;
        const highlight = highlighter.getHighlight(note.id);
        if (!highlight) {
            return null;
        }
        const { top } = getRangeRect(windowImpl, highlight.range);
        return top;
    }

    @action.bound onClick() {
        this.props.onClick(this.props.note);
    }

    render() {

        const { note, isActive, containerTop } = this.props;
        const highlightTop = this.calculateTop();
        if (highlightTop == null) { return null; }

        const top = highlightTop - containerTop - 5;
        return (
            <Icon
                type="comment-solid"
                key={note.id}
                className={cn('sidebar-button', { active: isActive })}
                buttonProps={{ style: { top } }}
                title="View note"
                onClick={this.onClick}
            />
        );
    }
}

@observer
export default
class SidebarButtons extends React.Component {
    static propTypes = {
        notes: PropTypes.instanceOf(PageNotes).isRequired,
        parentRect: PropTypes.shape({
            top: PropTypes.number,
        }),
        highlighter: PropTypes.object,
        onClick: PropTypes.func.isRequired,
        activeNote: PropTypes.instanceOf(Note),
        windowImpl: PropTypes.object,
    }

    windowSize = new WindowSize({ windowImpl: this.props.windowImpl });

    @observable containerTop = null;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound setContainerRef(el) {
        this.containerTop = el ? getRangeRect(this.props.windowImpl, el).top : null;
    }

    renderNotes() {
        return this.props.notes.array.map(note =>
            note.annotation && (
                <NoteButton
                    key={note.id}
                    isActive={this.props.activeNote === note}
                    containerTop={this.containerTop}
                    {...this.props}
                    note={note}
                />
            )
        );
    }

    render() {
        if (!this.props.highlighter) { return null; }
        return (
            <div className="note-edit-buttons" ref={this.setContainerRef} key={this.windowSize.width}>
                {this.containerTop && this.renderNotes()}
            </div>
        );

    }
}
