import { render, screen } from '@testing-library/react';
import StartPage from '../app/customer/start/page';

describe('Customer start experience', () => {
  it('shows the signup hero and CTA', () => {
    render(<StartPage />);
    expect(screen.getByText(/ลงชื่อเข้าใช้/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /เริ่มสั่งอาหาร/i })).toBeInTheDocument();
  });
});
