import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import SignUp from './src/screens/sign_up';
import Home from './src/screens/home';
import { useAuth } from './src/contexts/auth_provider';
import SignIn from './src/screens/sign_in';
import MyAccount from './src/screens/my_account';
import Order from './src/screens/order';
import Checkout from './src/screens/checkout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopWidth: 0,
          borderRadius: 32,
          height: 64,
          position: 'absolute',
          bottom: 10,
          margin: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          paddingHorizontal: 20,
          elevation: 10,
          zIndex: 1000,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
        tabBarItemStyle: {
          height: 64,
          paddingBottom: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: 26,
              height: '100%',
            }}>
              <Icon name="home-outline" color={focused ? "white" : "gray"} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Checkout"
        component={Checkout}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: 26,
              height: '100%',
            }}>
              <Icon name="bag-outline" color={focused ? "white" : "gray"} size={24} />
            </View>
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="order"
        component={Order}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: 26,
              height: '100%',
            }}>
              <Icon name="download-outline" color={focused ? "white" : "gray"} size={24} />
            </View>
          ),
          tabBarStyle: { display: 'none' },
        }}
      />
      <Tab.Screen
        name="MyAccount"
        component={MyAccount}
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={{ 
              alignItems: 'center', 
              justifyContent: 'center',
              marginTop: 26,
              height: '100%',
            }}>
              <Icon name="person-outline" color={focused ? "white" : "gray"} size={24} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function Routes() {
  const { signed } = useAuth();

  return <SignIn />
  console.log(signed);

  return (
    <Stack.Navigator
      initialRouteName={'BottomTab'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="BottomTab" component={BottomTab} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}