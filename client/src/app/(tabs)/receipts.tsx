import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/user-context';
import { LandlordTenantsScreen } from '@/features/landlord/LandlordTenantsScreen';
import { ReceiptsScreen } from '@/features/receipts/ReceiptsScreen';

export default function ReceiptsRoute() {
  const { user } = useUser();
  const params = useLocalSearchParams<{ role?: string }>();

  const isLandlord = user.role === 'landlord' || params.role === 'landlord';

  if (isLandlord) {
    return <LandlordTenantsScreen />;
  }

  return <ReceiptsScreen />;
}
