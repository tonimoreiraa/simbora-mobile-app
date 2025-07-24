import {View, Text, TouchableOpacity} from 'react-native';
import tw from 'twrnc';
import {Truck, Package, CaretRight, Check} from 'phosphor-react-native';

interface ProductForecastProps {
  order: {
    id: number | string;
    status: string;
    items?: any[];
    shipping?: any;
    createdAt?: string | Date;
    deliveryDate?: string | Date;
    estimatedDelivery?: string | Date;
  };
  onPress?: () => void;
}

const orderTypeIcons: Record<string, any> = {
  delivery: Truck,
  pickup: Package,
  default: Truck,
};

const statusTranslations: Record<string, string> = {
  Pending: 'Pendente',
  Confirmed: 'Confirmado',
  Processing: 'Processando',
  'On Hold': 'Em espera',
  'Awaiting Payment': 'Aguardando pagamento',
  'Payment Received': 'Pagamento recebido',
  'In Production': 'Em produção',
  Shipped: 'Enviado',
  'Out for Delivery': 'Em rota',
  Delivered: 'Entregue',
  Completed: 'Concluído',
  Cancelled: 'Cancelado',
  Refunded: 'Reembolsado',
  Failed: 'Falhou',
  Returned: 'Devolvido',
  'Partially Shipped': 'Parcialmente enviado',
  Backordered: 'Em falta',
};

function ProductForecast({order, onPress}: ProductForecastProps) {
  const orderType = order.shipping?.type || 'default';
  const IconComponent = orderTypeIcons[orderType] || orderTypeIcons.default;

  const formatOrderId = (id: number | string) => {
    const numericId = typeof id === 'string' ? parseInt(id) || 0 : id;
    return `#${numericId.toString().padStart(4, '0')}`;
  };

  const formattedOrderId = formatOrderId(order.id);

  const translatedStatus = statusTranslations[order.status] || order.status;

  const formatDate = (date: string | Date | undefined) => {
    if (!date) {
      return '';
    }
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
      case 'entregue':
        return {
          bgColor: 'bg-white',
          textColor: 'text-blue-600',
          borderColor: 'border-blue-600',
          icon: Check,
          iconColor: '#2563EB',
        };
      case 'out for delivery':
      case 'em rota':
        return {
          bgColor: 'bg-white',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          icon: Truck,
          iconColor: '#6B7280',
        };
      case 'shipped':
      case 'enviado':
        return {
          bgColor: 'bg-white',
          textColor: 'text-orange-700',
          borderColor: 'border-orange-300',
          icon: Truck,
          iconColor: '#EA580C',
        };
      default:
        return {
          bgColor: 'bg-white',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-300',
          icon: Truck,
          iconColor: '#6B7280',
        };
    }
  };

  const renderBottomButton = () => {
    switch (order.status.toLowerCase()) {
      case 'out for delivery':
      case 'em rota':
        return (
          <TouchableOpacity
            style={tw`mt-4 bg-gray-100 py-4 px-5 rounded-xl flex-row items-center justify-between`}
            onPress={onPress}
            activeOpacity={0.7}>
            <Text style={tw`text-gray-700 text-base font-medium`}>
              {order.estimatedDelivery
                ? `Previsto: ${formatDate(order.estimatedDelivery)}`
                : 'Em rota para entrega'}
            </Text>
            <CaretRight
              size={20}
              color={tw.color('gray-700')}
              weight="regular"
            />
          </TouchableOpacity>
        );
      case 'delivered':
      case 'entregue':
        return (
          <TouchableOpacity
            style={tw`mt-4 bg-gray-100 py-4 px-5 rounded-xl flex-row items-center justify-between`}
            onPress={onPress}
            activeOpacity={0.7}>
            <Text style={tw`text-gray-700 text-base font-medium`}>
              {order.deliveryDate
                ? `Chegou dia ${formatDate(order.deliveryDate)}`
                : 'Pedido entregue'}
            </Text>
            <CaretRight
              size={20}
              color={tw.color('gray-700')}
              weight="regular"
            />
          </TouchableOpacity>
        );
      case 'shipped':
      case 'enviado':
        return (
          <TouchableOpacity
            style={tw`mt-4 bg-gray-100 py-4 px-5 rounded-xl flex-row items-center justify-between`}
            onPress={onPress}
            activeOpacity={0.7}>
            <Text style={tw`text-gray-700 text-base font-medium`}>
              Toque para retirar o pedido
            </Text>
            <CaretRight
              size={20}
              color={tw.color('gray-700')}
              weight="regular"
            />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const statusStyle = getStatusStyle(order.status);

  return (
    <View style={tw`bg-gray-50 rounded-2xl p-5 mb-4 shadow-sm`}>
      <View style={tw`flex-row items-start`}>
        <View
          style={tw`bg-gray-200 rounded-2xl w-20 h-20 items-center justify-center mr-4`}>
          <IconComponent weight="fill" size={48} color="#000000" />
        </View>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-medium text-gray-900 mb-1`}>Pedido</Text>
          <Text style={tw`text-lg font-medium text-gray-900 mb-3`}>
            {formattedOrderId}
          </Text>

          <View style={tw`flex-row items-center`}>
            <View
              style={tw`${statusStyle.bgColor} ${statusStyle.borderColor} border px-4 py-2 rounded-full flex-row items-center`}>
              <statusStyle.icon
                size={16}
                color={statusStyle.iconColor}
                weight="fill"
                style={tw`mr-2`}
              />
              <Text style={tw`${statusStyle.textColor} text-sm font-medium`}>
                {translatedStatus}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {renderBottomButton()}
    </View>
  );
}

export default ProductForecast;
