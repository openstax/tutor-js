import { React, PropTypes, observer } from 'vendor';

const Details = observer(() => {

  return <h1>Details</h1>;

});

Details.title = 'Assignment Details';

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;
