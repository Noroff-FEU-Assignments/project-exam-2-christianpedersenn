jQuery(document).ready(function(){
    jQuery('.toast__close').click(function(e){
      e.preventDefault();
      $("#toast").click(function () {
        $(this).fadeOut(1000);
      })
    });
});