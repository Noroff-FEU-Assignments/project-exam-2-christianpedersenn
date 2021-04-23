let totalComponents = 0
let totalIncidents = 0
let openIncidents = 0
let maintenance = 0

// Get total open incidents
db.collection("incidents").where("status", "in", ['investigating', 'Investigating', 'Monitoring', 'maintenance'])
.get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        openIncidents++
    });
    document.getElementById('open_incidents').innerHTML = openIncidents
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});

// Get total incidents
db.collection("incidents").where("status", "in", ['investigating', 'Investigating', 'Closed', 'Operational', 'Monitoring'])
.get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        totalIncidents++
    });
    document.getElementById('total_incidents').innerHTML = totalIncidents
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});


// Get total maintenance
db.collection("incidents").where("status", "==", 'maintenance')
.get()
.then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        maintenance++
    });
    document.getElementById('maintenance').innerHTML = maintenance
})
.catch((error) => {
    console.log("Error getting documents: ", error);
});

// Get total components
db.collection("components").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        totalComponents++
    });
    document.getElementById('total_components').innerHTML = totalComponents
});