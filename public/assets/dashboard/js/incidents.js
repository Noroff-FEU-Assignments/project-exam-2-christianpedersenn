$('#header-buttons').hide()
const manage_incidents = Cookies.get('manage_incidents')
const manage_components = Cookies.get('manage_components')
const manage_users = Cookies.get('manage_users')
const manage_roles = Cookies.get('manage_roles')
const manage_settings = Cookies.get('manage_settings')
const current_user = Cookies.get('current_user')
const role = Cookies.get('role')

let currentDay = moment().format("DD")
let currentMonth = moment().format("MMM")
let currentYear = moment().format("YYYY")
let table_row_data;
let template_table_data;

$(document).ready(function () {
if (manage_incidents == 'true') {
  $('#table').show();
    
  var table = $('#table_id').DataTable({ 
    "columnDefs": [
      { "visible": false, "targets": [7, 8, 9] }
    ],    
    columns: [
        { data: "id" },
        { data: "title" },
        { data: "status" },
        { data: "date" },
        { data: "affected_components" },
        { data: "created_by" },
        { data: "actions" },
        { data: "description" },
        { data: "date_end" },
        { data: "type" }
    ],  
    "sDom": "<'row'<'col-sm-12 col-md-6'<'#incident_select'>><'col-sm-12 col-md-6'f>>",  
    "paging": false,
    "language": {
      // emptyTable: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
      zeroRecords: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green animate__animated animate__tada'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
      emptyTable: '<div class="text-center" style="width: 100%; padding: 40px;"><i class="fas fa-align-center fa-4x status-green"></i><br><br><p style="font-size: 20px;">No records found</p></div>',
      processing: '<div class="text-center" style="width: 100%; padding: 40px;"><span class="dashboard-spinner spinner-blue spinner-sm"></span><span class="sr-only">Loading...</span></div>',
    },    
  });

  db.collection('components').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var data = doc.data();       
        var components_list = document.getElementById('inc_components_update')
        var componentOptionNode = document.createElement('option')
        components_list.appendChild(componentOptionNode);
        componentOptionNode.innerHTML = doc.id;
        $('#inc_components_update').selectpicker('refresh');       
    });
  });

  db.collection('templates').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var data = doc.data();       
        var components_list = document.getElementById('description_templates')
        var componentOptionNode = document.createElement('option')
        components_list.appendChild(componentOptionNode);

        componentOptionNode.innerHTML = data.name;
        $(componentOptionNode).attr('data-subtext', data.description);
        $('#description_templates').selectpicker('refresh');       
    });
  });

  $('#description_templates').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    console.log(e);
    console.log(clickedIndex);
    console.log($(this).val());
    document.getElementById('inc_title').value = $(this).val();
    document.getElementById('inc_description').innerHTML = $('option:selected', this).attr("data-subtext");
  });   

  $('#table_id tbody').on('click', 'tr', function () {
    table_row_data = table.row( this ).data();
    if (table_row_data == undefined) {
    } else {
      console.log(table_row_data);
      $('#manage_modal').modal('show'); 
      $('#modalTitle').html('Manage incident: ' + table_row_data.id)  

      $('#inc_title_update').val(table_row_data.title);
      $('#inc_description_update').val(table_row_data.description);
      $('#inc_start_date_update').val(table_row_data.date);
      $('#inc_end_date_update').val(table_row_data.date_end);
      $('#inc_components_update').selectpicker('val', table_row_data.affected_components); 
      $('#inc_type_update').selectpicker('val', table_row_data.type); 
      $('#inc_components_update').selectpicker('refresh');   
    }
  });
  $('div.dataTables_length select').addClass('selectpicker');
  $('div.dataTables_length select').attr('data-width', '75px');
  $('div.dataTables_length select').selectpicker('refresh'); 
  
  var incident_select = '<select class="selectpicker" id="incident_select"><option value="open">Open incidents</option>' +
  '<option value="closed">Closed incidents</option><option value="all">All incidents</option></select>';
  $("#incident_select").html(incident_select); 
  $("#incident_select").css('margin-bottom', '10px'); 
  $('#incident_select').on('changed.bs.select', function (e, clickedIndex, isSelected, previousValue) {
    if (clickedIndex == 0) {
      table.columns(2).search('maintenance|investigating|open|monitoring', true, false).draw();      
    }
    if (clickedIndex == 1) {
      table.columns(2).search('closed', true, false).draw();
    }
    if (clickedIndex == 2) {
      table.columns(2).search('').draw();
    }        
  });

  db.collection('components').get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        var data = doc.data();       
        var components_list = document.getElementById('inc_components')
        var componentOptionNode = document.createElement('option')
        components_list.appendChild(componentOptionNode);
        componentOptionNode.innerHTML = doc.id;
        $('#inc_components').selectpicker('refresh');       
    });
  }); 

  let dataREF = db.collection('incidents');
  let observer = dataREF.onSnapshot(querySnapshot => {
      table.clear()
      querySnapshot.forEach((doc) => {
        var data = doc.data();
        let title;
        let startTime;
        var affected = data.affected;
        var status = data.status.charAt(0).toUpperCase() + data.status.slice(1);
        var created_by = data.created_by;
        var description;
        var investigatingREF = data.incidentDetails.investigating;
        var monitoringREF = data.incidentDetails.monitoring;
        var resolvedREF = data.incidentDetails.resolved;
        var maintenanceREF = data.incidentDetails.maintenance;
        var closedREF = data.incidentDetails.closed;

        if (data.status == 'investigating') {
          title = investigatingREF.title
          startTime = investigatingREF.startTime
          endTime = investigatingREF.endTime
          description = investigatingREF.description;
          status_string = '<span class="red"><i class="fas fa-fw fa-user-secret"></i> Investigating</span>'
        }       
        if (data.status == 'monitoring') {
          title = monitoringREF.title
          startTime = monitoringREF.startTime
          endTime = monitoringREF.endTime
          description = monitoringREF.description;
          status_string = '<span class="orange"><i class="fas fa-fw fa-heartbeat"></i> Monitoring</span>'

        }
        if (data.status == 'resolved') {
          title = resolvedREF.title
          startTime = resolvedREF.startTime
          endTime = resolvedREF.endTime
          description = resolvedREF.description;
          status_string = '<span class="green"><i class="fas fa-fw fa-check-circle"></i> Resolved</span>'
        }  
        if (data.status == 'maintenance') {
          title = maintenanceREF.title
          startTime = maintenanceREF.startTime
          endTime = maintenanceREF.endTime
          description = maintenanceREF.description;
          status_string = '<span class="orange"><i class="fas fa-fw fa-wrench"></i> Maintenance</span>'
        }  
        if (data.status == 'Closed') {
          title = closedREF.title
          startTime = closedREF.startTime
          endTime = closedREF.endTime
          description = closedREF.description;
          status_string = '<span class="green"><i class="fas fa-fw fa-check-circle"></i> Closed</span>'
        }                   
        table.row.add({
          "id": doc.id,
          "title": title,
          "status": status_string,
          "date": startTime,
          "affected_components": affected,
          "created_by": created_by,
          "actions": '<a class="btn green-button btn-xs" title="Manage incident" data-toggle="modal" data-target="#manage_modal" data-backdrop="static" data-keyboard="false">Edit <i class="fas fa-fw fa-edit"></i></a>',
          "description": description,
          "date_end": endTime,
          //  
          //  
          //  FIX THIS, update the create function with a option to set the type value
          //  
          "type": 'Incident', 
        }).node().id = doc.id;
        // table.columns(2).search('Maintenance', 'Investigating', 'Open', 'Monitoring' ).draw();
        table.columns(2).search('maintenance|investigating|open|monitoring', true, false).draw();
      });  
  }, err => {
    console.log(`Encountered error: ${err}`);
  });  

