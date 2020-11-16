$(document).ready(function () {
        console.log("Julia Hohenadel 1006930");

        $('#help').hide();

        $.ajax({
          type: 'get',         //Request type
          url: '/initTables',   //The server endpoint we are connecting to
          success: function (result) {
            console.log(result); 
          },
          fail: function(error) {
            console.log(error); 
          }
      });

        $('#login').on('submit', function(event) {
           $('#output').text("").show();
           $('#help').hide();
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
              location.reload();
          }});
        });

        $('#myPlants').click(function () {
          $('#plantsTable').hide();
          if($('#myPlants').text() === "Show My Plants"){
            $('#myPlants').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...');
            $('#search').hide();
            getUserPlants();
          } else {
            $('#plantsTable').append("");
            $('#search').show();
            $('#myPlants').text ("Show My Plants");
          }
          
        });

        $('#plantSearch').click(function () {
          console.log("search");
          $('#plantSearch').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Searching');
          plantsSearch();
      });
});

async function getUserPlants() {
  const rawData = await $.ajax({ 
    type: 'POST', //Request type
    url: '/loadPlants',   //The server endpoint we are connecting to
    success: function(result){
      $('#myPlants').text("Search Plants");
    }});
    const result = JSON.parse(rawData);
    populateTableForUser(result);
}

async function plantsSearch() {
  const rawData = await $.ajax({ 
    data : {
            queryPlant : $('#plantBar').val(),
            quantity: $('#quantity').val(),
          },
    type: 'POST', //Request type
    url: '/plantSearch',   //The server endpoint we are connecting to
    });
  const result = JSON.parse(rawData);
  populateTable(result.data);
  $('#plantSearch').text("Search");
  return result;
}

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
         if (result.fail != null){
          $('#help').show();
         } else if (result.error != null){
          $('#output').text(result.result).show();
         } else {
          location.reload();
         }
     },
     fail: function(error) {
       console.log(error);
       $('#help').show();
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


function savePlant(plantId){
  $.ajax({ 
    type: 'POST', //Request type
    data : {
      plantID: plantId,
          },
    url: '/savePlant',   //The server endpoint we are connecting to
    success: function(result){
      console.log(result.result);
      let buttonId = '#add' + plantId;
      $(buttonId).html('Added <svg width="2em" height="2em" viewBox="0 0 16 16" class="bi bi-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.236.236 0 0 1 .02-.022z"/></svg>');
  }});
}

/**
 * 
 * @param {JSON} plants a json of all the results from the search
 */
function populateTable(plants) {  
  $('#plantsTable').show();
  $('#plantsTable').html('<tr><th width="25%">Picture</th><th th width="20%" class="p3">Common Name</th><th>Scientific Name</th><th>Add Plant</th> </tr>');
  for(let i = 0, f; f = plants[i]; i++) {
    let row = "";
    let plant = plants[i];
    row += '<tr>';
    // image
    row += '<td>';
    if(plant.image_url != null) {
      row += '<img src=' + plant.image_url + ' class="autoResizeImage">';
    } else {
      row += "Unavailable"
    }
    row += '</td>';
    // common name
    row += '<td>';
    row += plant.common_name;
    row += '</td>';
    // scientific name
    row += '<td>';
    row += plant.scientific_name;
    row += '</td>';
    // Save button
    row += '<td>';
    row += '<button type="button" id="add'+ plant.id +'" class="btn btn-success btn-circle btn-lg" onclick=savePlant('+ plant.id +')>Add</button>';
    row += '</td>';
    
    row += '</tr>';
    $('#plantsTable').append(row);
  }
}

  /**
 * 
 * @param {JSON} plants a json of all the user's plants
 */
function populateTableForUser(plants) {  
  $('#plantsTable').show();
  $('#plantsTable').html('<tr><th width="25%">Pic</th><th width="12%">Common Name</th><th width="10%">Scientific Name</th><th width="8%">Light</th><th width="8%">Edible</th><th width="12%">Toxicity</th><th width="10%">Avg. Height</th><th width="10%">Growth Rate</th></tr>');
  for(let i = 0, f; f = plants[i]; i++) {
    let row = "";
    console.log(plants[i].data);
    let plant = plants[i].data;
    row += '<tr>';
    // image
    row += '<td>';
    if(plant.image_url != null) {
      row += '<img src=' + plant.image_url + ' class="autoResizeImage">';
    } else {
      row += "Unavailable"
    }
    row += '</td>';
    // common name
    row += '<td>';
    row += plant.common_name;
    row += '</td>';
    // scientific name
    row += '<td>';
    row += plant.scientific_name;
    row += '</td>';
    if(plant.main_species.growth != null){
      // light
      row += '<td>';
      row += plant.main_species.growth.light;
      row += '</td>';
    }
    // Edible?
    row += '<td>';
    row += plant.main_species.edible;
    row += '</td>';
    if(plant.main_species.specifications != null){
      // toxicity?
      row += '<td>';
      row += plant.main_species.specifications.toxicity;
      row += '</td>';
      // avg height
      row += '<td>';
      row += plant.main_species.specifications.average_height.cm + " cm";
      row += '</td>';
      // growth rate
      row += '<td>';
      row += plant.main_species.specifications.growth_rate;
      row += '</td>';
    }
    
    row += '</tr>';
    $('#plantsTable').append(row);
  }
}
