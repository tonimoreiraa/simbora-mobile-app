import {View, Text} from 'react-native';
import tw from 'twrnc';
import Forecast from './forecast';
import {OrderStatusBadge} from './order_status_badge';
import {Truck, Package, ShoppingBag} from 'phosphor-react-native';
interface ProductForecastProps {
  order: {
    id: number | string;
    status: string;
    items?: any[];
    shipping?: any;
    createdAt?: string | Date;
  };
}

const orderTypeIcons: Record<string, any> = {
  delivery: Truck,
  pickup: Package,
  default: ShoppingBag,
};

function ProductForecast({order}: ProductForecastProps) {
  const orderType = order.shipping?.type || 'default';
  const IconComponent = orderTypeIcons[orderType] || orderTypeIcons.default;

  const formattedOrderId =
    typeof order.id === 'number' ? `#${order.id}` : `#${order.id}`;

  return (
    <View
      style={tw`flex-col rounded-xl mt-2 p-2 w-full border-[0.5px] border-stone-300 items-start`}>
      <View style={tw`flex flex-row w-full`}>
        <View
          style={tw`bg-stone-100 p-2 rounded-xl w-28 h-28 items-center justify-center`}>
          <IconComponent
            weight="fill"
            size={60}
            color={tw.color('stone-500')}
          />
        </View>
        <View style={tw`ml-3`}>
          <View style={tw`flex flex-col pt-2`}>
            <Text style={tw`text-lg font-normal text-stone-900`}>Pedido</Text>
            <Text style={tw`text-lg font-normal text-stone-900`}>
              {formattedOrderId}
            </Text>
          </View>
          <OrderStatusBadge status={order.status} />
        </View>
      </View>
      <Forecast />
    </View>
  );
}

export default ProductForecast;
