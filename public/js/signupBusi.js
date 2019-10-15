//Menu pic URL link
var menu;
// Convert Base64 to Image
$(document).ready(function() {
  $("#BaseToImage").click(function() {
    //alert($("#response").val());
  });

  //Convert Image to Base64

  $("#inputFileToLoad").change(function() {
    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];
      var fileReader = new FileReader();
      fileReader.onload = function(fileLoadedEvent) {
        menu = fileLoadedEvent.target.result;
        console.log(menu);
        $("#response").val(menu);
      };
      fileReader.readAsDataURL(fileToLoad);
    }
  });
  document.getElementById("preview").setAttribute("src", $("#response").val());
  $("#preview").show();

  // Getting references to our form and input
  var signUpForm = $("form.signup");
  var businessNameInput = $("input#buinessName-input");
  var locationInput = $("input#location-input");
  // When the signup button is clicked, we validate the email and password are not blank
  signUpForm.on("submit", function(event) {
    event.preventDefault();
    var userData = {
      businessName: businessNameInput.val().trim(),
      menu: menu,
      location: locationInput.val().trim()
    };

    if (!userData.businessName || !userData.menu || !userData.location) {
      return;
    }
    // If we have an email and password, run the signUpUser function
    signUpBusi(userData.businessName, userData.menu, userData.location);
    businessNameInput.val("");
    menu;
    locationInput.val("");
  });

  // Does a post to the signup route. If successful, we are redirected to the members page
  // Otherwise we log any errors
  function signUpBusi(businessName, menu, location) {
    $.post("/api/signupBusi", {
      businessName: businessName,
      menu: menu,
      location: location
    })
      .then(function() {
        window.location.replace("/business");
        // If there's an error, handle it by throwing up a bootstrap alert
      })
      .catch(handleLoginErr);
  }

  function handleLoginErr(err) {
    $("#alert .msg").text(err.responseJSON);
    $("#alert").fadeIn(500);
  }
});
