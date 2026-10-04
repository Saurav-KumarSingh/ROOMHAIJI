import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/user-context';
import { TenantIssuesScreen } from '@/features/issues/TenantIssuesScreen';
import { LandlordPaymentsScreen } from '@/features/landlord/LandlordPaymentsScreen';

export default function IssuesRoute() {
  const { user } = useUser();
  const params = useLocalSearchParams<{ role?: string }>();

  const isLandlord = user.role === 'landlord' || params.role === 'landlord';

  if (isLandlord) {
    return <LandlordPaymentsScreen />;
  }

  return <TenantIssuesScreen />;
}
