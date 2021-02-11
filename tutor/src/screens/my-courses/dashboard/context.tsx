import React from 'react'
import UiSettings from 'shared/model/ui-settings'

interface Action {
    type: 'movePreviewResource'
    payload: any
}
interface State {
    isPreviewInResource: object
}
type Dispatch = (action: Action) => void
type MyCoursesDashboardContextProps = {children: React.ReactNode}

//setup
const MyCoursesDashboardStateContext = React.createContext<State | undefined>(undefined)
const MyCoursesDashboardStateDispatchContext = React.createContext<Dispatch | undefined>(
  undefined,
)
const myCoursesDashboardReducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'movePreviewResource': {
        //update the uiSettings first
        const uiSettings = UiSettings.get('isPreviewInResource') || {}
        UiSettings.set('isPreviewInResource', { ...uiSettings, [action.payload]: !state.isPreviewInResource[action.payload] })
        return {
            isPreviewInResource: {
                ...state.isPreviewInResource,
                [action.payload]: !state.isPreviewInResource[action.payload],
        },
    }
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}
const MyCoursesDashboardContext = ({ children }: MyCoursesDashboardContextProps) => {
  const [state, dispatch] = React.useReducer(myCoursesDashboardReducer, { isPreviewInResource: UiSettings.get('isPreviewInResource') || {} })
  return (
    <MyCoursesDashboardStateContext.Provider value={state}>
      <MyCoursesDashboardStateDispatchContext.Provider value={dispatch}>
        {children}
      </MyCoursesDashboardStateDispatchContext.Provider>
    </MyCoursesDashboardStateContext.Provider>
  )
}

//hooks
const useMyCoursesDashboardState = () => {
  const context = React.useContext(MyCoursesDashboardStateContext)
  if (context === undefined) {
    throw new Error('useMyCoursesDashboardState not defined')
  }
  return context
}
const useMyCoursesDashboardDispatch = () => {
  const context = React.useContext(MyCoursesDashboardStateDispatchContext)
  if (context === undefined) {
    throw new Error('useMyCoursesDashboardDispatch not defined')
  }
  return context
}
export { MyCoursesDashboardContext, useMyCoursesDashboardState, useMyCoursesDashboardDispatch }