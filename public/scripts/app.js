$(() => {
/*  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.name).appendTo($("body"));
    }
    if (!user){
      $('.error').slideToggle(1000);
    }
  });;
  */
  $('#login-form').submit( (event) => {
    //console.log("Any text");
    event.preventDefault();
    $.ajax({
      method: "POST",
      url: "/",
      data: $(event.target).serialize(),
    }).done((res) => {

      if (!res.user){
        $('.error').slideToggle(1000);
      }
    });;
  })
});



