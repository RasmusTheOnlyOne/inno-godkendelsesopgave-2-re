import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { getDatabase, ref, onValue, off } from "firebase/database";

function DisplayView({ navigation }) {
  const [users, setUsers] = useState();
  const [searchText, setSearchText] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Denne useEffect sørger for, at enten vise hele listen af ting til salg,
  // eller kun vise de ting som matcher med søge ordet fra searchText
  useEffect(() => {
    if (!searchText) {
      setFilteredUsers(userArray); // Viser hele listen hvis der ikke er nogen searchtext
    } else {
      // Her filtreres varerne ud fra den indtastede searchtext
      setFilteredUsers(
        userArray.filter(
          (user) =>
            user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
            user.vare.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
  }, [users, searchText]);

  // laver en ref og beholder et snapshot af UserData
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "UserData");

    // Lytter efter ændringer i 'UserData' node
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setUsers(data);
      }
    });

    // Rydder op i listener når mit komponent "unmounts"
    return () => {
      off(usersRef);
    };
  }, []); // Effect kører kun 1 gang

  // Viser "loading..." hvis ikke "users" er hentet endnu
  if (!users) {
    return <Text>Loading...</Text>;
  }

  // The eventHandler til når en user (vare) bliver klikket på
  const handleSelectUser = (id) => {
    const user = Object.entries(users).find((user) => user[0] === id);
    navigation.navigate("UserEditView", { user }); // Navigate to details of the selected user
  };

  // Oversætter users object ind i et array til FlatList
  const userArray = Object.values(users);
  const userKeys = Object.keys(users);

  // Textinput her er min searchbar, som er den der bestemmer hvilke varer der skal vises
  return (
    <>
      <TextInput
        style={styles.searchBar}
        onChangeText={setSearchText}
        value={searchText}
        placeholder="Search"
      />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item, index) => userKeys[index]}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={() => handleSelectUser(userKeys[index])}
            >
              <Image style={styles.image} source={{ uri: item.pictureURL }} />
              <Text>
                {item.firstName} - {item.vare}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    margin: 5,
    padding: 5,
    height: 50,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start"

  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 15,
    paddingLeft: 10,
    margin: 10,
    fontSize: 18,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
  },
  image: {
    width: 45,
    height: 45,
    margin: 10,
  },
});

export default DisplayView;
