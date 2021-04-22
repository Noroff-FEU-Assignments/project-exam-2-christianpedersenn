$('#header-buttons').hide()
const manage_incidents = Cookies.get('manage_incidents')
const manage_components = Cookies.get('manage_components')
const manage_users = Cookies.get('manage_users')
const manage_roles = Cookies.get('manage_roles')
const manage_settings = Cookies.get('manage_settings')
const current_user = Cookies.get('current_user')
const role = Cookies.get('role')
var auth = firebase.auth();
let table_row_data;

$(document).ready(function () {
  if (manage_roles == null) {
    
  }
if (manage_roles == 'true') {
  $('#table').show();
    
  var table = $('#table_id').DataTable({ 
    "columnDefs": [
      { "visible": false, "targets": [2] }
    ],          
    columns: [
      { data: "name" },
      { data: "number_of_roles" },
      { data: "roles" },
      { data: "actions" },
    ],  
    "paging": false,
    "dom":' <"search"f><"top"l>rt<"bottom"ip><"clear">',
    "language": {
      zeroRecords: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green animate__animated animate__tada'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
      emptyTable: '<div class="text-center" style="width: 100%; padding: 40px;"><i class="fas fa-align-center fa-4x status-green"></i><br><br><p style="font-size: 20px;">No records found</p></div>',
      processing: '<div class="text-center" style="width: 100%; padding: 40px;"><span class="dashboard-spinner spinner-blue spinner-sm"></span><span class="sr-only">Loading...</span></div>',
    },    
  });

  $('#table_id tbody').on('click', 'tr', function () {
    console.clear();
    table_row_data = table.row( this ).data();
    if (table_row_data == undefined) {
      console.log('undefined');
    } else {
      $('#manage_modal').modal('show'); 
      $('#modalTitle').html('Manage role: ' + table_row_data.name)
      $('#role_name_update').val(table_row_data.name)

      let manage_incidents_REF = table_row_data.roles.manage_incidents
      let manage_components_REF = table_row_data.roles.manage_components
      let manage_users_REF = table_row_data.roles.manage_users
      let manage_roles_REF = table_row_data.roles.manage_roles
      let manage_settings_REF = table_row_data.roles.manage_settings

      setTimeout(() => {
        console.log(manage_incidents_REF);
        console.log(manage_components_REF);
        console.log(manage_users_REF);
        console.log(manage_roles_REF);
        console.log(manage_settings_REF);            
        if (manage_incidents_REF === true || manage_incidents_REF === 'true') {
          $('#manage_incidents_switch_update').attr('checked', true);
          $('#manage_incidents_switch_update').attr('data-val', true)
        } else if (manage_incidents_REF === false || manage_incidents_REF === 'false') {
          $('#manage_incidents_switch_update').removeAttr('checked');
          $('#manage_incidents_switch_update').attr('data-val', false)
        }
        if (manage_components_REF === true || manage_components_REF === 'true') {
          $('#manage_components_switch_update').attr('checked', true);
          $('#manage_components_switch_update').attr('data-val', true)
        } else if (manage_components_REF === false || manage_components_REF === 'false') {
          $('#manage_components_switch_update').removeAttr('checked');
          $('#manage_components_switch_update').attr('data-val', false)
        }
        if (manage_users_REF === true || manage_users_REF === 'true') {
          $('#manage_users_switch_update').attr('checked', true);
          $('#manage_users_switch_update').attr('data-val', true)
        } else if (manage_users_REF === false || manage_users_REF === 'false') {
          $('#manage_users_switch_update').removeAttr('checked');
          $('#manage_users_switch_update').attr('data-val', false)
        }                
        if (manage_roles_REF === true || manage_roles_REF === 'true') {
          $('#manage_roles_switch_update').attr('checked', true);
          $('#manage_roles_switch_update').attr('data-val', true)
        } else if (manage_roles_REF === false || manage_roles_REF === 'false') {
          $('#manage_roles_switch_update').removeAttr('checked');
          $('#manage_roles_switch_update').attr('data-val', false)
        }
        if (manage_settings_REF === true || manage_settings_REF === 'true') {
          $('#manage_settings_switch_update').attr('checked', true);
          $('#manage_settings_switch_update').attr('data-val', true)
        } else if (manage_settings_REF === false || manage_settings_REF === 'false') {
          $('#manage_settings_switch_update').removeAttr('checked');
          $('#manage_settings_switch_update').attr('data-val', false)
        }          
      }, 300);
    }
  });

  $('div.dataTables_length select').addClass('selectpicker');
  $('div.dataTables_length select').attr('data-width', '75px');
  $('div.dataTables_length select').selectpicker('refresh'); 

  // db.collection("users").where("role", "==", doc.id).get()
  // .then(function(querySnapshot) {
  //     querySnapshot.forEach(function(doc) {
  //       console.log(doc.id);  
  //       number_of_users++;
  //       console.log(number_of_users);
  //     });
  // })
  // .catch(function(error) {
  //     console.log("Error getting documents: ", error);
  // }); 

  let dataREF = db.collection('roles');
  let observer = dataREF.onSnapshot(querySnapshot => {
      table.clear()
      querySnapshot.forEach((doc) => {
        var data = doc.data();               
        table.row.add({
          "name": doc.id,  
          "roles": data,  
          "number_of_roles": 'Will be available in a future update',   
          "actions": '<a class="btn green-button btn-xs float-right" title="Manage incident" data-toggle="modal" data-target="#manage_modal" data-backdrop="static" data-keyboard="false"><i class="fas fa-fw fa-edit"></i>Edit </a>'       
        }).node().id = doc.id;
        table.draw();
      });  
  }, err => {
    console.log(`Encountered error: ${err}`);
  });  

$('#role_delete').click(function () { 
  $("#role_delete_spinner").show()
  $('#role_delete').attr("disabled", true);
  db.collection('roles').doc(table_row_data.name).delete().then(function() {
    console.log("Role deleted");
    $('#role_delete').attr("disabled", false);
    $("#role_delete_spinner").hide()
    $('#manage_modal').modal('hide');
  }).catch(function(error) {
    console.error("Error removing document: ", error);
    $('#role_delete_role_details').attr("disabled", false);
    $("#role_delete_spinner").hide()
  })
})

$('#role_create').click(function () { 
  console.clear()
  $("#role_create").attr("disabled", true);
  $("#role_create_spinner").show()
  let name = $("#role_name").val()
  if (name === '') {
    // 
  } else {
    let manage_incidents_switch = $("#manage_incidents_switch").attr('data-val')
    let manage_components_switch = $("#manage_components_switch").attr('data-val')
    let manage_users_switch = $("#manage_users_switch").attr('data-val')
    let manage_roles_switch = $("#manage_roles_switch").attr('data-val')
    let manage_settings_switch = $("#manage_settings_switch").attr('data-val')
    
    db.collection("roles").doc(name).set({
        manage_incidents: manage_incidents_switch,
        manage_components: manage_components_switch, 
        manage_users: manage_users_switch, 
        manage_roles: manage_roles_switch, 
        manage_settings: manage_settings_switch,
    })     
    .then(function(docREF) {
      console.log("Role created");
      $("#role_create_spinner").hide()
      $("#create_modal").modal('hide')
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }
})

$('#manage_incidents_switch').click(function () { 
  if ($('#manage_incidents_switch').is(":checked")) {
    $('#manage_incidents_switch').attr('data-val', true)
  } else {
    $('#manage_incidents_switch').removeAttr('checked')
    $('#manage_incidents_switch').attr('data-val', false)
  }
})

$('#manage_components_switch').click(function () { 
  if ($('#manage_components_switch').is(":checked")) {
    $('#manage_components_switch').attr('data-val', true)
  } else {
    $('#manage_components_switch').removeAttr('checked')
    $('#manage_components_switch').attr('data-val', false)
  }
})

$('#manage_users_switch').click(function () { 
  if ($('#manage_users_switch').is(":checked")) {
    $('#manage_users_switch').attr('data-val', true)
  } else {
    $('#manage_users_switch').removeAttr('checked')
    $('#manage_users_switch').attr('data-val', false)
  }
})

$('#manage_roles_switch').click(function () { 
  if ($('#manage_roles_switch').is(":checked")) {
    $('#manage_roles_switch').attr('data-val', true)
  } else {
    $('#manage_roles_switch').removeAttr('checked')
    $('#manage_roles_switch').attr('data-val', false)
  }
})

$('#manage_settings_switch').click(function () { 
  if ($('#manage_settings_switch').is(":checked")) {
    $('#manage_settings_switch').attr('data-val', true)
  } else {
    $('#manage_settings_switch').removeAttr('checked')
    $('#manage_settings_switch').attr('data-val', false)
  }
})

// Update roles
$('#manage_incidents_switch_update').click(function () { 
  if ($('#manage_incidents_switch_update').is(":checked")) {
    $('#manage_incidents_switch_update').attr('data-val', true)
  } else {
    $('#manage_incidents_switch_update').removeAttr('checked')
    $('#manage_incidents_switch_update').attr('data-val', false)
  }
})

$('#manage_components_switch_update').click(function () { 
  if ($('#manage_components_switch_update').is(":checked")) {
    $('#manage_components_switch_update').attr('data-val', true)
  } else {
    $('#manage_components_switch_update').removeAttr('checked')
    $('#manage_components_switch_update').attr('data-val', false)
  }
})

$('#manage_users_switch_update').click(function () { 
  if ($('#manage_users_switch_update').is(":checked")) {
    $('#manage_users_switch_update').attr('data-val', true)
  } else {
    $('#manage_users_switch_update').removeAttr('checked')
    $('#manage_users_switch_update').attr('data-val', false)
  }
})

$('#manage_roles_switch_update').click(function () { 
  if ($('#manage_roles_switch_update').is(":checked")) {
    $('#manage_roles_switch_update').attr('data-val', true)
  } else {
    $('#manage_roles_switch_update').removeAttr('checked')
    $('#manage_roles_switch_update').attr('data-val', false)
  }
})

$('#manage_settings_switch_update').click(function () { 
  if ($('#manage_settings_switch_update').is(":checked")) {
    $('#manage_settings_switch_update').attr('data-val', true)
  } else {
    $('#manage_settings_switch_update').removeAttr('checked')
    $('#manage_settings_switch_update').attr('data-val', false)
  }
})

$('#role_create_update').click(function () { 
  $("#role_update_spinner").show()
  $("#update_role_alert").removeClass('alert alert-success').addClass('alert alert-light-warning')
  $("#update_role_alert").html('If you have a lot users with this role this might take a few seconds, please wait ..')
  $("#update_role_alert").show()
  
  console.clear();
  let manage_incidents_val = $('#manage_incidents_switch_update').attr('data-val')
  let manage_components_val = $('#manage_components_switch_update').attr('data-val')
  let manage_users_val = $('#manage_users_switch_update').attr('data-val')
  let manage_roles_val = $('#manage_roles_switch_update').attr('data-val')
  let manage_settings_val = $('#manage_settings_switch_update').attr('data-val')

  db.collection("roles").doc(table_row_data.name).set({
      manage_incidents: manage_incidents_val,
      manage_components: manage_components_val, 
      manage_users: manage_users_val, 
      manage_roles: manage_roles_val, 
      manage_settings: manage_settings_val,                                
  })
  .then(function(docRef) {
    db.collection("users").where("role", "==", 'admin').get()
    .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            db.collection("users").doc(doc.id).update({
              role_permissions: {
                manage_incidents: manage_incidents_val,
                manage_components: manage_components_val, 
                manage_users: manage_users_val, 
                manage_roles: manage_roles_val, 
                manage_settings: manage_settings_val, 
              }                   
            })
            .then(function(docREF) {
              $("#update_role_alert").html('Done! <br>You may now close this window.')
              $("#update_role_alert").removeClass('alert alert-light-warning').addClass('alert alert-success')
              $("#update_role_alert").css('font-size', '15px')
              $("#role_update_spinner").hide()
              $('#role_create_update').attr("disabled", false);         
              // $('#manage_modal').modal('hide')    
            })
            .catch(function(error) {
              console.error("Error adding document: ", error);
            });            
        });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });      
  })
  .catch(function(error) {
    $("#role_update_spinner").hide()
    $('#role_create_update').attr("disabled", false);   
    console.error("Error adding document: ", error);
  }); 

})

} else {
  $('#no_privileges_card').show()
  $('#table_card').hide()
} 
});