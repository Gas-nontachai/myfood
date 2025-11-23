import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/page';
import { loadCurrentUser } from '../lib/auth';
import type { SessionWithAuth } from '../lib/auth';
import { redirect } from 'next/navigation';

jest.mock('../lib/auth', () => ({
  loadCurrentUser: jest.fn()
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn()
}));

const mockLoadCurrentUser = loadCurrentUser as jest.MockedFunction<typeof loadCurrentUser>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;

const activeSession: SessionWithAuth = {
  userId: 'user-123',
  email: 'cashier@local.local',
  profile: {
    user_id: 'user-123',
    username: 'cashier',
    full_name: 'POS Cashier',
    role_primary: 3,
    status: 'active',
    created_at: new Date().toISOString()
  },
  permissions: {
    roles: ['cashier'],
    permissions: ['user.manage']
  }
};

describe('POS dashboard page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to login when there is no session', async () => {
    mockLoadCurrentUser.mockResolvedValueOnce(null);
    mockRedirect.mockImplementationOnce(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith('/login');
  });

  it('redirects to account disabled page when profile is inactive', async () => {
    mockLoadCurrentUser.mockResolvedValueOnce({
      ...activeSession,
      profile: { ...activeSession.profile!, status: 'inactive' }
    });
    mockRedirect.mockImplementationOnce(() => {
      throw new Error('NEXT_REDIRECT');
    });

    await expect(DashboardPage()).rejects.toThrow('NEXT_REDIRECT');
    expect(mockRedirect).toHaveBeenCalledWith('/account-disabled');
  });

  it('renders the dashboard when session is active', async () => {
    mockLoadCurrentUser.mockResolvedValueOnce(activeSession);
    mockRedirect.mockImplementation(() => undefined);

    const ui = await DashboardPage();
    render(ui);

    expect(screen.getByRole('heading', { name: /POS/i })).toBeInTheDocument();
  });
});
