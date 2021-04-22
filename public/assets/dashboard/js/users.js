$('#header-buttons').hide()
const manage_incidents = Cookies.get('manage_incidents')
const manage_components = Cookies.get('manage_components')
const manage_users = Cookies.get('manage_users')
const manage_roles = Cookies.get('manage_roles')
const manage_settings = Cookies.get('manage_settings')
const current_user = Cookies.get('current_user')
const role = Cookies.get('role')
var auth = firebase.auth();
let currentDay = moment().format("DD")
let currentMonth = moment().format("MMM")
let currentYear = moment().format("YYYY")
let table_row_data;

$(document).ready(function () {
  // if (manage_users == null) {
    
  // }
if (manage_users == 'true') {
  $('#table').show();
  var table = $('#table_id').DataTable({ 
    columns: [
      { data: "userID" },
      { data: "role" },
      { data: "email" },
      { data: "name" },
      { data: "created_by" },
      { data: "actions" }
    ],  
    "language": {
      zeroRecords: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green animate__animated animate__tada'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
      emptyTable: '<div class="text-center" style="width: 100%; padding: 40px;"><i class="fas fa-align-center fa-4x status-green"></i><br><br><p style="font-size: 20px;">No records found</p></div>',
      processing: '<div class="text-center" style="width: 100%; padding: 40px;"><span class="dashboard-spinner spinner-blue spinner-sm"></span><span class="sr-only">Loading...</span></div>',
    },    
  });

  db.collection('roles').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var update_role_list = document.getElementById('user_role_update')
        var update_role_listNode = document.createElement('option')
        update_role_list.appendChild(update_role_listNode);
        update_role_listNode.innerHTML = doc.id;
        $('#user_role_update').selectpicker('refresh');       
        
        var roles_list = document.getElementById('user_role_select')
        var roles_listNode = document.createElement('option')
        roles_list.appendChild(roles_listNode);
        roles_listNode.innerHTML = doc.id;
        $('#user_role_select').selectpicker('refresh');    
    });
  });  

  $('#table_id tbody').on('click', 'tr', function () {
    table_row_data = table.row( this ).data();
    if (table_row_data == undefined) {
    } else {
      console.log(table_row_data);
      $('#manage_modal').modal('show'); 
      $('#modalTitle').html('Manage user: ' + table_row_data.userID)

      $('#user_name_update').val(table_row_data.name);
      $('#user_email_update').val(table_row_data.email);
      $('#user_reset_password_email').val(table_row_data.email);

      $('#user_role_update').selectpicker('val', table_row_data.role); 
      $('#user_role_update').selectpicker('refresh');   
    }
  });

  $('div.dataTables_length select').addClass('selectpicker');
  $('div.dataTables_length select').attr('data-width', '75px');
  $('div.dataTables_length select').selectpicker('refresh'); 

  let dataREF = db.collection('users');
  let observer = dataREF.onSnapshot(querySnapshot => {
      table.clear()
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        let email = data.email;
        let role = data.role;
        let name = data.name;
        var created_by = data.created_by;
        
        
        table.row.add({
          "userID": doc.id,
          "role": role,
          "email": email,
          "name": name,
          "created_by": created_by,
          // "actions": '<a class="btn green-button btn-xs" title="Manage incident" target="_self" data-toggle="modal" data-target="#manage_modal" data-backdrop="static" data-keyboard="false"><i class="fas fa-fw fa-edit"></i></a><a href="#delete?id=' + doc.id + '"class="btn btn-danger btn-xs white-text" title="Delete incident" target="_self"><i class="fas fa-fw fa-trash"></i></a>'
          "actions": '<a class="btn green-button btn-xs" title="Manage user" data-toggle="modal" data-target="#manage_modal" data-backdrop="static" data-keyboard="false">Edit <i class="fas fa-fw fa-edit"></i></a>'
         
        }).node().id = doc.id;
        table.draw();
      });  
  }, err => {
    console.log(`Encountered error: ${err}`);
  });  

$('#user_delete').click(function () { 
  $('#delete_user_tab-tab').tab('show');
})

$('#user_delete_user_details').click(function () { 
  $("#delete_user_spinner").show()
  db.collection('users').doc(table_row_data.userID).delete().then(function() {
    console.log("User details successfully deleted!");
    $('#user_delete_user_details').html('User details deleted!')
    $('#user_delete_user_details').attr("disabled", false);
    $("#delete_user_spinner").hide()
    // $('#manage_modal').modal('hide');
  }).catch(function(error) {
      console.error("Error removing document: ", error);
      $('#user_delete_user_details').attr("disabled", false);
      $("#delete_user_spinner").hide()
  })
})


