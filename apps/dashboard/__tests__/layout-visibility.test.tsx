import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DashboardShell } from '../components/DashboardShell';
import { computeShouldHideLayout } from '../app/layoutUtils';

// Mocks
const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
    usePathname: () => mockUsePathname(),
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

jest.mock('@myfood/shared-ui', () => ({
    Breadcrumbs: () => <div data-testid="breadcrumbs">Breadcrumbs</div>,
}));

jest.mock('../components/AdminHeaderProfile', () => ({
    AdminHeaderProfile: () => <div data-testid="admin-profile">Profile</div>,
}));

jest.mock('../components/LogoutButton', () => ({
    LogoutButton: () => <button>Logout</button>,
}));

jest.mock('../components/AuthStateProvider', () => ({
    AuthStateProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Layout Visibility Logic', () => {
    beforeEach(() => {
        mockUsePathname.mockReturnValue('/dashboard');
    });

    describe('computeShouldHideLayout', () => {
        it('should return true for login routes', () => {
            expect(computeShouldHideLayout('/login')).toBe(true);
            expect(computeShouldHideLayout('/dashboard/login')).toBe(true);
        });

        it('should return true for no-access routes', () => {
            expect(computeShouldHideLayout('/dashboard/no-access')).toBe(true);
            expect(computeShouldHideLayout('/account-disabled')).toBe(true);
        });

        it('should return false for normal dashboard routes', () => {
            expect(computeShouldHideLayout('/dashboard')).toBe(false);
            expect(computeShouldHideLayout('/dashboard/users')).toBe(false);
            expect(computeShouldHideLayout('/users')).toBe(false);
        });
    });

    describe('DashboardShell Visibility Props', () => {
        it('should hide sidebar and header when props are true', () => {
            render(
                <DashboardShell
                    currentUser={null}
                    roleName="admin"
                    hideSidebar={true}
                    hideHeader={true}
                >
                    <div data-testid="content">Content</div>
                </DashboardShell>
            );

            // Sidebar should not be visible
            // The sidebar has text "เมนู"
            expect(screen.queryByText('เมนู')).not.toBeInTheDocument();

            // Header should not be visible
            // The header has text "ศูนย์ควบคุมแอดมิน"
            expect(screen.queryByText('ศูนย์ควบคุมแอดมิน')).not.toBeInTheDocument();

            // Content should be visible
            expect(screen.getByTestId('content')).toBeInTheDocument();
        });

        it('should hide sidebar and header when on login route (internal logic)', () => {
            // Mock usePathname to return /login
            mockUsePathname.mockReturnValue('/login');

            render(
                <DashboardShell
                    currentUser={null}
                    roleName="admin"
                >
                    <div data-testid="content">Content</div>
                </DashboardShell>
            );

            expect(screen.queryByText('เมนู')).not.toBeInTheDocument();
            expect(screen.queryByText('ศูนย์ควบคุมแอดมิน')).not.toBeInTheDocument();
        });

        it('should show sidebar and header when props are false (default) and route is normal', () => {
            // Mock usePathname to return /dashboard
            mockUsePathname.mockReturnValue('/dashboard');

            render(
                <DashboardShell
                    currentUser={null}
                    roleName="admin"
                    hideSidebar={false}
                    hideHeader={false}
                >
                    <div data-testid="content">Content</div>
                </DashboardShell>
            );

            // Sidebar should be visible
            expect(screen.getByText('เมนู')).toBeInTheDocument();

            // Header should be visible
            expect(screen.getByText('ศูนย์ควบคุมแอดมิน')).toBeInTheDocument();
        });
    });
});

