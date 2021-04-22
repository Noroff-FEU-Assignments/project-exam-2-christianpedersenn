// get URL query string
function getQueryStringValue (key) {
  return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}
var queryStringEmail = getQueryStringValue('email');
if (queryStringEmail == '') {
  //
} else {
  document.getElementById('email').value = queryStringEmail;
}
let toast_class = 'toast toast--red';
let toast_header = 'Error';
let toast_message = '';


function toast(toast_message) {
  $("#toast_header").text(toast_header);
  $("#toast_message").text(toast_message);
  $("#toast_class").removeClass('toast toast--green').addClass(toast_class);
  $('#toast').css('display','block');
  setTimeout(() => {
    $('#toast').css('display','none');
  }, 5000);
}

function login() {
    $('#login').prop("disabled", true);
    $('#login_spinner').show();
    var email = $("#email").val();
    var password = $("#password").val();
    if (email == '' || password == '') {
      $('#login').removeAttr("disabled");
      $('#login_spinner').hide();
      toast_message = 'Please enter both your email and password.';
      toast(toast_message);
    } else {
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        var errorCode = error.code;
        if (errorCode == 'auth/user-not-found' || errorCode == 'auth/wrong-password') {
          $('#login').removeAttr("disabled");
          $('#login_spinner').hide();
          toast_message = "We can't find any user with the information you typed in. Please try again.";       
          toast(toast_message);
      }
      if (errorCode == 'auth/too-many-requests') {
        $('#login_spinner').hide();
        toast_message = "You've been locked out due too many tries, please try again later.";
        toast(toast_message);
      }
        console.log(error.code);
        console.log(error.message); 
      });
    }
  }

$("#login").on("click", function (event) {
  login();
});

document.getElementById('password').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      login();
    }
  });
  document.getElementById('email').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      login();
    }
  });

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is logged in');
      let userID = user.uid; 
      db.collection("users").doc(userID).get().then(function(doc) {   
      if (doc.exists) {
          var data = doc.data(); 
          if (user.uid == doc.id) {

            try {
              let role = data.role;
              let current_user = data.name;
              var manage_incidents = data.role_permissions.manage_incidents
              var manage_components = data.role_permissions.manage_components
              var manage_users = data.role_permissions.manage_users
              var manage_roles = data.role_permissions.manage_roles
              var manage_settings = data.role_permissions.manage_settings
              Cookies.set('role', role) 
              Cookies.set('current_user', current_user) 
              Cookies.set('manage_incidents', manage_incidents)                
              Cookies.set('manage_components', manage_components)                
              Cookies.set('manage_users', manage_users)                
              Cookies.set('manage_roles', manage_roles)                
              Cookies.set('manage_settings', manage_settings)   
            } 
            catch {
              console.log("Error ..");
            }

            finally {
              setTimeout(() => {
                window.location.href = '../../dashboard/'
              }, 200);  
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