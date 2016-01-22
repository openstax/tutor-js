import {describe, StudentDashboard} from '../helpers';
import {expect} from 'chai';
import _ from 'underscore';

describe('Student Dashboard', function() {

  this.it('Displays Tasks', function(done) {
    // Why doesn't this work?  The await throws an "Unexpected token SyntaxError"
    // await StudentDashboard.load(this, {user: 'student01', courseTitle:'Biology I'})
    StudentDashboard.load(this, {user: 'student01', courseTitle:'Biology I'}).then( (dash) => {
      StudentDashboard.getTasks(dash).then( (tasks)=>{
        console.log("Found",tasks.length," tasks");
        Promise.all( _.map(tasks, StudentDashboard.Tasks.getTitle) ).then( (titles) =>{
          console.log(titles);
          done()
        });
      });
    });

  });
})
