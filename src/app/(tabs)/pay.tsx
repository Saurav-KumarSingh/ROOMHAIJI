import { useLocalSearchParams } from 'expo-router';
import { useUser } from '@/context/user-context';
import { PayRentScreen } from '@/features/pay/PayRentScreen';
import { PropertiesScreen } from '@/features/properties/PropertiesScreen';

export default function PayRoute() {
  const { user } = useUser();
  const params = useLocalSearchParams<{ role?: string }>();

  const isLandlord = user.role === 'landlord' || params.role === 'landlord';

  if (isLandlord) {
    return <PropertiesScreen />;
  }

  return <PayRentScreen />;
}
