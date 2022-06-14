import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "../firebase";
import { useNavigation } from "@react-navigation/native";
import { Formik, Form, FormikProps, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Values {
  email: string;
  password: string;
}

const auth = getAuth(firebaseApp);

const LoginScreen = () => {

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        navigation.replace("FarmsList");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    navigation.replace('SignUp');
  };

  const handleLogin = (data: Values) => {
    const {email, password} = data;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials: { user: any }) => {
        const user = userCredentials.user;
        console.log("Logged in with: ", user.email);
      })
      .catch((error: { message: string }) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={Yup.object({
          email: Yup.string().email("Invalid Email").required("Required"),
          password: Yup.string().required("Required"),
        })}
        onSubmit={(values, formikActions) => {
          setTimeout(() => {
            handleLogin(values);
            formikActions.setSubmitting(false);
          }, 500);
        }}
      >
        {(props: FormikProps<Values>) =>
          (
            <View style={styles.body}>
              <View style={styles.logoContainer}>
                <Text style={styles.logoText}>Welcome to Farms</Text>
                <Text style={styles.loginText}>Sign In</Text>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Email"
                  onChangeText={props.handleChange('email')}
                  onBlur={props.handleBlur('email')}
                  value={props.values.email}
                  style={styles.input}
                ></TextInput>
                {props.touched.email && props.errors.email ? (
                  <Text style={styles.error}>{props.errors.email}</Text>
                ) : null}

                <TextInput
                  placeholder="Password"
                  onChangeText={props.handleChange('password')}
                  onBlur={props.handleBlur('password')}
                  value={props.values.password}
                  style={styles.input}
                  secureTextEntry
                ></TextInput>

                {props.touched.password && props.errors.password ? (
                  <Text style={styles.error}>{props.errors.password}</Text>
                ) : null}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={props.handleSubmit}
                  style={[styles.button]}
                >
                  <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.question}>Don't you have account?</Text>
                  <TouchableOpacity onPress={handleSignUp}>
                    <Text style={styles.buttonOutlineText}> {' ' }Sign Up -></Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )
        }
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    width: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    paddingBottom: 50,
    alignItems: "center",
  },
  logoText: {
    color: "#0782F9",
    fontWeight: "900",
    fontSize: 22,
    paddingBottom: 10,
  },
  loginText: {
    color: "#0782F9",
    fontWeight: "500",
    fontSize: 18,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 90,
  },
  button: {
    backgroundColor: "#0782F9",
    width: " 100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#0782F9",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  question: {
    color: "#333",
    fontWeight: "400",
    fontSize: 13,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: 'red',
    fontWeight: '400',
  },
  signupContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