$('#create_incident').click(function () { 
  const inc_title = $('#inc_title').val();
  const inc_type = $('#inc_type').val();
  const inc_description = $('#inc_description').val();
  const inc_components = $('#inc_components').val();
  const inc_start_date = $('#inc_start_date').val();
  const inc_end_date = $('#inc_end_date').val();

  if (inc_title == '' || inc_type == '' || inc_description == '' || inc_components == '' || inc_start_date == '') {
    // console.log('No input');
    // Error handler here
  } 
  
  if (inc_type == 'Planned maintenance') {
      db.collection("incidents").add({
        created_by: current_user,
        status: 'maintenance',
        component: inc_components[0],
        affected: inc_components,
        incidentDetails: {
          maintenance: {
            description: inc_description,           
            startTime: inc_start_date,
            endTime: inc_end_date,
            title: inc_title,
          }
        }
    })     
    .then(function(incidentID) {
      console.log("Document written with ID: ", incidentID.id);
      inc_components.forEach(function (val) {
        db.collection("components").doc(val).update({
            status: 'Maintenance',
            incidentID: {
              id: incidentID.id
            }
        })     
        .then(function() {
          console.log("Document successfully written!");
          $('#create_modal').modal('hide'); 
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });  
      })              
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });    
  } 
  if (inc_type == 'Incident') {
      db.collection("incidents").add({
        created_by: current_user,
        status: 'investigating',
        component: inc_components[0],
        affected: inc_components,
        incidentDetails: {
          investigating: {
            description: inc_description,           
            startTime: inc_start_date,
            endTime: inc_end_date,
            title: inc_title,
          }
        }
    })     
    .then(function(incidentID) {
      console.log("Document written with ID: ", incidentID.id);
      inc_components.forEach(function (val) {
        db.collection("components").doc(val).update({
            status: 'Investigating',
            incidentID: {
              id: incidentID.id
            }
        })     
        .then(function() {
          console.log("Document successfully written!");
          $('#create_modal').modal('hide'); 
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });  
      })              
    })
    .catch(function(error) {
      console.error("Error adding document: ", error);
    });
  }
});


