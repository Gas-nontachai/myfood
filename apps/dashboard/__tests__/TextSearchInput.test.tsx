import { render, screen, fireEvent } from '@testing-library/react';
import { TextSearchInput } from '../components/TextSearchInput';

describe('TextSearchInput', () => {
    it('renders input with placeholder', () => {
        render(<TextSearchInput value="" onChange={() => { }} placeholder="Search..." />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('calls onChange when typing', () => {
        const handleChange = jest.fn();
        render(<TextSearchInput value="" onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });
        expect(handleChange).toHaveBeenCalledWith('test');
    });

    it('shows clear button when value is not empty', () => {
        render(<TextSearchInput value="test" onChange={() => { }} />);
        expect(screen.getByLabelText('Clear search')).toBeInTheDocument();
    });

    it('does not show clear button when value is empty', () => {
        render(<TextSearchInput value="" onChange={() => { }} />);
        expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });

    it('clears input when clear button is clicked', () => {
        const handleChange = jest.fn();
        render(<TextSearchInput value="test" onChange={handleChange} />);
        const clearButton = screen.getByLabelText('Clear search');
        fireEvent.click(clearButton);
        expect(handleChange).toHaveBeenCalledWith('');
    });

    it('handles undefined value gracefully', () => {
        // @ts-ignore - Testing runtime behavior
        render(<TextSearchInput value={undefined} onChange={() => { }} />);
        expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
    });
});
