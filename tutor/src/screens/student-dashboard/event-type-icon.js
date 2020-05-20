import { React, styled, observer } from 'vendor';

const Icon = styled.i`
  height: 100%;
  width: 4rem;
  margin-right: 1rem;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
`;

const EventTypeIcon = observer(({ event }) => {
  return (
    <Icon type={event.type} className={`icon-${event.type}`} />
  );
});

export default EventTypeIcon;
