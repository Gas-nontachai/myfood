import { render, screen, fireEvent } from '@testing-library/react';
import { UsersList } from '../app/(auth)/users/UsersList';

const mockProfiles = [
    { user_id: '1', username: 'user1', full_name: 'User One', status: 'active', role_primary: 1, created_at: '2023-01-01T00:00:00Z' },
    { user_id: '2', username: 'user2', full_name: 'User Two', status: 'inactive', role_primary: 2, created_at: '2023-01-02T00:00:00Z' },
];

const mockRoles = [
    { id: 1, name: 'Admin' },
    { id: 2, name: 'User' },
];

describe('UsersList', () => {
    it('renders active users by default', () => {
        render(<UsersList profiles={mockProfiles} roles={mockRoles} />);
        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.queryByText('user2')).not.toBeInTheDocument();
    });

    it('renders inactive users when clicking inactive tab', () => {
        render(<UsersList profiles={mockProfiles} roles={mockRoles} />);

        fireEvent.click(screen.getByText('ผู้ใช้ Inactive'));

        expect(screen.getByText('user2')).toBeInTheDocument();
        expect(screen.queryByText('user1')).not.toBeInTheDocument();
    });

    it('filters users based on search input in active tab', () => {
        render(<UsersList profiles={mockProfiles} roles={mockRoles} />);

        const input = screen.getByPlaceholderText('ค้นหาชื่อผู้ใช้');
        fireEvent.change(input, { target: { value: 'user1' } });

        expect(screen.getByText('user1')).toBeInTheDocument();
        expect(screen.queryByText('user2')).not.toBeInTheDocument();
    });

    it('shows empty state when no users match in active tab', () => {
        render(<UsersList profiles={mockProfiles} roles={mockRoles} />);

        const input = screen.getByPlaceholderText('ค้นหาชื่อผู้ใช้');
        fireEvent.change(input, { target: { value: 'NonExistent' } });

        expect(screen.getByText('ไม่พบผู้ใช้ในหมวดนี้')).toBeInTheDocument();
    });

    it('search works in inactive tab', () => {
        render(<UsersList profiles={mockProfiles} roles={mockRoles} />);
        fireEvent.click(screen.getByText('ผู้ใช้ Inactive'));

        const input = screen.getByPlaceholderText('ค้นหาชื่อผู้ใช้');
        fireEvent.change(input, { target: { value: 'user2' } });

        expect(screen.getByText('user2')).toBeInTheDocument();
        expect(screen.queryByText('user1')).not.toBeInTheDocument();
    });
});
