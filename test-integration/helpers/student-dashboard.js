import CourseSelect from './course-select';
import {expect} from 'chai';

const StudentDashboard = {

  load: function(test, options) {
    return new Promise( (resolve, reject) => {

      test.login(options.user).then(function(){

        CourseSelect.goToCourseByName(test, options.courseTitle);
        test.driver.wait( () => {
          return test.driver.isElementPresent({css: '.loadable.is-loading'})
            .then( (isPresent) => { return !isPresent; });
        });
        resolve( test.driver.findElement({css: '.student-dashboard'}) );

      });

    });
  },

  getTasks: function(el){
    return el.findElements({css: '.task'});
  },

  Tasks: {

    getTitle: function(el){
      return new Promise( (resolve, reject) =>{
        el.findElement({css: '.title'}).then( (title) =>{
          title.getText().then( (txt)=>{
            resolve(txt);
          });
        });
      })
    }

  }
}

module.exports = StudentDashboard;
