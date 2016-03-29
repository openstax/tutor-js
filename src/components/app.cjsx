React = require 'react'
BS = require 'react-bootstrap'
Exercise = require './exercise'

module.exports = React.createClass
	displayName: 'App'
	getInitialState: -> {exerciseId: 'new'}

	update: (event) ->
		exerciseId = event.target.value
		@setState({exerciseId})

	render: ->
		if @props.id then return <Exercise id={@props.id} />

		<BS.Grid>
			<BS.Row><BS.Col xs={6}>
				<p>
					<label htmlFor="exercise-id">Exercise ID:</label>
					<input id="exercise-id" type="number" onChange={@update} />
				</p>
				<p><a href="/exercises/#{@state.exerciseId}" className="btn btn-primary">
					Go to Exercise
				</a></p>
			</BS.Col><BS.Col xs={6}>
				<p className="btn btn-success add-exercise">
					<a href="/exercises/new">
						<i className="fa fa-plus-circle" />
						Add New Exercise
					</a>
				</p>
			</BS.Col></BS.Row>
		</BS.Grid>
