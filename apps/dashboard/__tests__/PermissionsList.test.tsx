import { render, screen, fireEvent } from '@testing-library/react';
import { PermissionsList } from '../app/(auth)/permissions/PermissionsList';

const mockPermissions = [
    { id: 1, code: 'user.read', description: 'Read users' },
    { id: 2, code: 'user.write', description: 'Write users' },
    { id: 3, code: 'role.manage', description: 'Manage roles' },
];

describe('PermissionsList', () => {
    it('renders all permissions initially', () => {
        render(<PermissionsList permissions={mockPermissions} />);
        expect(screen.getByText('user.read')).toBeInTheDocument();
        expect(screen.getByText('user.write')).toBeInTheDocument();
        expect(screen.getByText('role.manage')).toBeInTheDocument();
    });

    it('filters permissions based on search input', () => {
        render(<PermissionsList permissions={mockPermissions} />);
        const input = screen.getByPlaceholderText('ค้นหารหัสสิทธิ์ (Code)');
        fireEvent.change(input, { target: { value: 'user' } });

        expect(screen.getByText('user.read')).toBeInTheDocument();
        expect(screen.getByText('user.write')).toBeInTheDocument();
        expect(screen.queryByText('role.manage')).not.toBeInTheDocument();
    });

    it('shows no results message when no permissions match', () => {
        render(<PermissionsList permissions={mockPermissions} />);
        const input = screen.getByPlaceholderText('ค้นหารหัสสิทธิ์ (Code)');
        fireEvent.change(input, { target: { value: 'NonExistent' } });

        expect(screen.getByText('ไม่พบข้อมูลสิทธิ์')).toBeInTheDocument();
    });
});
