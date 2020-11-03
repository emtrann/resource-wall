$(() => {
  $('#login-form').submit( (event) => {
      //console.log("Any text");
      event.preventDefault();
      $.ajax({
        method: "POST",
        url: "/",
        data: $(event.target).serialize(),
      }).done((res) => {
        console.log(res);
        if (res.success) {
          console.log("homepage");
          window.location="/homepage";
        } else {
          $('.error').slideToggle(1000);
        }
      });;
    })
  });
