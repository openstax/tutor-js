import { React, PropTypes, cn, observer, action, observable } from 'vendor';
import { forceReload } from '../../helpers/reload';
import { AsyncButton } from 'shared';

@observer
class ReloadPageButton extends React.Component {

    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
        windowImpl: PropTypes.object,
    }

    static defaultProps = {
        children: 'Reload Page',
    }

    @observable isReloading = false;

    @action.bound onReload() {
        this.isReloading = true;
        const { windowImpl } = this.props;
        forceReload({ windowImpl });
    }

    render() {
        return (
            <AsyncButton
                className={cn('reload-page', this.props.className)}
                isWaiting={this.isReloading}
                variant="primary"
                size="small"
                waitingText="Reloading…"
                onClick={this.onReload}
            >
                {this.props.children}
            </AsyncButton>
        );
    }

}

export default ReloadPageButton;
