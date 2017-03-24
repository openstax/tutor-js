Tutor has helpful tips that automatically appear for for various audiences.  These
are called "Training wheels" or "Tours".

They're built using these models and components:

## Models

### [Tours](models/tour.js)
A set of instructions for viewing a Training Wheel, has-many TourSteps

### [Step](models/tour/step.js)
A step in a tour, where steps are connected by a “next” button that leads from one step to the next.  Has a title and rich text body, along with action’s that will be played when they’re displayed.  Steps will usually have a anchor and position they should point, but some are “anchorless” and will be centered on the active **Region**.

### [Action](models/tour/actions/)
A bit of scripted logic that knows how to manipulate tutor.  A action has `beforeStep` and `afterStep` methods.  A an example is the “[open calendar sidebar](models/tour/actions/open-calendar-sidebar.js)” action that will open the teacher’s calendar sidebar if it’s not already opened, and then close it after the step (if it was closed before).

### [Context](models/tour/context.js)
Describes the current state of the UI.  Created by the **Conductor** and shared via mobx context injection with it's children *Regions* and *Anchors*, who will check in/out of the context as the UI updates.  The context knows who the current user is, their roles, and the course’s that are being viewed.

When appropriate, the context will provide a **Ride** for the *Conductor* to display.

#### [Ride](models/tour/ride.js)
A ride generates instructions for displaying a **Tour**, and records progress as it is viewed.

## React Elements:

### [TourConductor](components/tours/conductor.jsx)
Main wrapper React element that has exports the **Context** model for it’s child Regions and Anchors

### [Region](components/tours/region.jsx)
Encapsulates a region of the screen that tours will be displayed on.  Provides the Conductor’s context with a course id.   Tour steps that do not point to an anchor will be centered on it.

### [Anchor](components/tours/anchor.jsx)
Visual elements that a TourStep points to.  Anchors have an identifier that corresponds with a **Step** for a tour and wrap other React elements
