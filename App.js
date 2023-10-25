import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Button, View } from "react-native";
import InputView from "./InputView";
import DisplayView from "./DisplayView";

// Her henter jeg to Firebase funktioner
import { initializeApp, getApps } from "firebase/app";
import MyMapView from "./MyMapView";
import UserEditView from "./EditView";

// Firebase konfiguration!
const firebaseConfig = {
  apiKey: "AIzaSyC2eMMfToONxQWICk99vGdGAw2zrJUFTWo",
  authDomain: "inno2-7e420.firebaseapp.com",
  databaseURL:
    "https://inno2-7e420-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "inno2-7e420",
  storageBucket: "inno2-7e420.appspot.com",
  messagingSenderId: "34529192707",
  appId: "1:34529192707:web:a3ceae51882021affb5736",
  measurementId: "G-QX682WX4SK",
};

// Her kigger jeg efter om Firebase allerede kører, og hvis den ikke gør, så starter den
if (getApps().length === 0) {
  initializeApp(firebaseConfig);
  console.log("Firebase On!");
}

const Stack = createStackNavigator();

// Her er startsidens view, som indeholder tre knapper, som tager brugeren videre til enten, køb (input),
// salg (display), eller min maps funktion
function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button
        title="Go to Input View"
        onPress={() => navigation.navigate("Inputview")}
      />
      <Button
        title="Go to Display View"
        onPress={() => navigation.navigate("Displayview")}
      />
      <Button
        title="MapView"
        onPress={() => navigation.navigate("MyMapView")}
      />
    </View>
  );
}

// Dette gør at min app ved hvilke views der er tilgenlige
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EditUser" component={InputView} />
        <Stack.Screen name="Inputview" component={InputView} />
        <Stack.Screen name="UserEditView" component={UserEditView} />
        <Stack.Screen name="Displayview" component={DisplayView} />
        <Stack.Screen name="MyMapView" component={MyMapView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
