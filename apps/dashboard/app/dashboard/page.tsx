import { loadCurrentUser } from '../../lib/auth';
import { DashboardHome } from './DashboardHome';

export default async function DashboardPage() {
  const currentUser = await loadCurrentUser();
  return <DashboardHome currentUser={currentUser} />;
}
