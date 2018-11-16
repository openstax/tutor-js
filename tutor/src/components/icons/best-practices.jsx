import React from 'react';
import StaticComponent from 'shared/components/static';
import { Icon } from 'shared';
import Theme from '../../theme';
export default class BestPracticesIcon extends StaticComponent {
  render() {
    return <Icon type="thumbs-up" color={Theme.colors.yellow} />
  }
}
