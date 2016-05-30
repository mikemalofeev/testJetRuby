window.onload = app;

function app() {
    var colors = ["black", "brown", "red", "yellow", "green", "blue", "grey", "violet"];
    var model = new Model(colors);
    var view = new View(model);
    var controller = new Controller(model, view);
    controller.init();
    console.log(model, view, controller);
}

function Model(colors) {
    this.colors = colors;
    this.n = this.colors.length * 2;
    this.tiles = [];
}

Model.prototype.fillTiles = function () {
    var tempArray = [];
    for (var i = 1; i <= this.n; i++) {
        tempArray.push(i);
        this.tiles.push({});
    }
    var id, colorsId;
    for (var i = 0; i < this.n; i++) {
        id = Math.floor(Math.random() * tempArray.length);
        this.tiles[i].id = tempArray[id];
        this.tiles[i].klass = "miss";
        colorsId = (i % 2 == 0) ? (i / 2) : (i - 1) / 2;
        this.tiles[i].color = this.colors[colorsId];
        tempArray.splice(id, 1);        
    }
}

Model.prototype.findId = function (id) {
    for (var i = 0; i < this.n; i++) {
        if (this.tiles[i].id == id) return i;
    }
    return false;
}

Model.prototype.setElemClass = function (id, klass) {
    this.tiles[id].klass = klass;
}

Model.prototype.checkColor = function (id, lastId) {
    if (this.tiles[id].color == this.tiles[lastId].color) return true;
    return false;
}

Model.prototype.isEnd = function () {
    for (var i = 0; i < this.n; i++) {
        if (this.tiles[i].klass == "miss") return false;
    }
    return true;
}

function View(model) {
    this.model = model;
    this.$board = document.querySelector('#board');
    this.$start = document.querySelector('#start');
    this.$round = document.querySelector("#round");
}

View.prototype.renderBoard = function () {
    for (var i = 0; i < this.model.n; i++) {
        this.renderTile(i);
    }  
}

View.prototype.renderTile = function (i) {
    var modelElem = this.model.tiles[i];
    var id = modelElem.id;
    var elem = document.getElementById(id);
    var klass = modelElem.klass;
    var color = modelElem.color;
    elem.className = klass;
    if (klass == "hit") {
        elem.style.backgroundColor = color;
    } else {
        elem.style.backgroundColor = "";
    }
}

View.prototype.renderRound = function (x) {
    this.$round.innerHTML = "Round number: " + x;
}

View.prototype.viewAlert = function (x) {
    alert("Game over.\n" + x + " rounds.");
}

function Controller(model, view) {
    this.model = model;
    this.view = view;
    this.elemId;
    this.lastElemId;
    this.roundNumber;
    this.newRound;
}

Controller.prototype.start = function () {
    this.roundNumber = 0;
    this.newRound = false;
    this.model.fillTiles();
    this.view.renderRound(this.roundNumber);
    this.view.renderBoard();
}

Controller.prototype.init = function () {
    this.start();
    this.view.$board.onclick = this.handleBoard.bind(this);
    this.view.$start.onclick = this.start.bind(this);
}

Controller.prototype.handleBoard = function (event) {
    event = event || window.event;
    var target = event.target || event.srcElement;
    if ((target.className == "hit") || (target.tagName != "TD")) return false;
    this.newRound = !this.newRound;    
    var id = parseInt(target.id);
    this.elemId = this.model.findId(id);
    this.model.setElemClass(this.elemId, "hit");
    this.view.renderBoard();
    if (this.newRound) {
        this.lastElemId = this.elemId;
        this.view.renderRound(++this.roundNumber);     
    } else { 
        if (this.model.checkColor(this.elemId, this.lastElemId)) {
            if (this.model.isEnd()) this.view.viewAlert(this.roundNumber); 
        } else {
            this.model.setElemClass(this.elemId, "miss");
            this.model.setElemClass(this.lastElemId, "miss");
            setTimeout(function () {
                this.view.renderBoard();              
            }.bind(this), 500);
        }        
    }
}