// Create new incident template
$('#create_template').click(function (e) { 
  e.preventDefault();
  let template_name = $('#template_name').val();
  let template_description = $('#template_description').val();
  db.collection("templates").add({
    name: template_name,
    description: template_description,
  })     
  .then(function(templateID) {
    console.log("Document written with ID: ", templateID.id);
    $('#template_modal').modal('hide'); 
    $('#description_templates').selectpicker('refresh');
  })
  .catch(function(error) {
    console.error("Error adding document: ", error);
  }); 
});
 
var template_table = $('#template_table_id').DataTable({   
  columns: [
      { data: "name" },
      { data: "description" },
      { data: "actions" }
  ],
  // "sDom": "<'row'<'col-sm-12 col-md-6'<'#incident_select'>><'col-sm-12 col-md-6'f>>",  
  "paging": false,
  "language": {
    // emptyTable: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
    zeroRecords: "<div class='text-center' style='width: 100%; padding: 40px;'><i class='fas fa-handshake fa-4x status-green animate__animated animate__tada'></i><br><br><p style='font-size: 20px;'>No open incidents, that's awesome!</p></div>",
    emptyTable: '<div class="text-center" style="width: 100%; padding: 40px;"><i class="fas fa-align-center fa-4x status-green"></i><br><br><p style="font-size: 20px;">No templates found</p></div>',
    processing: '<div class="text-center" style="width: 100%; padding: 40px;"><span class="dashboard-spinner spinner-blue spinner-sm"></span><span class="sr-only">Loading...</span></div>',
  }  
});
// template_table.destroy();


let templateREF = db.collection('templates');
let templateobserver = templateREF.onSnapshot(querySnapshot => {
  template_table.clear()
    querySnapshot.forEach((doc) => {
      var data = doc.data();
      let name = data.name;
      var description = data.description;         
      template_table_data = doc.id;
      template_table.row.add({
        "name": name,
        "description": description,
        "actions": '<a type="button" class="btn red-button" id="' + doc.id + '"><i class="fas fa-trash"></i> Delete</a>'  
      }).node().id = 'row_' + doc.id;
      template_table.draw();        
    });  
}, err => {
  console.log(`Encountered error: ${err}`);
}); 

$('#template_table_id tbody').on('click', 'a', function () { 
  console.log(template_table_data);
  db.collection('templates').doc(template_table_data).delete().then(function() {
  console.log("Document successfully deleted!"); 
  // template_table.clear()
  // template_table.draw();
  }).catch(function(error) {
    console.error("Error removing document: ", error);
  })
});

