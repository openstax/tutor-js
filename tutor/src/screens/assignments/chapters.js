import { React, PropTypes } from 'vendor';
import { AssignmentBuilder } from './builder';
import SectionsChooser from '../../components/sections-chooser';

const Chapters = ({ ux }) => {

  return (
    <AssignmentBuilder
      title="Add Chapters"
      ux={ux}
    >
      <SectionsChooser
        ux={ux.course}
        course={ux.course}
        book={ux.referenceBook}
        selectedPageIds={ux.selectedPageIds}
        onSelectionChange={ux.onSectionIdsChange}
      />
    </AssignmentBuilder>
  );

};

Chapters.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Chapters;
