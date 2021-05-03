$('#header-buttons').hide()
const manage_incidents = Cookies.get('manage_incidents')
const manage_components = Cookies.get('manage_components')
const manage_users = Cookies.get('manage_users')
const manage_roles = Cookies.get('manage_roles')
const manage_settings = Cookies.get('manage_settings')
const current_user = Cookies.get('current_user')
const role = Cookies.get('role')
var auth = firebase.auth();

$(document).ready(function () {
  if (manage_settings == 'false') {
    $('#no_privileges_card').show()
    $('#table_card').hide()
  }
  if (manage_settings == 'true') {

  }
})