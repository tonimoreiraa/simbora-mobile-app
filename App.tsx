import { Text, View } from "react-native";
import SignUp from "./src/screens/signUp";
import Login from "./src/screens/login";
import Home from "./src/screens/home";
import Checkout from "./src/screens/checkout";
import Order from "./src/screens/order";
import Account from "./src/screens/my_account";
import MyOrder from "./src/screens/my_order";
import ViewProduct from "./src/screens/view_product";

function app() {
  return (
    <View>
      <ViewProduct />
    </View>
  )
}

export default app;