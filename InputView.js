import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { getDatabase, ref, push, update, child } from "firebase/database"; //Ekskluderet child

function InputView({ navigation, route }) {
  const db = getDatabase();

  // Her bestemmer jeg hvilke oplysninger en vare skal indeholde
  const initialState = {
    firstName: "",
    vare: "",
    pictureURL: "",
  };

  const [userData, setUserData] = useState(initialState);

  // Checker om vi bruger route til at tilføje nye varer, eller om det er for edit
  const isEditUser = route.name === "EditUser";

  // Sætter userdata'en fra params hvis vi bliver redirected fra en anden route
  useEffect(() => {
    if (isEditUser) {
      const user = route.params.user[1];
      setUserData(user);
    }
    return () => {
      setUserData(initialState);
    };
  }, []);

  // Changes the input of the text
  const changeTextInput = (name, event) => {
    setUserData({ ...userData, [name]: event });
  };

  // Gemmer oplysninger i database
  const handleSave = async () => {
    const { firstName, vare, pictureURL } = userData;

    // Chekker om felterne er udfyldt
    if (!firstName || !vare || !pictureURL) {
      return Alert.alert("One or more fields are empty!");
    }

    // Route til hvis vi er i edit mode
    if (isEditUser) {
      const id = route.params.user[0];
      const userRef = ref(db, `UserData/${id}`);
      const updatedFields = {
        firstName,
        vare,
        pictureURL,
      };

      await update(userRef, updatedFields)
        .then(() => {
          Alert.alert("Information updated!");
          navigation.goBack();
        })
        .catch((error) => {
          console.error(`Error: ${error.message}`);
        });
    } else {
      // Her er route'en til når vi tilføjer nye varer
      const usersRef = ref(db, "UserData");
      const newUserData = {
        firstName,
        vare,
        pictureURL,
      };

      try {
        await push(usersRef, newUserData);
        Alert.alert("Saved");
        setUserData(initialState);
      } catch (error) {
        console.error(`Error: ${error.message}`);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {Object.keys(initialState).map((key, index) => {
          return (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>{key}</Text>
              <TextInput
                value={userData[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={styles.input}
              />
            </View>
          );
        })}
        <Button
          title={isEditUser ? "Save changes" : "Add data"}
          onPress={() => handleSave()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    height: 40,
    margin: 10,
  },
  label: {
    fontWeight: "bold",
    width: 120,
    textAlign: "right",
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    flex: 1,
  },
});

export default InputView;
