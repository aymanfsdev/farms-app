Create a new project using expo for ios, android and web (use react-native-web) and typescript
For Navigation use react-navigation-v6.
Set up a Firebase project to use in the app with Firestore
Add Formik and Yup to project

Setup firebase authentication (just email is good enough) with a login / register screen (also uses Formik/Yup)

On user login, the screen shows a list of Farms (initially empty of course)
The Screen has an add button to add new Farms.

The AddFarm function is a form built using Formik / Yup and firestore.
Farm displayname (required)
Farm name (required and unique, using Yup for validation)
Farm phone (optional, use Yup for phone number validation) 
Farm open hours (optional)
Farm image (A button to prompt and upload image to Firebase storage, and add url to Farm collection. The url is not directly editable)

On Submit, 
Add data to Farm collection in firestore
Return to List screen

Optional:
Cypress test for the app (both login screen and Add Farm screen in particular). Here is a good tutorial:  (https://glebbahmutov.com/blog/testing-react-native-app-using-cypress/
Live update data on list screen (you will use a firestore snapshot listener for this) - So, if you android and web version of app opened simultaneously, aGet realtime updates with Cloud Firestore | Firebase Documentationdd a farm using one and the other list screen will auto update

Stretch goal (not expected):
Use Firebase functions and define onCreate and OnUpdate trigger for Farm collection. Then add createdDate in the firestore collection for the Farm. So in firestore database, the Farm collection  will contain displayname, name, phone, hours, image url, createdDate. Then add this also to the List view of the Farm

