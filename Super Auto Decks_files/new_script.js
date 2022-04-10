// ============ URL LESEN UND ERSTELLEN ===============

function checkURLonLoad() { //Beim Laden der Seite die URL checken
	//fetch query parameters ?p=[...]&f=[...]
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);

	if (urlParams.has('n')) {
		const deck_name = urlParams.get('n');
        deck_name_element = document.getElementById("deck_name");
        deck_name_element.innerText = deck_name;
    }

	// ---------------------------- select pets --------------------------------
	if (urlParams.has('p')) { //check if exists
		const url_pets = urlParams.get('p');
		console.log("Pet string detected: " + url_pets);
		if (url_pets.length > 2) {
			//const allPetsList = document.querySelectorAll('div.pets');
			var pet_string = url_pets.substr(1, url_pets.length-2); //cut off [ ] brackets
			var pos_start = 0;
			var textlen = pet_string.length;
			var pos_comma = pet_string.search(","); //search for commas
			var pet_id = 0;

			while (pos_comma != -1) { //if comma is found, go to loop
				pet_id = pet_string.substr(pos_start, (pos_comma-pos_start));
				//console.log("Pet id: " + pet_id);

				var pet_div = document.querySelector("div.pets[data-id-game='" + CSS.escape(pet_id) + "']") //select correct div via ingame-id
				var pet_div_id = pet_div.getAttribute("id");
				//get type and tier
				var type = pet_div_id.substr(0, 1); //type = "P" for pet, "F" for food
				var tier = pet_div_id.substr(1, 1); //tier = 1...6 according to tier

				var dataname = "data-selected-" + String(type) + String(tier); //data name tag of div

				selectItem(pet_div,dataname); //call function to select item

				textlen = pet_string.length; //get lentght
				pet_string = pet_string.substr(pos_comma+1, (textlen - pos_comma - 1)); //shorten the string / cut of selected id
				pos_comma = pet_string.search(","); //search for next comma
			}

			if (pet_string.length > 1) { //explicitly select last entry (because there is no comma after last entry)
				var pet_div = document.querySelector("div.pets[data-id-game='" + CSS.escape(pet_string) + "']")
				var pet_div_id = pet_div.getAttribute("id");
					//get type and tier
				var type = pet_div_id.substr(0, 1); //type = "P" for pet, "F" for food
				var tier = pet_div_id.substr(1, 1); //tier = 1...6 according to tier

				var dataname = "data-selected-" + String(type) + String(tier); //data name tag of div

				selectItem(pet_div,dataname);
			}
		}
	}

	// ---------------------------- select foods --------------------------------
	if (urlParams.has('f')) {
		const url_food = urlParams.get('f');
		console.log("Food string detected: " + url_food);
		if (url_food.length > 2) {
			//const allfoodList = document.querySelectorAll('div.food');
			var food_string = url_food.substr(1, url_food.length-2);
			var pos_start = 0;
			var textlen = food_string.length;
			var pos_comma = food_string.search(",");
			var food_id = 0;

			while (pos_comma != -1) {
				food_id = food_string.substr(pos_start, (pos_comma-pos_start));
				//console.log("food id: " + food_id);

				var food_div = document.querySelector("div.food[data-id-game='" + CSS.escape(food_id) + "']")
				var food_div_id = food_div.getAttribute("id");
					//get type and tier
				var type = food_div_id.substr(0, 1); //type = "P" for food, "F" for food
				var tier = food_div_id.substr(1, 1); //tier = 1...6 according to tier

				var dataname = "data-selected-" + String(type) + String(tier); //data name tag of div

				selectItem(food_div,dataname);

				textlen = food_string.length;
				food_string = food_string.substr(pos_comma+1, (textlen - pos_comma - 1));
				pos_comma = food_string.search(",");
			}

			if (food_string.length > 1) {
				var food_div = document.querySelector("div.food[data-id-game='" + CSS.escape(food_string) + "']")
				var food_div_id = food_div.getAttribute("id");
					//get type and tier
				var type = food_div_id.substr(0, 1); //type = "P" for food, "F" for food
				var tier = food_div_id.substr(1, 1); //tier = 1...6 according to tier

				var dataname = "data-selected-" + String(type) + String(tier); //data name tag of div

				selectItem(food_div,dataname);
			}
		}

	}

	countAll(); //call function to set all counters correctly
}

window.onload = checkURLonLoad; //wird beim Laden der Seite aufgerufen



// ============ SELECT ELEMENTS AND COUNT THEM ===============

function selectItem(element,dataname) {
	//select an item
	element.style.border = "3px solid #56bc5a";
	element.style.backgroundColor = "#34647c";
	element.style.display = "block";
	element.setAttribute(dataname, "1");
	//document.getElementById("url-feld").innerHTML = "URL has changed - please create new one";
}

function unselectItem(element,dataname){
	//unselect an item
	element.style.border = "3px solid #4d4d4d";
	element.style.backgroundColor = "#000e1d";
	element.style.display = "none";
	element.setAttribute(dataname, "0");
	//document.getElementById("url-feld").innerHTML = "URL has changed - please create new one";
}


