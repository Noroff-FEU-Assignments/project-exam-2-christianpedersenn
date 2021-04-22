const firebaseConfig = {
    apiKey: "AIzaSyDJ1pmTGM6d8QwVK3Y8FjnRlJ1i_2auIjU",
    authDomain: "firestatusdemo.firebaseapp.com",
    databaseURL: "https://firestatusdemo.firebaseio.com",
    projectId: "firestatusdemo",
    storageBucket: "firestatusdemo.appspot.com",
    messagingSenderId: "1082123652874",
    appId: "1:1082123652874:web:b4ef235f54e76ba921f4f3"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

setTimeout(() => {
    const current_user = Cookies.get('current_user')
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          console.log('User is logged in');
          let userID = user.uid; 
          db.collection("users").doc(userID).get().then(function(doc) {   
          if (doc.exists) {
              var data = doc.data(); 
              if (user.uid == doc.id) {
                document.getElementById('userDropdown').innerHTML ='<i class="fas fa-user mr-2"></i>' + data.name
                if (data.name != Cookies.get('userDropdown')) {
                    Cookies.set('current_user', data.name)
                }
              } else {
                  // In this case something is very wrong
              }   
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
          }).catch(function(error) {
              console.log("Error getting document:", error);
          });      
          
        }
    })

}, 200);
const app_url = 'http://localhost:3000/auth/login/';
const app_name = 'My amazing status dashboard';
$('#firebase_console_link').attr('href', `https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/users`);

