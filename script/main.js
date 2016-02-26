var GAMEWINDOWDIV = "gamewindow";
var BUTTONAREADIV = "buttonarea";
var GUESSAREADIV = "guessarea";
var HANGMANAREADIV = "hangmanarea";

var GAMEWINDOW = document.getElementById(GAMEWINDOWDIV); // The div to display the game in
var ALPHABET_LENGTH = 26; // Length of the alphabet to use for the game
var ALPHABET_STARTVALUE_ASCII = 65; // ASCII code for uppercase A
var BUTTONS = []; // The array that will hold the buttons with each character displayed on them

var BUTTONROWS = 2;

/**
*
* Creates a new Array with the buttons containing the defined alphabet
* and returns it.
*
**/
function createButtonArray()
{
	var createdButtons = [];
	
	for(var i=0; i < ALPHABET_LENGTH; i++)
	{
		// Create the button-element and it's label in different steps
		var currentChar = String.fromCharCode(ALPHABET_STARTVALUE_ASCII + i);
		var currentButton = document.createElement("BUTTON");
		var currentButtonText = document.createTextNode(currentChar);
		
		// Set the button's class name, so we can style the buttons in the css
		currentButton.className = "gamebutton";
		currentButton.value = currentChar;
		// Set the button's onclick method, so the user can interact with the game
		currentButton.addEventListener("click", buttonPressedHandler);
		
		// Assign label to button
		currentButton.appendChild(currentButtonText);
		createdButtons.push(currentButton);
	}
	
	return createdButtons;
}

/**
*
* Adds the buttons contained in the given array to the
* HTML-Document and renders it in the user's webbrowser
* inside the given div, with the globally set BUTTONROWS variable
*
* @param buttonArray The Array that contains the buttons to be rendered
* @param divToRender The buttons will be rendered into a div with this name
*
**/
function renderButtonsFromArray(buttonArray, divToRender)
{
	// Create a table to hold the button rows in.
	var realDiv = document.getElementById(divToRender);
	var renderTable = document.createElement("table");
	renderTable.className = "buttonrendertable";
	
	if(buttonArray.length == 0)
		alert("Cant't render an empty array!")
	
	if(realDiv != null)
	{
		// If the given div is present in the document, check if
		// the number of buttons given can be divided nicely by
		// the number of rows given.
		if(buttonArray.length % BUTTONROWS == 0)
		{
			var buttonRowPointer = 0;
			var buttonsPerRow = (buttonArray.length)/BUTTONROWS;
			
			for(var i=0; i < BUTTONROWS; i++)
			{
				var buttonRow = document.createElement("tr");
				buttonRow.className = "buttonrenderrow";
				
				// Iterate through the number of buttons per row in each row
				// and give each button it's own cell in the table
				for(var u=0; u < buttonsPerRow; u++)
				{
					var buttonCell = document.createElement("td");
					buttonCell.className = "buttonrendercell";
					
					buttonCell.appendChild(buttonArray[buttonRowPointer*buttonsPerRow+u]);
					buttonRow.appendChild(buttonCell);
				}
				
				// append each row to the table
				renderTable.appendChild(buttonRow);
				buttonRowPointer++;
			}
		}
		else
			alert("The number of buttons given in the array can't be divided by the number\nof button rows set in the global variable!");
		
		realDiv.appendChild(renderTable);
	}
	else
		alert("The div, given for rendering the buttons in, doesn't exist in the document!\nDiv given: "+divToRender);
}

function buttonPressedHandler(mouseClickEvent)
{
	var clickedButton = mouseClickEvent.target;
	
	clickedButton.disabled = true;
}

if(GAMEWINDOW != null)
{
	BUTTONS = createButtonArray();
	renderButtonsFromArray(BUTTONS, BUTTONAREADIV);
}
else
{
	alert("Could not initialize the gamewindow div!");
}