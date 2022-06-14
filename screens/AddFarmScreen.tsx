import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  ActivityIndicator,
} from "react-native";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";
import "yup-phone";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage();

interface Values {
  display_name: string;
  name: string;
  phone?: string;
  open_hours?: string;
}

const AddFarmsScreen = () => {
  const navigation = useNavigation();
  const [uploading, setUploading] = useState<boolean>(false);
  const [image, setImage] = useState("");

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      console.log(result.uri);
      setImage(result.uri);
    }
  };

  const uploadImageAsync = async (uri: string, bucket: string) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, bucket + Date.now().toString());
    const result = await uploadBytes(fileRef, blob);

    if (Platform.OS !== "web") {
      // We're done with the blob, close and release it
      blob.close();
    }

    console.log("uploaded successfully: ", result);

    return await getDownloadURL(fileRef);
  };

  const handleAddImage = async () => {
    try {
      await pickImage();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (data: Values) => {
    const { display_name, name, phone, open_hours } = data;

    if (!auth.currentUser?.uid) {
      alert("No credentials! Try again sign in");
      return;
    }

    if (!display_name) {
      alert("Input the display name");
      return;
    }

    if (!name) {
      alert("Input the name");
      return;
    }

    let imageUrl = image;

    if (image && !image.startsWith("https")) {
      try {
        setUploading(true);
        imageUrl = await uploadImageAsync(image, "farms/");
        setImage(imageUrl);
        setUploading(false);
      } catch (error) {
        imageUrl = "";
        console.log(error);
        setUploading(false);
      }
    }

    setDoc(doc(db, "farms", Date.now().toString()), {
      uid: auth.currentUser.uid,
      display_name,
      name,
      phone,
      open_hours,
      image: imageUrl,
    })
      .then(() => navigation.goBack())
      .catch(error => alert(error.message));
  };

  const maybeRenderUploadingOverlay = () => {
    if (uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          display_name: "",
          name: "",
          phone: "",
          open_hours: "",
        }}
        validationSchema={Yup.object().shape(
          {
            display_name: Yup.string().required("Required"),
            name: Yup.string().required("Required"),
            phone: Yup.string()
              .nullable()
              .notRequired()
              .when("phone", {
                is: value => value?.length > 0,
                then: Yup.string().phone("US", true),
              }),
          },
          [["phone", "phone"]]
        )}
        onSubmit={(values, formikActions) => {
          setTimeout(() => {
            handleSubmit(values);
            formikActions.setSubmitting(false);
          }, 500);
        }}
      >
        {(props: FormikProps<Values>) => (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.body}>
              <TextInput
                placeholder="Display name"
                onChangeText={props.handleChange("display_name")}
                onBlur={props.handleBlur("display_name")}
                value={props.values.display_name}
                style={styles.input}
              ></TextInput>
              {props.touched.display_name && props.errors.display_name ? (
                <Text style={styles.error}>{props.errors.display_name}</Text>
              ) : null}

              <TextInput
                placeholder="Name"
                onChangeText={props.handleChange("name")}
                onBlur={props.handleBlur("name")}
                value={props.values.name}
                style={styles.input}
              ></TextInput>
              {props.touched.name && props.errors.name ? (
                <Text style={styles.error}>{props.errors.name}</Text>
              ) : null}

              <TextInput
                placeholder="Phone number (optional)"
                onChangeText={props.handleChange("phone")}
                onBlur={props.handleBlur("phone")}
                value={props.values.phone}
                style={styles.input}
              ></TextInput>
              {props.touched.phone && props.errors.phone ? (
                <Text style={styles.error}>{props.errors.phone}</Text>
              ) : null}

              <TextInput
                placeholder="Open hours (optional)"
                onChangeText={props.handleChange("open_hours")}
                onBlur={props.handleBlur("open_hours")}
                value={props.values.open_hours}
                style={styles.input}
              ></TextInput>

              <TouchableOpacity
                style={styles.btnAddImage}
                onPress={handleAddImage}
              >
                <Text style={styles.addImage}>
                  Add image
                  <Text style={styles.optional}> (optional)</Text>
                </Text>
              </TouchableOpacity>

              <View style={styles.imageContainer}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image}></Image>
                ) : null}
              </View>
            </View>

            <TouchableOpacity
              style={styles.btnContainer}
              onPress={props.handleSubmit}
            >
              <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Formik>

      {maybeRenderUploadingOverlay()}
    </View>
  );
};

export default AddFarmsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  btnContainer: {
    marginTop: 30,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    paddingVertical: 20,
    backgroundColor: "#0782F9",
    marginHorizontal: 20,
    alignItems: "center",
  },
  emailText: {
    color: "black",
    fontWeight: "400",
    fontSize: 16,
  },
  submit: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  itemContainer: {
    marginHorizontal: 20,
    paddingTop: 20,
    borderBottomColor: "#DDD",
    borderBottomWidth: 1,
    paddingVertical: 20,
  },
  name: {
    color: "#4914b3",
    fontWeight: "400",
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  btnAddImage: {
    paddingTop: 20,
  },
  addImage: {
    color: "#4914b3",
    fontWeight: "400",
    fontSize: 14,
  },
  optional: {
    color: "#888",
    fontWeight: "400",
    fontSize: 14,
  },
  imageContainer: {
    marginTop: 10,
    width: "100%",
    height: 280,
    backgroundColor: "#FEFEFE",
  },
  image: {
    width: "100%",
    height: 280,
    resizeMode: "cover",
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: "red",
    fontWeight: "400",
  },
});
