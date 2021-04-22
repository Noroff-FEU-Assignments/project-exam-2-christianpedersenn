$('#header-buttons').hide()
const manage_incidents = Cookies.get('manage_incidents')
const manage_components = Cookies.get('manage_components')
const manage_users = Cookies.get('manage_users')
const manage_roles = Cookies.get('manage_roles')
const manage_settings = Cookies.get('manage_settings')
const current_user = Cookies.get('current_user')
const role = Cookies.get('role')
$(document).ready(function () {
if (manage_components == 'true') {
  $('#table').show();
  var table = $('#table_id').DataTable({ 
    columns: [
        { data: "name" },
        { data: "status" },
        { data: "description" },
        { data: "created_by" },
        { data: "actions" },
    ],
    "paging": false,
    "dom":' <"search"f><"top"l>rt<"bottom"ip><"clear">',
    "language": {
      // zeroRecords: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green animate__animated animate__tada'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
      emptyTable: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-folder-plus fa-4x status-orange animate__animated animate__flash i-folder' data-toggle='modal' data-target='#create_modal' data-backdrop='static' data-keyboard='false'></i><br><br><p style='font-size: 20px;'>You have no components, <br>create a new one by clicking the icon above.</p></div>",
      zeroRecords: '<div class="text-center" style="width: 100%; padding: 40px;"><i class="fas fa-align-center fa-4x status-green"></i><br><br><p style="font-size: 20px;">No records found</p></div>',
      processing: '<div class="text-center" style="width: 100%; padding: 40px;"><span class="dashboard-spinner spinner-blue spinner-sm"></span><span class="sr-only">Loading...</span></div>',
    },          
  });

  $('#table_id tbody').on('click', 'tr', function () {
    var data = table.row( this ).data();
    if (data == undefined) {
      //
    } else {
      $('#manage_modal').modal('show'); 
      $('#modalTitle').html('Manage component: ' + data.name)
      $('#nc_name_update').val(data.name);
      $('#nc_description_update').val(data.description);    
      Cookies.set('data_name', data.name)      
    }
  });
 
  $('div.dataTables_filter input').addClass('form-control-datatable');


  
  let dataREF = db.collection('components');
  let observer = dataREF.onSnapshot(querySnapshot => {
      table.clear()
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        let status;
        let status_string;
        let description;
        let created_by;
        if (data.status == 'Operational') {
          status_string = '<span class="green"><i class="fas fa-fw fa-check-circle"></i> ' + data.status + '</span>'
        }
        if (data.status == 'Maintenance') {
          status_string = '<span class="orange"><i class="fas fa-fw fa-wrench"></i> ' + data.status + '</span>'
        }
        if (data.status == 'Monitoring') {
          status_string = '<span class="orange"><i class="fas fa-fw fa-heartbeat"></i> ' + data.status + '</span>'
        }
        if (data.status == 'Investigating') {
          status_string = '<span class="red"><i class="fas fa-fw fa-user-secret"></i> ' + data.status + '</span>'
        }    
        if (data.status == 'Outage') {
          status_string = '<span class="red"><i class="fas fa-fw fa-times-circle"></i> ' + data.status + '</span>'
        }             
        try {
          status = data.status
          description = data.description
          created_by = data.created_by
        }
        catch(err) {
          //
        }
        finally {
          //
        }            
        table.row.add({
          "name": doc.id,
          "status": status_string,
          "description": data.description,
          "created_by": created_by,
          "actions": '<a class="btn green-button btn-xs" title="Manage incident" data-toggle="modal" data-target="#manage_modal" data-backdrop="static" data-keyboard="false"><i class="fas fa-fw fa-edit"></i>Edit </a>'
        }).node().id = doc.id;
        table.draw(); 
      });  
  }, err => {
    console.log(`Encountered error: ${err}`);
  });  


$('#update_component').click(function () { 
  const nc_name_update = $('#nc_name_update').val();
  const nc_description_update = $('#nc_description_update').val();
  const data_name = Cookies.get('data_name')

  if (nc_name_update == '' || nc_description_update == '') {
    // console.log('No input');
    // Error handler here
  } else {
    db.collection("components").doc(nc_name_update).set({
        created_by: current_user,
        status: 'Operational',
        description: nc_description_update
    },{ merge: true })   
    .then(function(docRef) {
      if (nc_name_update == data_name) {
        console.log("Document successfully written!")
        $('#manage_modal').modal('hide');
        Cookies.remove('data_name')
      } else {
      db.collection('components').doc(data_name).delete().then(function() {
        console.log("Document successfully deleted!");
        $('#manage_modal').modal('hide');
        Cookies.remove('data_name')
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });  
      }      
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });  
  }
});
      
// Delete specific component
$('#delete_component').click(function () { 
  const nc_name_update = $('#nc_name_update').val();
  db.collection('components').doc(nc_name_update).delete().then(function() {
    console.log("Document successfully deleted!");
    $('#manage_modal').modal('hide');
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  });        
});

// Create a new component
$('#create_component').click(function () { 
  const nc_name = $('#nc_name').val();
  const nc_description = $('#nc_description').val();
  if (nc_name == '' || nc_description == '') {
    // console.log('No input');
    // Error handler here
  } else {
    db.collection("components").doc(nc_name).set({
        created_by: current_user,
        status: 'Operational',
        description: nc_description
    }, { merge: true }) 
    $('#create_modal').modal('hide');           
  }
});

// DELETE ALL INCIDENTS
$('#deleteAllComponents').click(function () { 
  db.collection("components").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        db.collection("components").doc(doc.id).delete().then(function() {
          console.log("Document successfully deleted!");
          $('#deleteall_modal').modal('hide');
          location.reload() 
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });        
    });
  });     
}) 

} else {
  $('#no_privileges_card').show()
  $('#table_card').hide()
} 


});