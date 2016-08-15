<?php
/**
 * Search Names in the Yellow Pages
 * 
 * @author Ralfe Poisson <ralfepoisson@gmail.com>
 * @version 1.0
 */

/**
 * Person Class
 */
class Person {
	var $Name;
	var $Address;
	var $Telephone;
}

// Configuration
$url_template = "http://www.pagesjaunes.fr/recherche/%location%/%name%";

// Get Query String Parameters
$name = $_GET['name'];
$location = $_GET['location'];

// Build the URL
$url = str_replace("%name%", $name, $url_template);
$url = str_replace("%location%", $location, $url);

// Query the Yellow Pages
$c = curl_init();
curl_setopt($c, CURLOPT_URL, $url);
curl_setopt($c, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, "quoiqui={$name}&ou={$location}");
$output = curl_exec($c);
curl_close($c);

// Extract results from the output
$pos1 = strpos($output, '<header class="v-card">');
$pos2 = strrpos($output, '</footer>') + 9;
$results = substr($output, $pos1, $pos2 - $pos1);
$result_items = explode('<header class="v-card">', $results);

// Extract details of each result
$people = array();
foreach($result_items as $item) {
	// Name
	$pos1 = strpos($item, 'title="');
	$pos2 = strpos($item, '" data', $pos1 + 1);
	$name = substr($item, $pos1 + 7, $pos2 - $pos1 - 7);
	
	// Address
	$pos0 = strpos($item, 'title="Voir le plan"');
	$pos1 = strpos($item, "data-pjlb", $pos0) + 13;
	$pos2 = strpos($item, ">", $pos1) + 1;
	$pos3 = strpos($item, "<", $pos2);
	$address = substr($item, $pos2, $pos3 - $pos2);
	
	// Telephone
	$pos0 = strpos($item, 'class="num" title="') + 19;
	$pos1 = strpos($item, '"', $pos0 + 1);
	$tel = substr($item, $pos0, $pos1 - $pos0);
	
	// Add the record to the array
	$person = new Person();
	$person->Name = $name;
	$person->Address = $address;
	$person->Telephone = $tel;
	$people[] = $person;
}

// Remove Duplicates
function exists($name) {
	for ($i = 0; $i < sizeof($people); $i++) {
		if ($people[$i].Name == $name) {
			return true;
		}
	}
	return false;
}
$unique_people = array();
foreach($people as $person) {
	if (!exists($person->Name)) {
		$unique_people[] = $person;
	}
}

// Output Results
$json = json_encode($unique_people);
print $json;