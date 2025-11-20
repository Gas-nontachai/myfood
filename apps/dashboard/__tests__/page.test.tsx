import { render, screen } from '@testing-library/react';
import DashboardPage from '../app/page';

describe('Dashboard page', () => {
  it('renders revenue cards', () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Today's revenue/i)).toBeInTheDocument();
    expect(screen.getAllByText(/vs yesterday/i).length).toBeGreaterThan(0);
  });
});
