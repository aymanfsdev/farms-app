import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { firebaseApp } from "../firebase";
import {
  getFirestore,
  query,
  collection,
  onSnapshot,
  where,
} from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";
import FarmItem from "../components/FarmItem";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const FarmsListScreen = () => {
  const navigation = useNavigation();
  const [farmsList, setFarmsList] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "farms"),
      where("uid", "==", auth.currentUser?.uid ? auth.currentUser.uid : 0)
    );
    const unsubscribe = onSnapshot(q, querySnapshot => {
      const farms: any[] = [];
      querySnapshot.forEach(doc => {
        farms.push({
          _id: doc.id,
          ...doc.data(),
        });
        console.log(doc.id);
      });
      console.log("farmsList: ", farms);
      setFarmsList(farms ? farms : []);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace("Login");
      })
      .catch(error => alert(error.message));
  };

  const handleAddFarms = () => {
    navigation.navigate("AddFarm");
  };

  return (
    <View style={styles.container}>
      <View style={styles.userWrapper}>
        <View style={styles.userContainer}>
          <Text style={styles.emailText}>Email: {auth.currentUser?.email}</Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Text style={styles.signoutText}>Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.FarmsHeaderWrapper}>
        <View style={styles.FarmsHeaderContainer}>
          <Text style={styles.emailText}>Farms list</Text>
          <TouchableOpacity onPress={handleAddFarms}>
            <Text style={styles.signoutText}>Add farms</Text>
          </TouchableOpacity>
        </View>
      </View>

      {farmsList?.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {farmsList.map(c => {
            return (
              <View key={c._id}>
                <FarmItem item={c} />
              </View>
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No found data</Text>
        </View>
      )}
    </View>
  );
};

export default FarmsListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  userWrapper: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    paddingVertical: 20,
    backgroundColor: "pink",
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  FarmsHeaderWrapper: {
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    paddingVertical: 20,
    backgroundColor: "#FEFEFE",
  },
  FarmsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
  },
  emailText: {
    color: "black",
    fontWeight: "400",
    fontSize: 16,
  },
  signoutText: {
    color: "#0782F9",
    fontWeight: "400",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -100,
  },
  empty: {
    color: "#888",
    fontWeight: "400",
    fontSize: 18,
  },
});