$('#user_create').click(function () { 
  $("#user_create_spinner").show()
  $("#user_create").attr("disabled", true);
  let email = $('#user_email').val();
  let name = $('#user_name').val();
  let password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)  
  let role = $('#user_role_update').val();
  let manage_incidents;
  let manage_components;
  let manage_users;
  let manage_roles;
  let manage_settings; 

  db.collection('roles').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
      var data = doc.data()
      manage_incidents = data.manage_incidents;
      manage_components = data.manage_components;
      manage_users = data.manage_users;
      manage_roles = data.manage_roles;
      manage_settings = data.manage_settings;
    });
  }); 

  var secondFB = firebase.initializeApp(firebaseConfig, "Secondary");
    secondFB.auth().createUserWithEmailAndPassword(email, password).then(function(newUser) {
      db.collection("users").doc(newUser.user.uid).set({
          created_by: current_user,
          email: email, 
          name: name,
          role: role,
          role_permissions: {
            manage_incidents: manage_incidents,
            manage_components: manage_components, 
            manage_users: manage_users, 
            manage_roles: manage_roles, 
            manage_settings: manage_settings,               
          }                   
      })
      .then(function(docRef) {
          setTimeout(() => {
              $("#user_create_spinner").hide()
              $('#user_create_form').hide();
              $('#user_create_info').show();
              $("#user_create").attr("disabled", false);
              let emailSubject = 'Welcome to ' + app_name;
              let emailBody = 'Hello ' + name + ', \n' + '\nAn account has been created for you to use with our status dashboard. \n\n You can log in by clicking this link: ' + app_url + '?email=' + email + '\n\nEmail: ' + email + '\nPassword: ' + password + '\n\nPlease consider changing your password after login.\n\n' + 'Best regards,\n' + app_name;
              let encodedEmailBody = encodeURIComponent(emailBody)
              let emailTemplate = "mailto:" + email + "?subject=" + emailSubject + "&body=" + encodedEmailBody;
            
              $('#user_create_send_email').attr('href', emailTemplate);
            
              $('#user_create_send_email').click(function () { 
                window.location.href = emailTemplate;
              }) 
          }, 1000);                
          secondFB.auth().signOut()
          .then(function () {
          // Sign-out successful.
          // console.log('Second FireBase user signed out.');
          }, function (error) {
          // An error happened.
          $("#user_create_spinner").hide()
          $('#user_create').attr("disabled", false);
          console.log('Error siging out of second FireBase instance.');
          console.log(error);
          });                
      })
      .catch(function(error) {
          $("#user_create_spinner").hide()
          $('#user_create').attr("disabled", false);
          console.error("Error adding document: ", error);
      });            
  }, function (error) {
      $("#user_create_spinner").hide()
      $('#user_create').attr("disabled", false);
      console.log(error.code);
      console.log(error.message);
  })  
})

$('#user_update').click(function () { 
  const role = $('#user_role_update').val();
  console.log(role);
  console.log(table_row_data.userID);

  var docRef = db.collection("roles").doc(role);
  docRef.get().then((doc) => {
      if (doc.exists) {
          console.log("Document data:", doc.data());
          let manage_incidents = doc.data().manage_incidents
          let manage_components = doc.data().manage_components 
          let manage_users = doc.data().manage_users 
          let manage_roles = doc.data().manage_roles 
          let manage_settings = doc.data().manage_settings  

          console.log(manage_incidents);
          console.log(manage_components);
          console.log(manage_users);
          console.log(manage_roles);
          console.log(manage_settings);
          db.collection("users").doc(table_row_data.userID).set({
            role: role,
            role_permissions: {
              manage_incidents: manage_incidents,
              manage_components: manage_components, 
              manage_users: manage_users, 
              manage_roles: manage_roles, 
              manage_settings: manage_settings,               
            } 
          },{ merge: true })     
          .then(function() {
            console.log("Document successfully deleted!");   
            Cookies.remove('role') 
            Cookies.remove('manage_incidents')                
            Cookies.remove('manage_components')                
            Cookies.remove('manage_users')                
            Cookies.remove('manage_roles')                
            Cookies.remove('manage_settings')   
            
            Cookies.set('role', role) 
            Cookies.set('manage_incidents', manage_incidents)                
            Cookies.set('manage_components', manage_components)                
            Cookies.set('manage_users', manage_users)                
            Cookies.set('manage_roles', manage_roles)                
            Cookies.set('manage_settings', manage_settings)             
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });

      } else {
          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
})

$('#user_reset_password').click(function () { 
  let email = table_row_data.email
  auth.sendPasswordResetEmail(email).then(function() {
    $('#user_reset_password').html('Email sent!')
    console.log('Email sent');
  }).catch(function(error) {
    // An error happened.
  });
})

$('#user_start_date_button').click(function () { 
  let timeNowString = currentMonth + ' ' + currentDay + ', ' + currentYear + ' ' + moment().format('hh:mm');
  $('#user_start_date').val(timeNowString);
})

$('#user_end_date_button').click(function () { 
  let timeNowString = currentMonth + ' ' + currentDay + ', ' + currentYear + ' ' + moment().format('hh:mm');
  $('#user_end_date').val(timeNowString);
})

} else {
  $('#no_privileges_card').show()
  $('#table_card').hide()
} 
});