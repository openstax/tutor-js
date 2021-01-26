import { React } from 'vendor';

const CourseSettingsSaved = () => {
  return (
    <div className="toast success" data-test-id="course-settings-published">
      <div className="title">
        <span>Course Settings Saved</span>
      </div>
      <div className="body">
        <p>
            Your course settings has been successfully saved.
        </p>
      </div>
    </div>
  );
};

export default CourseSettingsSaved;
