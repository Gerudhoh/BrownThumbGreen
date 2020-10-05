$(document).ready(function () {
        console.log("Julia Hohenadel 1006930");

        $('#moviesDiv').hide();
        $('#Lab3').hide();

        $.ajax({
          type: 'get',         //Request type
          url: '/initTable',   //The server endpoint we are connecting to
          success: function (result) {
            console.log("INIT:");
            console.log(result); 
            console.log("~~~~~~~~~~~~~");
            $("#output").html(output.result);
          },
          fail: function(error) {
            console.log(error); 
          }
      });

        $('#lab3').on('submit', function(event) {
            if(event.originalEvent.submitter.id == "POST") {
              addUser();
            } else if (event.originalEvent.submitter.id == "GET") {
              getUser();
            } else if (event.originalEvent.submitter.id == "PUT") {
              updateUser();
            } else {
              deleteUser();
            }
          
            event.preventDefault();
         });


        $('#get-button').click(function () {
          $.ajax({ 
            type: 'GET',         //Request type
            contentType: 'application/json',
            url: '/movies',   //The server endpoint we are connecting to
            success: function(result){
              $("#movies").html(result);
          }});
        });

       $('#post-button').click(function () {
        $.ajax({ 
          type: 'POST',         //Request type
          contentType: 'application/json',
          url: '/movies',   //The server endpoint we are connecting to
          success: function(result){
            $("#movies").html(result);
        }});
      });

        $('#put-button').click(function () {
          $.ajax({ 
            type: 'PUT',         //Request type
            contentType: 'application/json',
            url: '/movies',   //The server endpoint we are connecting to
            success: function(result){
              $("#movies").html(result);
          }});
       });

        $('#delete-button').click(function () {
          $.ajax({ 
            type: 'DELETE',         //Request type
            contentType: 'application/json',
            url: '/movies',   //The server endpoint we are connecting to
            success: function(result){
              $("#movies").html(result);
          }});
        });
});


function addUser() {
  $.ajax({
    data : {
       username : $('#username').val(),
       password: $('#password').val(),
           },
       type : 'POST',
       url : '/users',
       success: function(result){
         console.log(result);
         $('#output').text(result.result).show();
     },
     fail: function(error) {
       console.log(error); 
     }});
}

function getUser() {
  $.ajax({
    data : {
       username : $('#username').val(),
       password: $('#password').val(),
           },
       type : 'GET',
       url : '/users',
       success: function(result){
        let output = "user = " + result.user + "\npassword = " + result.password;
        $('#output').text(output).show();
     },
     fail: function(error) {
       console.log(error); 
     }});
}

function updateUser() {
  $.ajax({
    data : {
       username : $('#username').val(),
       password: $('#password').val(),
           },
       type : 'PUT',
       url : '/users',
       success: function(result){
         console.log(result);
         let output = "user = " + result.user + "\nnew password = " + result.new_password;
         $('#output').text(output).show();
     },
     fail: function(error) {
       console.log(error); 
     }});
}

function deleteUser() {
  $.ajax({
    data : {
       username : $('#username').val(),
       password: $('#password').val(),
           },
       type : 'DELETE',
       url : '/users',
       success: function(result){
         console.log(result);
         $('#output').text(result.result).show();
     },
     fail: function(error) {
       console.log(error); 
     }});
}