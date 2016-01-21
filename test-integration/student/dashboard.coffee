{describe, CourseSelect, Calendar, ReadingBuilder, StudentDashboard} = require '../helpers'
{expect} = require 'chai'
_ = require 'underscore'


describe 'Student Dashboard', ->

  @it 'Shows Performance Forecast', ->
    @dash = new StudentDashboard(@, 'student01', 'Biology I')
    guide = @dash.progressGuide()
    expect(guide.valid).to.equal(true, 'Forecast is missing')

  @it 'can read forecast topic', ->
    @dash = new StudentDashboard(@, 'student01', 'Biology I')
    forecast = @dash.progressGuide().getForecast(index: 0)
    forecast.getTopic().then (topic) ->
      expect(topic.chapter_section).to
        .match(/\d+\.\d+/, "First topic had incorrect chapter_section")


  @it 'Can practice Forecast', (done) ->
    @dash = new StudentDashboard(@, 'student01', 'Biology I')
    forecast = @dash.progressGuide().getForecast(index: 1)
    expect(forecast.valid).to.equal(true, 'Forecast was not found')
    forecast.practice().then (taskstep) ->
      taskstep.getExerciseId().then (num) ->
        expect(num).to.match(/\d+\@\d+/)
        done()


  it 'displays tasks that are assigned', ->
    title = @freshId()
    @login('teacher01')
    CourseSelect.goToCourseByName(@, 'Biology I')
    Calendar.createNew(@, 'READING')
    ReadingBuilder.edit @,
      name: title
      opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.2]
      action: 'PUBLISH'
    @logout()

    @dash = new StudentDashboard(@, 'student01', 'Biology I')
    @dash.findVisibleTask(title: title).then (task) ->
      expect(task).not.to.be.null
      expect(task).to.be.an.instanceof(DashboardTask)
      task.getTitle().then (taskTitle) ->
        expect(taskTitle).to.equal(title)
      task.getProgress().then (progress) ->
        expect(progress).to.equal('Not started')
    @logout()
