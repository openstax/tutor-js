import { React, PropTypes, observer } from 'vendor';
import { Icon, SuretyGuard } from 'shared';

const killEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
};

const HideButton = observer(({ event }) => {
    if (!event.is_deleted) { return null; }

    const onHideTask = () => {
        event.hide();
    };

    const guardProps = {
        okButtonLabel: 'Yes',
        onConfirm: onHideTask,
        placement: 'top',
        message: (
            <div>
                <p>
          If you remove this assignment, you will lose any progress or feedback you have received.
                </p>
                <p>
          Do you wish to continue?
                </p>
            </div>
        ),
    };

    return (
        <span>
            <SuretyGuard {...guardProps}>
                <Icon
                    size="lg"
                    type="close-circle"
                    className="hide-task"
                    buttonProps={{ variant: 'link' }}
                    onClick={killEvent}
                />
            </SuretyGuard>
            <span>
        Withdrawn
            </span>
        </span>
    );
});

HideButton.displayName = 'HideButton';
HideButton.propTypes = {
    event: PropTypes.object.isRequired,
};

export default HideButton;
