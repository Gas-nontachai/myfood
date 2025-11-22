import { render, screen } from '@testing-library/react';
import { DashboardHome } from '../components/DashboardHome';
import type { SessionWithAuth } from '../lib/auth';

const mockCurrentUser: SessionWithAuth = {
  userId: 'admin-1',
  email: 'admin@example.com',
  profile: null,
  permissions: {
    roles: ['admin'],
    permissions: ['user.manage']
  }
};

describe('DashboardHome', () => {
  it('shows the revenue summary and calls out admin actions', () => {
    render(<DashboardHome currentUser={mockCurrentUser} />);
    expect(screen.getByText(/ภาพรวมระบบวันนี้/i)).toBeInTheDocument();
    expect(screen.getByText(/ยอดขายวันนี้/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /จัดการผู้ใช้ POS/i })).toBeInTheDocument();
  });
});