// Edit a incident
$('#inc_incident_edit').click(function () { 
  const inc_title_update = $('#inc_title_update').val();
  const inc_description_update = $('#inc_description_update').val();
  const inc_start_date_update = $('#inc_start_date_update').val();
  const inc_end_date_update = $('#inc_end_date_update').val();
  const inc_type_update = $('#inc_type_update').val();
  const inc_components_update = $('#inc_components_update').val();

  console.log(table_row_data.id);
  db.collection("incidents").doc(table_row_data.id).set({
    incidentDetails: {
      investigating: {
        startTime: inc_start_date_update,
        description: inc_description_update,
        endTime: inc_end_date_update,
        title: inc_title_update
      }
    },
    affected: inc_components_update,
  },{ merge: true })     
  .then(function() {
    console.log("Incident successfully updated!");
    console.log(inc_components_update);
    console.log(inc_components_update.length);
    $('#inc_components_update').selectpicker('refresh');

    $("#inc_components_update option").each(function() {
      db.collection('components').doc($(this).val()).update({
        incidentID: firebase.firestore.FieldValue.delete(),
        status: 'Operational'
      })          
      .then(function() {
        console.log("Components status successfully updated!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
      });          
    });
    setTimeout(() => {
      inc_components_update.forEach(component => {
        console.log(component);
        db.collection("components").doc(component).update({
          status: 'Investigating',
          incidentID: {
            id: table_row_data.id
          }
        })     
        .then(function() {
          console.log("Components status successfully updated!");
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });       
      });
    }, 2000);


     
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });   
});
      
// Delete specific incident
$('#inc_delete').click(function () {
  console.log(table_row_data.id);
  table_row_data.affected_components.forEach(incident => {
    db.collection('components').doc(incident).update({
      incidentID: firebase.firestore.FieldValue.delete(),
      status: 'Operational'
    }); 
  });     

  db.collection('incidents').doc(table_row_data.id).delete().then(function() {
    console.log("Document successfully deleted!");
    $('#manage_modal').modal('hide');
    location.reload()   
  }).catch(function(error) {
      console.error("Error removing document: ", error);
  })     
});


// Fix statuspage bug
$('#fix_statuspage').click(function () {
  $('#fix_statuspage').attr("disabled", true);
  db.collection("incidents").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        doc.data().affected.forEach(incident => {
          db.collection('components').doc(incident).update({
            incidentID: firebase.firestore.FieldValue.delete(),
            status: 'Operational'
          }) 
          .then(function() {
            console.log("Status page fixed!");
            $('#fix_statuspage').html('Done!')   
          })
          .catch(function(error) {
            console.error("Error writing document: ", error);
          });        
        });     
    });
  });           
});


// Set incident to status closed
$('#inc_close').click(function () {
  console.log(table_row_data.id);
  db.collection("incidents").doc(table_row_data.id).set({
    incidentDetails: {
      closed: {
        startTime: table_row_data.date,
        description: table_row_data.description,
        endTime: currentMonth + ' ' + currentDay + ', ' + currentYear + ' ' + moment().format('hh:mm'),
        title: "Closed"
      }
    },
    status: 'Closed',
  },{ merge: true })     
  .then(function() {
    console.log("Document successfully deleted!");
    $('#manage_modal').modal('hide');
    table_row_data.affected_components.forEach(incident => {
      db.collection('components').doc(incident).update({
        incidentID: firebase.firestore.FieldValue.delete(),
        status: 'Operational'
      }); 
    });    
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });          
});

// DELETE ALL INCIDENTS
$('#deleteAllIncidents').click(function () { 
  db.collection("incidents").get().then(function(querySnapshot) {
    querySnapshot.forEach(function(doc) {
        db.collection("incidents").doc(doc.id).delete().then(function() {
          console.log("Document successfully deleted!");
          $('#deleteall_modal').modal('hide');
          location.reload()         
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        }); 
        doc.data().affected.forEach(incident => {
          db.collection('components').doc(incident).update({
            incidentID: firebase.firestore.FieldValue.delete(),
            status: 'Operational'
          }); 
        });     
    });
  });     
}) 

$('#inc_start_date_button').click(function () { 
  let timeNowString = currentMonth + ' ' + currentDay + ', ' + currentYear + ' ' + moment().format('hh:mm');
  $('#inc_start_date').val(timeNowString);
})

$('#inc_end_date_button').click(function () { 
  let timeNowString = currentMonth + ' ' + currentDay + ', ' + currentYear + ' ' + moment().format('hh:mm');
  $('#inc_end_date').val(timeNowString);
})

} else {
  // User do not have permission to view or edit incidents
  // $('#header-buttons').hide()
  // console.log(data);
  // console.log(doc);
} 
});

