import { React, observer } from '../../helpers/react';
import { Alert } from 'react-bootstrap';
import NewTabLink from '../../components/new-tab-link';
import Icon from '../../components/icon';
import SupportEmailLink from '../../components/support-email-link';

export default
@observer
class Bio2eUnavailable extends React.Component {

  static title = 'Biology 2e will be available July 20, 2018';

  render() {
    return (
      <div>
        <p className="book-covers">
          <span className="book bio" />
          <Icon type="arrow-right" />
          <span className="book bio2e" />
        </p>
        <p>
          OpenStax Tutor Beta will use the new revision of our Biology textbook,
          including new assessments, for Fall 2018!
        </p>

        <Alert variant="warning">
          <Icon type="hand-paper" />
          <p>
            It is not possible to copy courses based on the first edition of Biology.
          </p>
        </Alert>
        <p>
          You can create a new Biology 2e course in OpenStax Tutor Beta starting July 20. Until then, view
          the <NewTabLink
            href="https://openstax.org/details/books/biology-2e"
          >Biology 2e textbook</NewTabLink>.
        </p>

        <p>
          Questions? Contact <SupportEmailLink displayEmail />.
        </p>

      </div>
    );
  }
};
