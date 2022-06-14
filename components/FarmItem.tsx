import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";

interface Props {
  item: {
    display_name: string;
    name: string;
    phone: string;
    open_hours: number;
    image: string;
  };
}

const FarmItem = (props: Props) => {
  const { item } = props;
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemLeft}>
        <Text style={styles.nameTitle}>
          {`Display name: `}
          <Text style={styles.name}>{`${item.display_name}`}</Text>
        </Text>
        <Text style={styles.nameTitle}>
          {`Name: `}
          <Text style={styles.name}>{`${item.name}`}</Text>
        </Text>
        <Text style={styles.nameTitle}>
          {`Phone: `}
          <Text style={styles.name}>{`${item.phone}`}</Text>
        </Text>
        <Text style={styles.nameTitle}>
          {`Open hours: `}
          <Text style={styles.name}>{`${item.open_hours}`}</Text>
        </Text>
      </View>

      <View style={styles.itemRight}>
        <View style={styles.imageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.image}></Image>
          ) : null}
        </View>
      </View>
    </View>
  );
};

export default FarmItem;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    paddingTop: 20,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  itemLeft: {
    flex: 3,
  },
  itemRight: {
    flex: 1,
  },
  nameTitle: {
    color: "grey",
    fontWeight: "400",
    fontSize: 16,
  },
  name: {
    color: "#333",
    fontWeight: "500",
    fontSize: 16,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "#FEFEFE",
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1.2,
    resizeMode: "cover",
  },
});
