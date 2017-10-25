import React from 'react';
import UserMenu from '../models/user/menu';

export default function SupportEmailLink() {
  return (
    <a href={`mailto:${UserMenu.supportEmail}`}>Support</a>
  );
}
