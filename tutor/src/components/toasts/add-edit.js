import { React } from 'vendor';

const QuestionPublished = () => {
  return (
    <div className="toast success" data-test-id="question-published-toast">
      <div className="title">
        <span>Question Published</span>
      </div>
      <div className="body">
        <p>
            Question has been successfully published.
        </p>
      </div>
    </div>
  );
};

export default QuestionPublished;
