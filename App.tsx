import Routes from "./routes"
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/auth_provider";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./src/services/query-client";
import RemoveOrder from "./src/screens/remove_order";
import MyOrder from "./src/screens/my_order";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <MyOrder />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;