import { React, PropTypes } from 'vendor';
import { AssignmentBuilder, Body } from './builder';
import SectionsChooser from '../../components/sections-chooser';

const Chapters = ({ ux }) => {

  return (
    <AssignmentBuilder
      title="Add Chapters"
      ux={ux}
    >
      <Body>
        <SectionsChooser
          ux={ux.course}
          course={ux.course}
          book={ux.referenceBook}
          selectedPageIds={ux.selectedPageIds}
          onSelectionChange={ux.onSectionIdsChange}
        />
      </Body>
    </AssignmentBuilder>
  );

};

Chapters.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Chapters;
