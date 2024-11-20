import Routes from "./routes"
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/auth_provider";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./src/services/query-client";
import CartProvider from "./src/contexts/cart_provider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer>
            <Routes />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;