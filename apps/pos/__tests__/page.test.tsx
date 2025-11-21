import { render, screen } from '@testing-library/react';
import PosLandingPage from '../app/page';

describe('POS landing page', () => {
  it('shows the POS overview and quick links', () => {
    render(<PosLandingPage />);
    expect(screen.getByText(/MyFood POS/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /เข้าสู่ระบบพนักงาน/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /เมนูหลักหลังล็อกอิน/i })).toBeInTheDocument();
  });
});
