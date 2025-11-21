'use client';

import { Button } from '@myfood/shared-ui';
import { logoutAction } from '../lib/auth';

export function LogoutButton() {
  return (
    <form action={logoutAction} method="POST">
      <Button intent="ghost" size="sm" type="submit">
        ออกจากระบบ
      </Button>
    </form>
  );
}
