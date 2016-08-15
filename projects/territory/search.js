var names = [];

function search() {
	console.log("Searching...");
	
	var name_locations = $("#names").val();
	names = name_locations.split("\n");
	$("#results").html("");
	
	$("#progressModal").modal("show");
	
	search_name(0);
}

function search_name(index) {
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
		setTimeout(function(){ search_name(index + 1); }, 1000);
	}
	else {
		$("#progressModal").modal("hide");
	}
}
