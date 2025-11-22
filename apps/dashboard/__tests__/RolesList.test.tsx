import { render, screen, fireEvent } from '@testing-library/react';
import { RolesList } from '../app/dashboard/roles/RolesList';

const mockRoles = [
    { id: 1, name: 'Admin', description: 'Administrator' },
    { id: 2, name: 'User', description: 'Regular user' },
    { id: 3, name: 'Manager', description: 'Store manager' },
];

describe('RolesList', () => {
    it('renders all roles initially', () => {
        render(<RolesList roles={mockRoles} />);
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Manager')).toBeInTheDocument();
    });

    it('filters roles based on search input', () => {
        render(<RolesList roles={mockRoles} />);
        const input = screen.getByPlaceholderText('ค้นหาชื่อบทบาท');
        fireEvent.change(input, { target: { value: 'Admin' } });

        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.queryByText('User')).not.toBeInTheDocument();
        expect(screen.queryByText('Manager')).not.toBeInTheDocument();
    });

    it('shows no results message when no roles match', () => {
        render(<RolesList roles={mockRoles} />);
        const input = screen.getByPlaceholderText('ค้นหาชื่อบทบาท');
        fireEvent.change(input, { target: { value: 'NonExistent' } });

        expect(screen.getByText('ไม่พบข้อมูลบทบาท')).toBeInTheDocument();
    });
});
