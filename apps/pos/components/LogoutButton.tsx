'use client';

import { useTransition } from 'react';
import { Button, type ButtonProps } from '@myfood/shared-ui';
import { logoutAction } from '../lib/auth';

type LogoutButtonProps = Omit<ButtonProps, 'onClick'> & {
  label?: string;
};

export function LogoutButton({
  label = 'ออกจากระบบ',
  intent = 'ghost',
  size = 'sm',
  disabled,
  ...rest
}: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      intent={intent}
      size={size}
      disabled={disabled || isPending}
      onClick={() => startTransition(() => logoutAction())}
      {...rest}
    >
      {isPending ? 'กำลังออก...' : label}
    </Button>
  );
}
