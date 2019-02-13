import {markdown} from 'markdown';

// import some polyfill to ensure everything works OK
import "babel-polyfill";

// import bootstrap's javascript part
import 'bootstrap';

// import the style
import "./style.scss";

/*
  Put the JavaScript code you want below.
*/

import axios from 'axios';

async function getCharacters(){
	let response = await axios.get("https://character-database.becode.xyz/characters");
	let list = document.createElement("ul");

	for (let i = 0; i < response.data.length; i++) {
		let image = document.createElement("IMG");
		image.setAttribute("src", "data:image/jpeg;base64," + response.data[i].image);
		let div = document.createElement("div");
		div.className = "buttons";
		let li = document.createElement("li");
		let character = document.createElement("div");
		character.className = "item";
		let para = document.createElement("p");
		let text = document.createTextNode(response.data[i].name + ": " + response.data[i].shortDescription);
		para.appendChild(text);
		let editButton = document.createElement("button");
		let editText = document.createTextNode("Edit character");
		let deleteButton = document.createElement("button");
		let deleteText = document.createTextNode("Delete character");
		deleteButton.appendChild(deleteText);
		editButton.appendChild(editText);
		character.appendChild(image);
		image.className = "image";
		div.appendChild(deleteButton);
		deleteButton.className ="delete";
		div.appendChild(editButton);
		editButton.className = "edit";
		character.appendChild(para);
		li.appendChild(div);
		li.appendChild(character);
		list.appendChild(li); 
	}
	document.querySelector(".characters").appendChild(list);
	return response;
}

