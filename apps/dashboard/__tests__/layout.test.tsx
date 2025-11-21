import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock next/navigation usePathname used inside DashboardShell
jest.mock('next/navigation', () => ({
  usePathname: () => '/login'
}));

// Mock shared UI Breadcrumbs to a simple component
jest.mock('@myfood/shared-ui', () => ({
  Breadcrumbs: ({ children }: any) => React.createElement('div', {}, children)
}));

// Mock client-side components imported by DashboardShell to keep test focused
jest.mock('../components/AdminHeaderProfile', () => ({
  AdminHeaderProfile: ({ currentUser, roleName }: any) =>
    React.createElement('div', { 'data-testid': 'admin-profile' }, `${roleName ?? 'no-role'}`)
}));

jest.mock('../components/AuthStateProvider', () => ({
  AuthStateProvider: ({ children }: any) => React.createElement('div', {}, children)
}));

jest.mock('../components/LogoutButton', () => ({
  LogoutButton: () => React.createElement('button', {}, 'Logout')
}));

import { DashboardShell } from '../components/DashboardShell';
import { computeShouldHideLayout } from '../app/layoutUtils';

describe('layout and DashboardShell visibility', () => {
  test('computeShouldHideLayout returns true for /login', () => {
    expect(computeShouldHideLayout('/login')).toBe(true);
    expect(computeShouldHideLayout('/dashboard/login')).toBe(true);
    expect(computeShouldHideLayout('/dashboard/no-access')).toBe(true);
    expect(computeShouldHideLayout('/account-disabled')).toBe(true);
  });

  test('computeShouldHideLayout returns false for other routes', () => {
    expect(computeShouldHideLayout('/dashboard')).toBe(false);
    expect(computeShouldHideLayout('/dashboard/users')).toBe(false);
  });

  test('DashboardShell hides header and sidebar when props set', () => {
    render(
      <DashboardShell currentUser={null} roleName={null} hideSidebar={true} hideHeader={true}>
        <div>Child content</div>
      </DashboardShell>
    );

    // Sidebar contains the word 'เมนู' in Thai in the component. It should not be present
    expect(screen.queryByText('เมนู')).not.toBeInTheDocument();

    // Header title 'ศูนย์ควบคุมแอดมิน' should not be present when hideHeader is true
    expect(screen.queryByText('ศูนย์ควบคุมแอดมิน')).not.toBeInTheDocument();

    // Children must still be rendered
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });
});
