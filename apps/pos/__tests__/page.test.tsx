import { render, screen } from '@testing-library/react';
import PosPage from '../app/page';

describe('POS page', () => {
  it('shows ticket list', () => {
    render(<PosPage />);
    expect(screen.getByText(/Tonight's orders/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Order #/i).length).toBeGreaterThan(0);
  });
});
