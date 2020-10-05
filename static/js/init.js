$(document).ready(function () {
        console.log("Julia Hohenadel 1006930");

        $('#help').hide();

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

        $('#login').on('submit', function(event) {
            if(event.originalEvent.submitter.id == "SIGNUP") {
              signup();
            } else if (event.originalEvent.submitter.id == "LOGIN") {
              login();
            } else {
              console.log("Something isn't right here :(");
            }
            event.preventDefault();
         });

         $('#logout').click(function () {
          $.ajax({ 
            type: 'POST', //Request type
            url: '/logout',   //The server endpoint we are connecting to
            success: function(result){
              $("#output").html(result);
          }});
        });
});


function login() {
  $.ajax({
    data : {
       username : $('#username').val(),
       password: $('#password').val(),
           },
       type : 'POST',
       url : '/login',
       success: function(result){
         console.log(result);
         $('#output').text(result.result).show();
         if (result.fail != null){
          $('#help').show();
         }
     },
     fail: function(error) {
       console.log(error); 
     }});
}

function signup() {
  createUser();
  login();
}

function createUser() {
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