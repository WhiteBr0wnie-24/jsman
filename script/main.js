var DEBUGMODE = 0;

var GAMEWINDOWDIV = "gamewindow";
var BUTTONAREADIV = "buttonarea";
var GUESSAREADIV = "guessarea";
var HANGMANAREADIV = "hangmanarea";

var GAMEWINDOW = document.getElementById(GAMEWINDOWDIV); // The div to display the game in

var ALPHABET_LENGTH = 26; // Length of the alphabet to use for the game
var ALPHABET_STARTVALUE_ASCII = 65; // ASCII code for uppercase A

var BUTTONS = []; // The array that will hold the buttons with each character displayed on them
var BUTTONROWS = 2;

var WORDS = ["hallo welt", "baum", "laptop", "ferNseHER", "simpsons"];
var CURRENTWORD = "";
var CURRENTGUESS = []; // Array of table cells which hold a single character each, display purposes only

var HANGMANSTATE = 0;
var GAMESTATE = 1; // 0 = lost, 1 = running, 2 = won, 3 = ended

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

// TODO: comment
// Returns the current occurencies of a char in a word
function findCharacterInWord(character, word)
{
	var charPositions = [];
	
	for(var i=0; i < word.length; i++)
	{
		// alternative: indexOf-Method
		// http://www.w3schools.com/jsref/jsref_indexof.asp
		// But this method is easier, might be slower:
		if(word[i] == character)
			charPositions.push(i);
	}
	
	return charPositions;
}

function getWord(wordArray)
{
	if(wordArray.length > 0)
	{
		// calculate a random number and multiplay it by the
		// length of available words. note that random does never
		// return a value larger than 0.99, so no +1 or -1 is needed,
		// because the index can never reach more than the length of
		// the words array due to the floor, and 0 is a perfectly fine
		// value when dealing with arrays.
		// http://www.w3schools.com/jsref/jsref_random.asp
		var index = Math.floor((Math.random() * wordArray.length));
	
		return wordArray[index];
	}
	else
		alert("Could not select a word from the array, because the array given is empty!")
}

function renderNewWord(word, divToRender)
{
	var realDiv = document.getElementById(divToRender);
	
	if(realDiv != null)
	{
		CURRENTWORD = word.toUpperCase();
		
		var wordTable = document.createElement("table");
		var wordTableRow = document.createElement("tr");
		
		wordTable.className = "guessrendertable";
		wordTableRow.className = "guessrenderrow";
		
		for(var i=0; i < CURRENTWORD.length; i++)
		{
			var currentCharCell = document.createElement("td");
			
			currentCharCell.className = "guessrendercell";
			
			if(CURRENTWORD[i]!=' ')
				currentCharCell.innerHTML = "_";
			else
				currentCharCell.innerHTML = " ";
			
			CURRENTGUESS.push(currentCharCell);
			
			wordTableRow.appendChild(currentCharCell);
		}
		
		wordTable.appendChild(wordTableRow);
		realDiv.appendChild(wordTable);
		
		if(DEBUGMODE == 1)
			console.log(CURRENTWORD);
	}
	else
		alert("The div, given for rendering the word in, doesn't exist in the document!\nDiv given: "+divToRender);
}

function checkGameState()
{
	if(HANGMANSTATE>5)
	{
		alert("You lost!");
		GAMESTATE = 0;
	}
	else
	{
		for(var i=0; i < CURRENTGUESS.length; i++)
		{
			if(CURRENTGUESS[i].innerHTML == "_")
				return;
		}
		
		alert("You won!");
		GAMESTATE = 2;
	}
}

function buttonPressedHandler(mouseClickEvent)
{
	if(GAMESTATE == 1)
	{
		var clickedButton = mouseClickEvent.target;
		var clickedChar = clickedButton.value;
		var characterPositions = findCharacterInWord(clickedChar, CURRENTWORD);
	
		if(DEBUGMODE == 1)
			alert(characterPositions);
	
		if(characterPositions.length > 0)
		{
			for(var i=0; i < characterPositions.length; i++)
			{
				CURRENTGUESS[characterPositions[i]].innerHTML = clickedChar;
			}
		}
		else
			HANGMANSTATE++;
	
		clickedButton.disabled = true;
	
		checkGameState();
	}
}

if(GAMEWINDOW != null)
{
	BUTTONS = createButtonArray();
	
	renderButtonsFromArray(BUTTONS, BUTTONAREADIV);
	renderNewWord(getWord(WORDS), GUESSAREADIV);
}
else
{
	alert("Could not initialize the gamewindow div!");
}