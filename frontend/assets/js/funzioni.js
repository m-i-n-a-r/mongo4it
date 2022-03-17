function countIncidenti() {
  $.ajax({
    method: "POST",
    url: "../backend/funzioni.php",
    data: {
        servizio : "countIncidenti",
    }
  })
  .done(function(response) {
	  if (response == null) return '';
	  response = $.parseJSON(response);
	  $('#tot_incidenti').append(response.count);
  });
}