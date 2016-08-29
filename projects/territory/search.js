var names = [];

function search() {
	// Log debug output
	console.log("Searching...");
	
	// Validate
	if (!validate()) {
		console.log("- Validation failed.");
		return;
	}
	
	// Determine which list type to use
	var list_type = $("#predefinedList").prop("checked")? "predefined" : "custom";
	console.log("- List Type: " + list_type);
	
	// Get list of names according to list type
	if (list_type == "custom") {
		console.log("- Using a custom list.");
		var name_locations = $("#names").val();
		names = name_locations.split("\n");
	}
	else {
		var list_name = $("#list").val();
		console.log("- Using the predefined list: " + list_name);
		names = predefined_lists[list_name];
	}
	console.log("- Names to search: ", names);
	
	// Clear the results area
	$("#results").html("");
	
	// Show the progress modal
	$("#progressModal").modal("show");
	
	// Start the search
	search_name(0);
}

function search_name(index) {
	// Check that there is still a name at the index location
	if (typeof names[index] == 'undefined') {
		return;
	}
	
	name = names[index];
	var location = $("#location").val();
	var url = "search.php?name=" + name + "&location=" + location;
	
	var numNames = names.length;
	var percent = index / numNames * 100;
	$("#progressBar").width(percent + "%")
	$("#searching_name").html(name);
	
	$.ajax({ type: "GET",   
		 url: url,   
		 async: false,
		 success : function(text)
		 {
			 var people = JSON.parse(text);
			 var results = "";
			 for (var i = 0; i < people.length; i++) {
				 var person = people[i];
				 if (person.Name.length > 2 && person.Name != "Ouvrir le menu") {
					 console.log(person);
					 results += "<tr><td>" + person.Name + "</td><td><a href='tel:" + person.Telephone + "'>" + person.Telephone + "</a></td><td>" + person.Address + "</td></tr>";
				 }
			 }
			 if (results.length > 0){
				$("#results").append("<h3>" + name + "</h3><table class='table'><tr><th width='30%'>Name</th><th width='30%'>Number</th><th width='30%'>Address</th></tr>" + results + "</table>");
			 }
		 }
	});
	
	if (index < names.length - 1) {
		setTimeout(function(){ search_name(index + 1); }, 500);
	}
	else {
		$("#progressModal").modal("hide");
	}
}

function change_list_type(list_type) {
	if (list_type == "custom") {
		$("#predefinedList").prop("checked", false);
		$("#customList").prop("checked", true);
		$("#predefined_list_area").slideUp("slow");
		$("#custom_list_area").slideDown("slow");
	}
	else {
		$("#predefinedList").prop("checked", true);
		$("#customList").prop("checked", false);
		$("#custom_list_area").slideUp("slow");
		$("#predefined_list_area").slideDown("slow");
	}
}

function validate() {
	console.log("- Validating search form.");
	
	// Check form
	var list_type = $("#predefinedList").prop("checked")? "predefined" : "custom";
	if ($("#location").val().length == 0) {
		alert("Please enter a location.");
		return false;
	}
	if (list_type == "predefined" && $("#list").val() == 0) {
		alert("Please select a predefined list.");
		return false;
	}
	else if (list_type == "custom" && $("#names").val().length == 0) {
		alert("Please add some names.");
		return false;
	}
	
	// Validation successful
	return true;
}

function cancel_search() {
	console.log("- Cancelling search.");
	names = [];
	$("#progressModal").modal("hide");
}
