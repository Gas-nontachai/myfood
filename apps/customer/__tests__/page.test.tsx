import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Customer landing page', () => {
  it('shows hero and CTA', () => {
    render(<Page />);
    expect(screen.getByText(/better dine-in ordering/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /start an order/i })).toBeInTheDocument();
  });
});
