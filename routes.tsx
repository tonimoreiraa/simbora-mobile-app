import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignUp from './src/screens/sign_in';
import Home from './src/screens/home';
import { useAuth } from './src/contexts/auth_provider';
import SignIn from './src/screens/sign_in';

const Stack = createNativeStackNavigator();

export default function Routes() {

  const { signed } = useAuth()

  console.log(signed)

  return (
    <Stack.Navigator
      initialRouteName={'Home'}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}