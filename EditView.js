import React, { useState, useEffect } from "react";
import { View, Text, Platform, StyleSheet, Button, Alert } from "react-native";
import { getDatabase, ref, remove } from "firebase/database";

function UserEditView({ route, navigation }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    setUser(route.params.user[1]);

    // Her startes der med at ryddes op
    return () => {
      setUser({});
    };
  }, [route.params.user]);

  // Handler der rerouter til InputView men med en anden route end EditUser
  const handleEdit = () => {
    const user = route.params.user;
    navigation.navigate("EditUser", { user });
  };

  // Spørger brugeren om de er sikre på de gerne vil slette varen
  const confirmDelete = () => {
    if (Platform.OS === "ios" || Platform.OS === "android") {
      Alert.alert("Are you sure?", "Do you want to delete this user?", [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => handleDelete() },
      ]);
    }
  };

  // Sletter varen
  const handleDelete = async () => {
    const id = route.params.user[0];
    const db = getDatabase();
    const userRef = ref(db, `UserData/${id}`);

    await remove(userRef)
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(error.message);
      });
  };

  if (!user) {
    return <Text>No data</Text>;
  }

  return (
    <View style={styles.container}>
      <Button title="Edit" onPress={handleEdit} />
      <Button title="Delete" onPress={confirmDelete} />

      {Object.entries(user).map((item, index) => {
        return (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>{item[0]}</Text>
            <Text style={styles.value}>{item[1]}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  row: {
    margin: 5,
    padding: 5,
    flexDirection: "row",
  },
  label: {
    width: 150, 
    fontWeight: "bold",
  },
  value: {
    flex: 1,
  },
});

export default UserEditView;
