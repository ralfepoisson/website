function send() {
	// Get details
	var name = $("#name").val();
	var email = $("#email").val();
	var message = $("#message").val();
	
	// Log contact data
	console.log("* Sending Contact Data");
	console.log(" - Name: ", name);
	console.log(" - Email: ", email);
	console.log(" - Message: ", message);
	
	// Submit Contact data
	var url = "contact.php?name=" + name + "&email=" + email + "&message=" + encodeURI(message);
	$.ajax({ 
		type: "GET",   
		url: url,   
		async: false,
		success : function(text)
		{
			toastr.success("Your message has been successfully sent. You will be contacted as soon as possible.", "Message sent");
		}
	});
}