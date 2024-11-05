import { Text, View } from "react-native";
import SignUp from "./src/screens/signUp";
import Login from "./src/screens/login";
import Home from "./src/screens/home";
import ViewProduct from "./src/components/view_product";

function app() {
  return (
    <View>
      <ViewProduct />
    </View>
  )
}

export default app;