function itemClicked(){ //is run when an item is clicked

	//get ID and selection status of div
	var item_id = event.srcElement.id;
	var element = document.getElementById(item_id);

	//get type and tier
	var type = item_id.substr(0, 1); //type = "P" for pet, "F" for food
	var tier = item_id.substr(1, 1); //tier = 1...6 according to tier

	var dataname = "data-selected-" + String(type) + String(tier); //data name tag of div

	//console.log(dataname);

	//set correct limits for custom pack
	if (type == "P"){
		var limit = 10;
	}else{
		if (String(tier) == "1"){
			var limit = 2;
		}else{
			var limit = 3;
		}
	}

	//fetch all selected items and get selection status of clicked item
	var selected_elements = document.querySelectorAll('[' + CSS.escape(dataname) + '="1"]');
	var isSelected = element.getAttribute(dataname);

	//check wether to select or deselct
	if (isSelected == 0){
		if (selected_elements.length < limit){ 		//check if maximum number of items per tier are already selected or not
			selectItem(element, dataname);
			var num_selected = selected_elements.length + 1;
			document.getElementById("url-feld").innerHTML = "...";
		}else{
			var num_selected = selected_elements.length;
		}
	}else{
		unselectItem(element, dataname);
		var num_selected = selected_elements.length - 1;
		document.getElementById("url-feld").innerHTML = "...";
	}

	//refresh counter
	var counter_id = "counter_" + String(type) + String(tier);
	var element_counter = document.getElementById(counter_id);

	if (num_selected != limit){
		element_counter.innerHTML = "&#9744; " + String(num_selected) + "/" + String(limit);
		element_counter.style.color = "red";
	}else{
		element_counter.innerHTML = "&#9745; " + String(num_selected) + "/" + String(limit);
		element_counter.style.color = "green";
	}
}

function countAll() {
	//count all selected pets and food

	var selected_elements = document.querySelectorAll('[' + CSS.escape(dataname) + '="1"]');

	//count pets of all 6 tiers
	var limit = 10;
	for (let n = 1; n <= 6; n++) {
		//count
		var dataname = "data-selected-P" + String(n); //create correct data name tag
		var selected_elements = document.querySelectorAll('[' + CSS.escape(dataname) + '="1"]'); //fetch all selected items of certain type/tier
		var num_selected = selected_elements.length;

		//refresh counter
		var counter_id = "counter_P" + String(n);
		var element_counter = document.getElementById(counter_id);

		if (num_selected != limit){
			element_counter.innerHTML = "&#9744; " + String(num_selected) + "/" + String(limit);
			element_counter.style.color = "red";
		}else{
			element_counter.innerHTML = "&#9745; " + String(num_selected) + "/" + String(limit);
			element_counter.style.color = "green";
		}
	}

	//count food from all 6 tiers
	limit = 2;
	for (let n = 1; n <= 6; n++) {
		//count
		if (n>1){
			limit = 3;
		}
		var dataname = "data-selected-F" + String(n); //create correct data name tag
		var selected_elements = document.querySelectorAll('[' + CSS.escape(dataname) + '="1"]'); //fetch all selected items of certain type/tier
		var num_selected = selected_elements.length;

		//refresh counter
		var counter_id = "counter_F" + String(n);
		var element_counter = document.getElementById(counter_id);

		if (num_selected != limit){
			element_counter.innerHTML = "&#9744; " + String(num_selected) + "/" + String(limit);
			element_counter.style.color = "red";
		}else{
			element_counter.innerHTML = "&#9745; " + String(num_selected) + "/" + String(limit);
			element_counter.style.color = "green";
		}
	}

}


// =============== CREATE URLS =======================

function createURLs(){
	//Create URL codes
	//data name tag of div
	var data_id = "data-id-game";

	//initialise strings
	var string_pets = "";
	var string_food = "";
	var string_first_pet = "";

	//get ingame IDs from selected pets of all 6 tiers
	for (let n = 1; n <= 6; n++) {
		var dataname = "data-selected-P" + String(n); //create correct data name tag
		var selected_elements = document.querySelectorAll('[' + CSS.escape(dataname) + '="1"]'); //fetch all selected items of certain type/tier
		for (let i = 0; i < selected_elements.length; i++) {
			var element = selected_elements[i];
			var ingameID = element.getAttribute(data_id );
			string_pets = string_pets + String(ingameID) + ",";
			if (i == 0) {
				string_first_pet = String(ingameID); //speichert das erste T6 pet
			}
		}
	}
	string_pets = string_pets.substr(0, (string_pets.length-1)); //remove comma after last entry

	//get ingame IDs from selected food of all 6 tiers
	for (let n = 1; n <= 6; n++) {
		var dataname = "data-selected-F" + String(n); //create correct data name tag
		var selected_elements = document.querySelectorAll('[' + CSS.escape(dataname) + '="1"]'); //fetch all selected items of certain type/tier
		for (let i = 0; i < selected_elements.length; i++) {
			var element = selected_elements[i];
			var ingameID = element.getAttribute(data_id );
			string_food = string_food + String(ingameID) + ",";
		}
	}

	string_food = string_food.substr(0, (string_food.length-1)); //remove comma after last entry

	//create final strings
	//var string_mysite = "www.sap-decks.com?p=[" + string_pets + "]&f=[" + string_food + "]";
	var string_mysite = "https://www.sap-decks.com/?p=[" + string_pets + "]&f=[" + string_food + "]";
	//document.getElementById("url-feld").innerHTML = string_mysite;
	var text_field = document.getElementById("url-feld");
	text_field.value = string_mysite;

	var string_github = '{"Title":"sap-decks.com","Minion":' + string_first_pet + ',"Minions":[' + string_pets + '],"Spells":[' + string_food + ']}';
	//document.getElementById("url-github").innerHTML = string_github;
	var text_field2 = document.getElementById("url-github");
	text_field2.value = string_github;
}
