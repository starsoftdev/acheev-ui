// @flow

import React from 'react';
import SocialLogin from 'react-social-login';

import Button from 'components/Button';

type Props = {
  children: React.Node,
  triggerLogin: Function,
};

const SocialButton = ({ children, triggerLogin, ...props }: Props) => (
  <Button onClick={triggerLogin} {...props}>
    {children}
  </Button>
);

export default SocialLogin(SocialButton);
