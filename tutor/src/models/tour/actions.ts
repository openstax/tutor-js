import OpenActionsMenu from './actions/open-actions-menu';
import OpenCalendarSidebar from './actions/open-calendar-sidebar';
import OpenSupportMenu from './actions/open-support-menu';
import HoverExercise from './actions/hover-exercise';

// TourActions
// scripted bits of logic for tour transitions like
// “Open User Menu” or “Advance Teacher Calendar” that will mimic user action during a tour.
// actions have an id and are specified as the TourStep

const ACTIONS = {
    'open-actions-menu': OpenActionsMenu,
    'hover-exercise': HoverExercise,
    'open-calendar-sidebar': OpenCalendarSidebar,
    'open-support-menu': OpenSupportMenu,
}

export type TourActionID = keyof typeof ACTIONS

export default {

    forIdentifier(id: TourActionID) {
        return ACTIONS[id]
    },

};
