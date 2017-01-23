const Helpers = require '../helpers';
const {describe} = Helpers;
const {freshId} = Helpers;
{expect} = require 'chai';
_ = require 'underscore'

describe('Student Dashboard', function(){

  beforeEach( function(){
    this.student = new Helpers.User(this);
    this.courseSelect = new Helpers.CourseSelect(this);
    this.dash = new Helpers.StudentDashboard.Dashboard(this);
    this.student.login('student01');
    this.courseSelect.goToByTitle('Biology I');
  });

  this.xit('Has valid sub components', function(){
    expect(this.dash.el.progressGuide).not.to.not.be.null;
    expect(this.dash.el.thisWeek).not.to.not.be.null;
  });

  this.xit('displays tasks that are assigned', async function(){

    const title = this.utils.getFreshId();
    this.student.logout();
    const teacher = new Helpers.User(this);
    teacher.login('teacher01');
    this.courseSelect.goToByTitle('Biology I');
    const calendar = new Helpers.Calendar(this);
    calendar.createNew('READING');
    const reading = new Helpers.TaskBuilder(this);

    reading.edit({
      name: title,
      opensAt: 'TODAY',
      dueAt: 'EARLIEST',
      sections: [1.2],
      action: 'PUBLISH'
    });
    teacher.logout()

    this.student.login('student01');
    this.courseSelect.goToByTitle('Biology I');

    const eventEls = await this.dash.findVisibleEvents({
      where: {title: title}
    });
    expect(eventEls.length).to.equal(1)
    const event = await StudentDashboard.Event.fromElement(
      this, _.first(eventEls)
    )
    expect(event).not.to.be.null
    expect(event).to.be.an.instanceof(StudentDashboard.Event)

    const eventTitle = await event.el.title.get().getText()
    expect(eventTitle).to.equal(title)

    const progress = await event.el.progress.get().getText()
    expect(progress).to.equal('Not started')

    const unstartedEvents = await this.dash.findVisibleEvents({
      where: {progress:'Not started'}
    });
    expect(unstartedEvents).not.to.be.empty;

    // that's all folks
    this.student.logout();

  });


});
