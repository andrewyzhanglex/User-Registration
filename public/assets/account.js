$(document).ready(function(){

  $('#account-form').on('submit', function(){
    var account = $(this.serializeArray());
      $.ajax({
        type: 'POST',
        url: '/signup',
        data: account,
        datatype: JSON,
        success: function(data){
          //do something with the data via front-end framework
          location.reload();
        }
      });

      return false;

  });
});