firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#content').css('display','block');
        $('#user_display_name').html(user.displayName)     
    } else {
        if (location.pathname.substring(1) == 'dashboard/') {
            Cookies.remove('role') 
            Cookies.remove('manage_incidents')                
            Cookies.remove('manage_components')                
            Cookies.remove('manage_users')                
            Cookies.remove('manage_roles')                
            Cookies.remove('manage_settings')  
            window.location = '../auth/login/';
        } else {
            Cookies.remove('role') 
            Cookies.remove('manage_incidents')                
            Cookies.remove('manage_components')                
            Cookies.remove('manage_users')                
            Cookies.remove('manage_roles')                
            Cookies.remove('manage_settings')  
            window.location = '../../auth/login/';
        }
    }
});

$("#logout").on("click", function (event) {
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        location.reload();
      }, function(error) {
          setTimeout(() => {
              location.reload()
          }, 2000);
      });
});