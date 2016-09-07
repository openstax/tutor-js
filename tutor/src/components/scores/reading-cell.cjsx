React  = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
classNames = require 'classnames'

Time = require '../time'
CellStatusMixin = require './cell-status-mixin'
PieProgress = require './pie-progress'
{LateWork} = require './late-work'

TH = require '../../helpers/task'

ReadingCell = React.createClass

  getInitialState: ->
    isShowingPopover: false

  mixins: [CellStatusMixin] # prop validation

  show: -> @setState(isShowingPopover: true)
  hide: -> @setState(isShowingPopover: false)

  getPieChartTarget: ->
    @refs.pieChart.getDOMNode()

  render: ->
    {task, courseId, displayAs, isConceptCoach, rowIndex, columnIndex, period_id} = @props

    <div className="scores-cell"
      onMouseOver={@show}
      onMouseLeave={@hide}
    >

      <div className="worked wide">

        <BS.Overlay
          target={@getPieChartTarget}
          show={@state.isShowingPopover}
          onHide={@hide}
          placement="left"
        >
          <BS.Popover
            onMouseOver={@show}
            onMouseLeave={@hide}
            id="scores-cell-info-popover-#{task.id}"
            className='scores-scores-tooltip-completed-info'>
            <div className='info'>
              <div className='row'>
                <div>Completed {TH.getHumanCompletedPercent(task)}</div>
              </div>
              <div className='row'>
                <div>
                  <Router.Link to='viewTaskStep'
                    data-assignment-type="#{task.type}"
                    params={courseId: courseId, id: task.id, stepIndex: 1}>
                      Review
                  </Router.Link>
                </div>
              </div>
            </div>
          </BS.Popover>
        </BS.Overlay>

        <PieProgress
          ref="pieChart"
          isConceptCoach={isConceptCoach}
          size={20}
          value={TH.getCompletedPercent(task)}
          isLate={TH.isDue(task)}
        />

      </div>

      <LateWork
        task={task}
        onMouseOver={@show}
        onMouseLeave={@hide}
        columnIndex={columnIndex} />

    </div>



module.exports = ReadingCell
