import OpenDowndownMenu from './open-dropdown-menu';

export default class OpenSupportMenu extends OpenDowndownMenu {

    get menu() {
        return document.querySelector('button#support-menu');
    }

}