(async () => {
	let response = await getCharacters();
	
	let characters = document.querySelectorAll(".item");
	let edits = document.querySelectorAll(".edit");
	let deletes = document.querySelectorAll(".delete");

	for (let i = 0; i < characters.length; i++){
    	(function(index){
    		deletes[i].onclick = function(){		
    			(async () => {
	    			let id = response.data[i].id
	    			let deleteCharacter = window.confirm("Are you sure you want to delete this character ?");
					if(deleteCharacter){
						await axios.delete("https://character-database.becode.xyz/characters/"+id);
						window.location.reload(true);
					}
				})();
    		}

    		edits[i].onclick = function(){
    			document.querySelector(".modal-content").innerText = "";
				let title = document.createElement("h2");
				let titleText = document.createTextNode("Character Edition");
				title.appendChild(titleText);
				let image = document.createElement("input");
				image.setAttribute("type", "file");
				image.className = "files"
				let output = document.createElement("output");
				output.className = "output";
				let name = document.createElement("p");
				let nameText = document.createTextNode("New name:");
				name.appendChild(nameText);
				let nameInput = document.createElement("input");
				nameInput.value = response.data[i].name;
				let shortDescription = document.createElement("p");
				let shortDescriptionText = document.createTextNode("New Short Description:");
				shortDescription.appendChild(shortDescriptionText);
				let shortDescriptionInput = document.createElement("textarea");
				shortDescriptionInput.value = response.data[i].shortDescription;
				let description = document.createElement("p");
				let descriptionText = document.createTextNode("New Description:");
				description.appendChild(descriptionText);
				let descriptionInput = document.createElement("textarea");
				descriptionInput.value = response.data[i].description;
				let submitButton = document.createElement("button");
				let submitText = document.createTextNode("Submit");
				submitButton.appendChild(submitText);
				submitButton.className = "submit";
				document.querySelector(".modal-content").appendChild(title);
				document.querySelector(".modal-content").appendChild(image);
				document.querySelector(".modal-content").appendChild(output);
				document.querySelector(".modal-content").appendChild(name);
				document.querySelector(".modal-content").appendChild(nameInput);
				document.querySelector(".modal-content").appendChild(shortDescription);
				document.querySelector(".modal-content").appendChild(shortDescriptionInput);
				document.querySelector(".modal-content").appendChild(description);
				document.querySelector(".modal-content").appendChild(descriptionInput);
				document.querySelector(".modal-content").appendChild(submitButton);
		  		document.querySelector(".modal").style.display = "block";
		  		let id = response.data[i].id
		  		document.querySelector(".files").addEventListener("change", handleFileSelect, false);

		  		submitButton.addEventListener("click", () => {
		  			let img = document.querySelector(".thumb").src;
  					img = img.substring(22);
  					(async () => {
	  					await axios.put("https://character-database.becode.xyz/characters/"+id, {
			    							name: nameInput.value,
			    							shortDescription: shortDescriptionInput.value,
			    							description: descriptionInput.value,
			    							image: img
			  							})
	  					document.querySelector(".modal").style.display = "none";
	  					window.location.reload(true);
	  				})();
				});
    		}

    		characters[i].onclick = function(){
            	document.querySelector(".modal-content").innerText = "";
				document.querySelector(".modal-content").innerHTML = markdown.toHTML(response.data[i].description);
  				document.querySelector(".modal").style.display = "block";
        	}
    	})(i);
	}

	document.querySelector(".add").addEventListener("click", () => {
		document.querySelector(".modal-content").innerText = "";
		let title = document.createElement("h2");
		let titleText = document.createTextNode("Character Creation");
		title.appendChild(titleText);
		let image = document.createElement("input");
		image.setAttribute("type", "file");
		image.className = "files"
		let output = document.createElement("output");
		output.className = "output";
		let name = document.createElement("p");
		let nameText = document.createTextNode("Name:");
		name.appendChild(nameText);
		let nameInput = document.createElement("input");
		let shortDescription = document.createElement("p");
		let shortDescriptionText = document.createTextNode("Short Description:");
		shortDescription.appendChild(shortDescriptionText);
		let shortDescriptionInput = document.createElement("textarea");
		let description = document.createElement("p");
		let descriptionText = document.createTextNode("Description:");
		description.appendChild(descriptionText);
		let descriptionInput = document.createElement("textarea");
		let submitButton = document.createElement("button");
		let submitText = document.createTextNode("Submit");
		submitButton.appendChild(submitText);
		submitButton.className = "submit";
		document.querySelector(".modal-content").appendChild(title);
		document.querySelector(".modal-content").appendChild(image);
		document.querySelector(".modal-content").appendChild(output);
		document.querySelector(".modal-content").appendChild(name);
		document.querySelector(".modal-content").appendChild(nameInput);
		document.querySelector(".modal-content").appendChild(shortDescription);
		document.querySelector(".modal-content").appendChild(shortDescriptionInput);
		document.querySelector(".modal-content").appendChild(description);
		document.querySelector(".modal-content").appendChild(descriptionInput);
		document.querySelector(".modal-content").appendChild(submitButton);
  		document.querySelector(".modal").style.display = "block";

  		document.querySelector(".files").addEventListener("change", handleFileSelect, false);


  		submitButton.addEventListener("click", () => {
  			let img = document.querySelector(".thumb").src;
  			img = img.substring(22);

  			(async () => {
	  			let response = await axios.post("https://character-database.becode.xyz/characters", {
			    					name: nameInput.value,
			    					shortDescription: shortDescriptionInput.value,
			    					description: descriptionInput.value,
			    					image: img
			  					})
	  			document.querySelector(".modal").style.display = "none";
	  			window.location.reload(true);
			})();			
		});
	});

	window.onclick = function(event){
 		if (event.target == document.querySelector(".modal")){
   			document.querySelector(".modal").style.display = "none";
  		}
	}

	let reader = new FileReader();

	function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (let i = 0, f; f = files[i]; i++) {

      // Only process image files.
      if (!f.type.match('image.*')) {
      	continue;
      }

      let reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = (function(theFile) {
      	return function(e) {
          // Render thumbnail.
          let span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
          '" title="', escape(theFile.name), '"/>'].join('');
          document.querySelector(".output").insertBefore(span, null);
      };
  })(f);

      // Read in the image file as a data URL.
      reader.readAsDataURL(f);
  }
}
	
	
})();