var currentMonth = moment().format("MM")
var currentYear = moment().format("YYYY")
var currentDay = moment().format("DD")

$('#button_loader').hide();
$('#accordion').on('show.bs.collapse', function (event) {
   $(event.target).siblings('.card-header').find('i.ni').css('transform', 'rotate(180deg)');
   $(event.target).siblings('.card-header').find('i.ni').css('transition', 'transform 0.3s linear');
});

$('#accordion').on('hide.bs.collapse', function (event) {
    $(event.target).siblings('.card-header').find('i.ni').css('transform', 'rotate(0deg)');
    $(event.target).siblings('.card-header').find('i.ni').css('transition', 'transform 0.3s linear');
});

$('#subscribe_email').click(function(){
    var email = document.getElementById('email').value;
    $('#button_loader').show();
    if( /(.+)@(.+){2,}\.(.+){2,}/.test(email) ){

        fetch('http://localhost:3000/subscribe', {
            method: 'post',
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email})
        }).then(res => res.json())
            .then (res => {
                if (res.status == 'OK') {
                    $('#button_loader').hide();
                    $('#subscribe_email').prop('disabled', true);
                    $('#subscribe_email').css('background-color', '#19a769');
                    $('#subscribe_email').css('color', '#fff');
                    $('#subscribe_email').html('Thanks for subscribing!');  
                } else {
                    $('#button_loader').hide();
                    $('#subscribe_email').prop('disabled', true);
                    $('#subscribe_email').css('background-color', '#e24c4c');
                    $('#subscribe_email').html('An error happened ..');                     
                }
            })
      } else {
        // invalid email
        $('#button_loader').hide();
        $('#subscribe_email').html('Invalid email!');
        $('#subscribe_email').css('background-color', '#e24c4c');
        setTimeout(() => {
            $('#subscribe_email').css('background-color', '#2196F3');
            $('#subscribe_email').html('Subscribe via email');
        }, 3000);
      }
});

// Reload page every 5 min or when a new incident has been registered
let componentsObserver = db.collection('components')
  .onSnapshot(querySnapshot => {
    querySnapshot.docChanges().forEach(change => {
      if (change.type === 'modified') {
        location.reload();
      } 
      if (change.type === 'removed') {
        location.reload();
      }               
    });
})

jQuery(document).ready(function(){
    jQuery('.toast__close').click(function(e){
      e.preventDefault();
      var parent = $(this).parent('.toast');
      parent.fadeOut("slow", function() { $(this).remove(); } );
    });
});

var statusHeader = document.getElementById('status-header');
var statusText = document.getElementById('status-text');

