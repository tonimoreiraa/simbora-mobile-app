import {View, Text} from 'react-native';
import {
  Clock,
  CheckCircle,
  Gear,
  PauseCircle,
  Wallet,
  CurrencyCircleDollar,
  Hammer,
  Truck,
  Car,
  CheckSquare,
  Trophy,
  X,
  ArrowsClockwise,
  WarningCircle,
  Package,
  GitBranch,
  Hourglass,
  Cube,
  Question,
} from 'phosphor-react-native';
import tw from 'twrnc';

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<string, {color: string; icon: any; label?: string}> =
  {
    Pending: {color: 'yellow', icon: Clock},
    Confirmed: {color: 'blue', icon: CheckCircle},
    Processing: {color: 'blue', icon: Gear},
    'On Hold': {color: 'gray', icon: PauseCircle},
    'Awaiting Payment': {color: 'purple', icon: Wallet},
    'Payment Received': {color: 'green', icon: CurrencyCircleDollar},
    'In Production': {color: 'blue', icon: Hammer},
    Shipped: {color: 'teal', icon: Truck},
    'Out for Delivery': {color: 'indigo', icon: Car},
    Delivered: {color: 'green', icon: CheckSquare},
    Completed: {color: 'emerald', icon: Trophy},
    Cancelled: {color: 'red', icon: X},
    Refunded: {color: 'amber', icon: ArrowsClockwise},
    Failed: {color: 'red', icon: WarningCircle},
    Returned: {color: 'amber', icon: Package},
    'Partially Shipped': {color: 'teal', icon: GitBranch},
    Backordered: {color: 'violet', icon: Hourglass},
    Retirada: {color: 'orange', icon: Cube},
  };

export function OrderStatusBadge({status}: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {color: 'gray', icon: Question};

  const colorClass = `${config.color}-300`;
  const IconComponent = config.icon;

  return (
    <View
      style={tw`flex flex-row items-center justify-center rounded-3xl border-[0.5px] border-${colorClass} mt-2 py-1 w-36`}>
      <IconComponent
        size={18}
        color={tw.color(`${colorClass}`)}
        weight="bold"
      />
      <Text style={tw`ml-1 text-${colorClass} font-semibold text-lg`}>
        {config.label || status}
      </Text>
    </View>
  );
}
