import { StatusBar } from "expo-status-bar";
import { StyleSheet, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import FarmsListScreen from "./screens/FarmsListScreen";
import AddFarmsScreen from "./screens/AddFarmScreen";
import SignUpScreen from "./screens/SignUpScreen";

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([
  "Warning: Async Storage has been extracted from react-native core",
]);

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SignUp"
          component={SignUpScreen}
        />
        <Stack.Screen
          options={{
            headerTitle: "Farms List",
            headerRight: () => null,
            headerLeft: () => null,
            headerStyle: {
              backgroundColor: "#0782F9",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
            headerTitleAlign: "center",
          }}
          name="FarmsList"
          component={FarmsListScreen}
        />
        <Stack.Screen
          options={{
            headerTitle: "Add Farm",
            headerStyle: {
              backgroundColor: "#0782F9",
            },
            headerTitleStyle: {
              fontWeight: "bold",
              color: "white",
            },
            headerTitleAlign: "center",
          }}
          name="AddFarm"
          component={AddFarmsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
