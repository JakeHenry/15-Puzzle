/**
 * 
 */

var emptyCellInnerHtml = null; // blank space
var idArray = []; // array containing cell ids

function createGame() {
	// Function will build a table, assign ids to each
	// cell in the table, push each cell id into an array
	// for later use, and fill the cells with text values.
	var text = '<table class="center">';
	var id = null;
	var body = document.getElementsByTagName('body')[0];
	for (var line = 0; line < 4; line++) {
		text += '<tr>';
		for (var col = 0; col < 4; col++) {
			id = 'id' + line + col;
			text += '<td id="' + id + '" ';
			text += 'class="cell" onClick = "trySwap(' + line + ',' + col
					+ ');">';
			text += '</td>';
			idArray.push(id);
		}
		text += '</tr>';
	}
	text += '</table>';
	body.insertAdjacentHTML('afterend', text);

	fillCells();

	emptyCellInnerHtml = document.getElementById('id33').innerHTML;
}

function fillCells() {
	// Function is used to initialize the table with text values.
	// It is also used to reset the game to the solved state
	// when the reset button is pressed.

	// For each cell in the table excluding the last one, fill it with
	// the (i+1)'th integer. (1-15).
	for (var i = 0; i < idArray.length - 1; i++) {
		document.getElementById(idArray[i]).innerHTML = i + 1;

		// If the current cell being examined has no border,
		// give it a border. (will only happen when the reset button
		// is used because the empty cell may have moved from the bottom right)
		if (document.getElementById(idArray[i]).style.border == "0px ridge black") {
			document.getElementById(idArray[i]).style.border = "7px ridge black";
		}
	}
	// Set the botton right cell of the table to be empty with no border
	document.getElementById('id33').innerHTML = " ";
	document.getElementById('id33').style.border = "0px ridge black";
}

function trySwap(line, col) {
	// Function will try to swap the clicked cell with the empty cell
	// if and only if the empty cell is touching the clicked cell on
	// one of its four sides and the clicked cell was not the empty cell.
	// If a swap successfully happens, it will check if the game has been
	// won or is unsolvable.

	// variables
	var minLineColVal = 0;
	var maxLineColVal = 3;
	var swapped = false;
	var clickedId = 'id' + line + col;
	var cellAboveId = 'id' + (line - 1) + col;
	var cellBelowId = 'id' + (line + 1) + col;
	var cellLeftId = 'id' + line + (col - 1);
	var cellRightId = 'id' + line + (col + 1);

	// Only do these operations if the cell that was clicked wasn't the empty
	// cell.
	if (document.getElementById(clickedId).innerHTML != emptyCellInnerHtml) {
		// Check and swap the cell above the clicked cell only if there is one
		// above.
		if (line - 1 >= minLineColVal) {
			swapped = testAndSwap(clickedId, cellAboveId);
		}
		// Check and swap the cell to the left of the clicked cell only
		// if there is one to the left and a swap hasn't already occurred.
		if (col - 1 >= minLineColVal && !swapped) {
			swapped = testAndSwap(clickedId, cellLeftId);
		}
		// Check and swap the cell to the right of the clicked cell only
		// if there is one to the right and a swap hasn't already occurred.
		if (col + 1 <= maxLineColVal && !swapped) {
			swapped = testAndSwap(clickedId, cellRightId);
		}
		// Check and swap the cell below the clicked cell only
		// if there is one below and a swap hasn't already occurred.
		if (line + 1 <= maxLineColVal && !swapped) {
			swapped = testAndSwap(clickedId, cellBelowId);
		}
		// If a swap has taken place, check if the player has won or
		// stumbled upon an unsolvable scenario.
		if (swapped) {
			checkGameStatus();
		}
	}
}

function testAndSwap(id1, id2) {
	// Function will test if either cell is the empty cell.
	// If it is, it will swap their innerHTMLs and their border styles
	// and return true. Otherwise, it will return false.
	if (document.getElementById(id1).innerHTML == emptyCellInnerHtml
			|| document.getElementById(id2).innerHTML == emptyCellInnerHtml) {

		swap(id1, id2);
		// swap borders with the empty cell
		var tempBorder = document.getElementById(id1).style.border;
		document.getElementById(id1).style.border = document
				.getElementById(id2).style.border;
		document.getElementById(id2).style.border = tempBorder;
		return true;
	} else {
		return false;
	}
}

function swap(id1, id2) {
	// Function will swap two given cells' innerHtmls.
	var temp = document.getElementById(id1).innerHTML;
	document.getElementById(id1).innerHTML = document.getElementById(id2).innerHTML;
	document.getElementById(id2).innerHTML = temp;
}

function scramble() {
	// Function will scramble the table.
	// Swap each cell in the table with another random cell.
	for (var i = 0; i < idArray.length; i++) {
		var rand = Math.floor(Math.random() * idArray.length);

		// Call testAndSwap(); to test if either cell is the empty cell.
		// If one is, their innerHTMLs AND cell borders will be swapped and it
		// will return true. If neither cell was the empty cell, it will return
		// false indicating that only a swap of the innerHTMLs is necessary.
		if (!testAndSwap(idArray[i], idArray[rand])) {
			swap(idArray[i], idArray[rand]);
		}
	}
}

function checkGameStatus() {
	// Function will check to see if the player has won
	// or if the game is unsolvable. If either is true,
	// it will alert the player.
	var correctVal = true;
	var unSolvable = false;
	var index = 0;
	var bottomRow1stIndex = 12; // index in the 'idArray' for bottom row 1st
	// cell id
	var bottomRow2ndIndex = 13; // index in the 'idArray' for bottom row 2nd
	// cell id
	var bottomRow3rdIndex = 14; // index in the 'idArray' for bottom row 3rd
	// cell id

	// Loop through the cells and test if each value is correct.
	// If it isn't correct, then set correctVal to false and the loop
	// will stop. If and only if the loop makes it through all the cells without
	// encountering an incorrect value, the player will win. If the loop makes
	// it to the last row of the table and encounters an incorrect value, it
	// will check
	// to see if it is the criteria for an unsolvable game.
	while (correctVal && index < idArray.length - 1) {
		if (document.getElementById(idArray[index]).innerHTML != index + 1) {
			correctVal = false;
		}
		if (index >= bottomRow1stIndex && !correctVal) {
			if (index == bottomRow1stIndex) {
				if (document.getElementById(idArray[bottomRow1stIndex]).innerHTML == " ") {
					if (document.getElementById(idArray[bottomRow2ndIndex]).innerHTML == 13
							&& document
									.getElementById(idArray[bottomRow3rdIndex]).innerHTML == 15) {
						// blank 13 15 14
						unSolvable = true;
					}
				}
			} else {
				if (document.getElementById(idArray[bottomRow2ndIndex]).innerHTML == 15) {
					// 13 15 14 blank
					unSolvable = true;
				} else if (document.getElementById(idArray[bottomRow3rdIndex]).innerHTML == 15) {
					// 13 blank 15 14
					unSolvable = true;
				}
			}
		}
		index++;
	}
	// alert user
	if (correctVal) {
		alert("You win!");
	} else if (unSolvable) {
		alert("Game is Unsolvable!");
	}
}