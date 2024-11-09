import Routes from "./routes"
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./src/contexts/auth_provider";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./src/services/query-client";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App;