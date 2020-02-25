import { React, PropTypes, observer } from 'vendor';

const Scores = observer(() => {

  return <h1>Scores</h1>;

});

Scores.title = 'Assignment Scores';

Scores.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Scores;