let collapseID = 1;
db.collection("components").orderBy("status").get().then((querySnapshot) => {
    document.getElementById("status-header").style.display = "block";
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $('#dashboard').show();
        } else {
            //
        }
    });     
    if (querySnapshot.empty == true) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                statusHeader.className = 'alert alert-warning';
                statusText.innerHTML = 'There is no data to show <a class="float-right" href="/dashboard/components/" target="_blank" style="color:#fff;">Go to dashboard <i class="fas fa-arrow-right"></i></a>';  
            } else {
                statusHeader.className = 'alert alert-warning';
                statusText.innerHTML = 'There is no data to show';  
            }
        });           
    } else {
        statusHeader.className = 'alert alert-success';
        statusText.innerHTML = 'All systems operational';          
    }    
    querySnapshot.forEach((doc) => { 
        var data = doc.data();
        if (data.status == 'Investigating') {
            statusHeader.className = 'alert alert-warning';
            statusText.innerHTML = "Some services may not be working right now, see details below.";            
        }           
        if (data.status == 'Maintenance') {
            statusHeader.className = 'alert alert-warning';
            statusText.innerHTML = "Some services may not be working right now, maintenance ongoing. See more details below.";            
        }           
        
        let componentStatus = data.status;
        let documentID = doc.id
        collapseID++;

        var accordion = document.getElementById('accordion');
        var cardNode = document.createElement('card');
        var cardHeaderNode = document.createElement('div');
        var cardBodyNode = document.createElement('div');
        var h5Node = document.createElement('h5');
        var collapseNode = document.createElement('div');
        var collapseLinkNode = document.createElement('a');
        var collapseLinTextNode = document.createTextNode(documentID);
        var collapseSpanNode = document.createElement('span');
        var collapseSpanINode = document.createElement('i');

        cardNode.appendChild(cardHeaderNode);
        cardHeaderNode.appendChild(h5Node);
        h5Node.appendChild(collapseLinkNode);
        collapseLinkNode.appendChild(collapseLinTextNode);
        collapseLinkNode.appendChild(collapseSpanNode);
        collapseSpanNode.appendChild(collapseSpanINode);
        cardNode.appendChild(collapseNode);
        collapseNode.appendChild(cardBodyNode);
        accordion.appendChild(cardNode);

        // Classes
        cardNode.className = 'card';
        cardHeaderNode.className = 'card-header';
        h5Node.className = 'mb-0';
        collapseLinkNode.className = 'btn btn-link w-100 text-primary text-left collapsed';
        collapseNode.className = 'collapse';
        cardBodyNode.className = 'card-body';          

        // Attributes 
        cardHeaderNode.setAttribute('id', 'heading' + collapseID);
        collapseLinkNode.setAttribute('data-toggle', 'collapse');
        collapseLinkNode.setAttribute('data-target', '#collapse' + collapseID);
        collapseLinkNode.setAttribute('aria-expanded', 'false');
        collapseLinkNode.setAttribute('aria-controls', 'collapse' + collapseID);
        collapseNode.setAttribute('id', 'collapse' + collapseID);
        collapseNode.setAttribute('aria-labelledby', 'heading' + collapseID);
        collapseNode.setAttribute('data-parent', '#accordion');

        // Card tooltip attributes
        cardHeaderNode.setAttribute('data-toggle', 'tooltip');
        cardHeaderNode.setAttribute('data-placement', 'top');
        cardHeaderNode.setAttribute('title', 'You can click me to view more info');
        cardHeaderNode.setAttribute('data-container', 'body');
        cardHeaderNode.setAttribute('data-animation', 'true');

        // HTML     
        if (componentStatus == 'Operational') {
            cardBodyNode.innerHTML = '<i class="fas fa-check-circle fa-3x status-green"></i><br>' + 'Service is operational';  
            cardBodyNode.style = 'text-align:center;'
            collapseSpanNode.className = "status-green float-right";
            collapseSpanNode.innerHTML = '<i class="fas fa-fw fa-check-circle"></i>Operational' + '<i class="ni ni-bold-down"></i>';                             
        }            
        if (componentStatus == 'Maintenance') {
            collapseSpanNode.className = "status-orange float-right";
            collapseSpanNode.innerHTML = '<i class="fas fa-fw fa-wrench"></i>Maintenance' + '<i class="ni ni-bold-down"></i>';    

            let incidentID = data.incidentID.id

            var docRef = db.collection("incidents").doc(incidentID);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    let incidentREF = doc.data();
                    let maintenanceREF = doc.data().incidentDetails.maintenance;
                    let monitoringREF = doc.data().incidentDetails.monitoring;
                    let statusREF = doc.data().status;
                    let maintenanceDate;

                    try {
                        maintenanceDate = maintenanceREF.startTime;
                        monitoringDate = monitoringREF.startTime;
                    }
                    catch(err) {
                        // monitoringDate & resolvedDate will result in an error because it probably doesn't exist in the database
                    }
                    finally {
                        // console.log(monitoringDate);
                        // console.log(resolvedDate);
                    }

                    var timelineContentNode = document.createElement('div');
                    var timeline = document.createElement('ul');
                    if (statusREF == 'maintenance') {
                        collapseSpanNode.innerHTML = '<i class="fas fa-fw fa-wrench"></i>Maintenance' + '<i class="ni ni-bold-down"></i>';
                        collapseSpanNode.className = "status-orange float-right";

                        var maintenanceNode = document.createElement('li');
                        var maintenanceTitleNode = document.createElement('h3');
                        var maintenanceStatusNode = document.createElement('div')
                        var maintenanceDescNode = document.createElement('p')

                        timelineContentNode.appendChild(timeline)
                        timeline.appendChild(maintenanceNode)
                        maintenanceNode.appendChild(maintenanceTitleNode);
                        maintenanceNode.appendChild(maintenanceStatusNode);
                        maintenanceNode.appendChild(maintenanceDescNode);
                        cardBodyNode.appendChild(timelineContentNode);
            
                        timelineContentNode.className = 'timeline-content';
                        timeline.className = 'timeline';
                        maintenanceNode.className = 'incident';
                        maintenanceStatusNode.className = doc.data().status;

                        let maintenanceDateEnd = maintenanceREF.endTime;
                        if (maintenanceDateEnd == null || maintenanceDateEnd == undefined) {
                            maintenanceTitleNode.innerHTML = maintenanceREF.title + ' - ' + maintenanceDate
                        } else {
                            maintenanceTitleNode.innerHTML = maintenanceREF.title + ' - ' + maintenanceDate + ' - ' + maintenanceDateEnd.slice(13, 18)
                        }
                        maintenanceStatusNode.innerHTML = 'Maintenance';
                        maintenanceDescNode.innerHTML = maintenanceREF.description;
                    }

                       
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }            
        if (componentStatus == 'Investigating') {
            let incidentID = data.incidentID.id
            var docRef = db.collection("incidents").doc(incidentID);
            docRef.get().then(function(doc) {
                if (doc.exists) {
                    // Firestore references
                    let incidentREF = doc.data();
                    let investigatingREF = doc.data().incidentDetails.investigating;
                    let monitoringREF = doc.data().incidentDetails.monitoring;
                    let resolvedREF = doc.data().incidentDetails.resolved;
                    let statusREF = doc.data().status;

                    let investigatingDate;
                    let monitoringDate;
                    // let resolvedDate;

                    try {
                        investigatingDate = investigatingREF.startTime;
                        monitoringDate = monitoringREF.startTime;
                    }
                    catch(err) {
                        // monitoringDate & resolvedDate will result in an error because it probably doesn't exist in the database
                    }
                    finally {
                        // console.log(monitoringDate);
                        // console.log(resolvedDate);
                    }

                    var timelineContentNode = document.createElement('div');
                    var timeline = document.createElement('ul');

                    if (statusREF == 'resolved') {
                        collapseSpanNode.innerHTML = '<i class="fas fa-fw fa-check-circle"></i>Operational' + '<i class="ni ni-bold-down"></i>';
                        collapseSpanNode.className = "status-green float-right";
                    }
                    if (statusREF == 'monitoring') {
                        collapseSpanNode.innerHTML = '<i class="fas fa-fw fa-heartbeat"></i>Monitoring' + '<i class="ni ni-bold-down"></i>'; 
                        collapseSpanNode.className = "status-orange float-right";

                        // Get the "monitoring" element first, 
                        var monitoringNode = document.createElement('li');
                        var monitoringTitleNode = document.createElement('h3');
                        var monitoringStatusNode = document.createElement('div')
                        var monitoringDescNode = document.createElement('p')

                        timelineContentNode.appendChild(timeline)
                        timeline.appendChild(monitoringNode)
                        monitoringNode.appendChild(monitoringTitleNode);
                        monitoringNode.appendChild(monitoringStatusNode);
                        monitoringNode.appendChild(monitoringDescNode);
                        cardBodyNode.appendChild(timelineContentNode);
            
                        timelineContentNode.className = 'timeline-content';
                        timeline.className = 'timeline';
                        monitoringNode.className = 'incident';
                        monitoringStatusNode.className = 'monitoring';

                        monitoringTitleNode.innerHTML = monitoringREF.title + ' - ' + monitoringDate;
                        monitoringStatusNode.innerHTML = 'Monitoring';
                        monitoringDescNode.innerHTML = monitoringREF.description; 

                        // Get the "investigating" element
                        var investigatingNode = document.createElement('li');
                        var investigatingTitleNode = document.createElement('h3');
                        var investigatingStatusNode = document.createElement('div')
                        var investigatingDescNode = document.createElement('p')

                        timelineContentNode.appendChild(timeline)
                        timeline.appendChild(investigatingNode)
                        investigatingNode.appendChild(investigatingTitleNode);
                        investigatingNode.appendChild(investigatingStatusNode);
                        investigatingNode.appendChild(investigatingDescNode);
                        cardBodyNode.appendChild(timelineContentNode);
            
                        timelineContentNode.className = 'timeline-content';
                        timeline.className = 'timeline';
                        investigatingNode.className = 'incident';
                        investigatingStatusNode.className = 'investigating';

                        investigatingTitleNode.innerHTML = investigatingREF.title + ' - ' + investigatingDate;
                        investigatingStatusNode.innerHTML = 'Investigating';
                        investigatingDescNode.innerHTML = investigatingREF.description; 
                    }
                    if (statusREF == 'investigating') {
                        collapseSpanNode.innerHTML = '<i class="fas fa-fw fa-user-secret"></i>Investigating' + '<i class="ni ni-bold-down"></i>';
                        collapseSpanNode.className = "status-red float-right";

                        var investigatingNode = document.createElement('li');
                        var investigatingTitleNode = document.createElement('h3');
                        var investigatingStatusNode = document.createElement('div')
                        var investigatingDescNode = document.createElement('p')

                        timelineContentNode.appendChild(timeline)
                        timeline.appendChild(investigatingNode)
                        investigatingNode.appendChild(investigatingTitleNode);
                        investigatingNode.appendChild(investigatingStatusNode);
                        investigatingNode.appendChild(investigatingDescNode);
                        cardBodyNode.appendChild(timelineContentNode);
            
                        timelineContentNode.className = 'timeline-content';
                        timeline.className = 'timeline';
                        investigatingNode.className = 'incident';
                        investigatingStatusNode.className = incidentREF.status;

                        let investigatingDateEnd = investigatingREF.endTime;
                        if (investigatingDateEnd == null || investigatingDateEnd == undefined) {
                            investigatingTitleNode.innerHTML = investigatingREF.title + ' - ' + investigatingDate
                        } else {
                            investigatingTitleNode.innerHTML = investigatingREF.title + ' - ' + investigatingDate + ' - ' + investigatingDateEnd.slice(13, 18)

                        }
                        investigatingStatusNode.innerHTML = 'Investigating';
                        investigatingDescNode.innerHTML = investigatingREF.description;
                    }        
                } else {
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });                
            
        }   
    });
},
err => {
  console.log(`Encountered error: ${err}`);
});

const daysInThisMonth = () => {
    const days = []
    const dateStart = moment()
    const dateEnd = moment().add(30, 'days')
    while (dateEnd.diff(dateStart, 'days') >= 0) {
     days.push(dateStart.format('D'))
     dateStart.add(1, 'days')
    }
    return days
}