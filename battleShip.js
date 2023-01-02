// VIEW 
var view = {
    displayMessage: function (msg) {
        var messageArea = document.getElementById("messageArea")
        messageArea.innerHTML = msg
    },

    displayHit: function (location) {
        var cell = document.getElementById(location)
        cell.setAttribute("class", "hit")
    },

    displayMiss: function (location) {
        var cell = document.getElementById(location)
        cell.setAttribute("class", "miss")
    }
}

// MODEL
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipSunk: 0,

    ships: [
        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },

        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        },

        {
            locations: [0, 0, 0],
            hits: ["", "", ""]
        }
    ],

    fire: function (guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i]
            var index = ship.locations.indexOf(guess)
            if (index >= 0) {
                ship.hits[index] = "hit"
                view.displayHit(guess)
                view.displayMessage("HIT!")
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!")
                    this.shipSunk++
                }
                return true
            }
        }
        view.displayMiss(guess)
        view.displayMessage("You missed!")
        return false
    },

    isSunk: function (ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false
            }
        }
        return true
    },
    // Make random location ship and add to array ships
    generateShipLocations: function () {
        var locations
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip()
            } while (this.collision(locations)) {
                this.ships[i].locations = locations
            }
        }
    },
    // Make ships random direction vertical or horizontal on board
    generateShip: function () {
        var direction = Math.floor(Math.random() * 2)
        var row, column
        // direction = 1 is horizontal
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize)
            column = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        } else {
            // direction = 0 is vertical 
            column = Math.floor(Math.random() * this.boardSize)
            row = Math.floor(Math.random() * (this.boardSize - this.shipLength))
        }
        // Set direction to newShipLocations 
        var newShipLocations = []
        for (var i = 0; i < this.shipLength; i++) {
            // Direction = 1 set horizontal
            if (direction === 1) {
                newShipLocations.push(row + "" + (column + i))
            } else {
                newShipLocations.push((row + i) + "" + column)
            }
        }
        return newShipLocations
    },
    // Make sure that ships don't overlap
    collision: function (locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i]
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true
                }
            }
        }
        return false
    }
}

// CONTROLLER
var controller = {
    guesses: 0,

    processGuess: function (guess) {
        var location = parseGuess(guess)
        if (location) {
            this.processClick(location)
        }
    },

    processClick: function (locationId) {
        this.guesses++;
        var hit = model.fire(locationId)
        if (hit && model.shipSunk === model.numShips) {
            alert("You sank my battleship, in " + this.guesses + " guesses")
            location.reload()
        }
    }

}

// HELPER FUNCTION 

//Convert letter to number and concat to string 
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"]
    if (guess === null || guess.length !== 2) {
        view.displayMessage("Oops, please enter a valid value on the board!")
    } else {
        var firstChar = guess.charAt(0)
        var row = alphabet.indexOf(firstChar)
        var column = guess.charAt(1)
        if (isNaN(row) || isNaN(column)) {
            view.displayMessage("Oops, that isn't on the board")
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            view.displayMessage("Oops, that's off the board")
        } else {
            return row + column
        }
    }
    return null
}


//Event Handler Function 

function init() {

    var fireButton = document.getElementById("fireButton")
    fireButton.onclick = handleFireButton
    var guessInput = document.getElementById("guessInput")
    guessInput.onkeydown = handleKeyPress
    var cellId
    var cell
    for (var i = 0; i < 7; i++) {
        for (var j = 0; j < 7; j++) {
            cellId = "" + i + j
            cell = document.getElementById(cellId)
            cell.onclick = handleFireClick
        }
    }
    model.generateShipLocations()
}

function handleFireButton() {
    var guessInput = document.getElementById("guessInput")
    var guess = guessInput.value
    controller.processGuess(guess)
    guessInput.value = ""
}

function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton")
    if (e.keyCode === 13) {
        fireButton.click()
        return false
    }
}

function handleFireClick(e) {
    var fireClick = e.target
    if (fireClick !== null) {
        cellId = fireClick.id
        console.log(cellId)
        controller.processClick(cellId)
    }
}

view.displayMessage("Welcome to Battleship game! Type input or click on any square to start the game.")

window.onload = init






