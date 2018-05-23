CLASSNUM =5;

function CellGrid(rows, columns) {
    this.cells = new Array(rows);
    var n = 0;
    for(var i = -1; ++i < rows;){
        this.cells[i] = new Array(columns);
        for(var j = -1; ++j < columns; ){
            var cell = new Cell(false);
            cell.n = n++;
            cell.x = i;
            cell.y = j;
            //cell._type = Math.floor(Math.random()*CLASSNUM)+1;
            this.cells[i][j] = cell;
        }
    }
}

CellGrid.prototype.aliveNeighborsFor = function(x, y) {
    var self = this,
        neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        //neighbors = [[-1,0],[1,0],[0,1],[0,-1]];
    function isAliveAt(i, j){
        if(i < 0 || i >= self.cells.length || j < 0 || j >= self.cells[0].length){
            return false;
        } //if dot is out of map...
        return self.cells[i][j].isAlive;
    }

    var count = 0;
    for(var i = 0; i < neighbors.length; i++){
        count += (isAliveAt(x+neighbors[i][0],y+neighbors[i][1]))?1:0;
    }

    return count;
};

CellGrid.prototype.aliveNeighborsFor_type = function(x,y){
    //const _ = require('lodash');
    var self = this,
        neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

    function isAliveAt(i,j){
        if(i < 0 || i >= self.cells.length || j < 0 || j >= self.cells[0].length){
            return false;
        }
        return self.cells[i][j].isAlive;
    }
    //var count = 0;
    var w1 = []
    var w2 = []
    var cc = 0;
    for(var i = 0; i < neighbors.length; i++){
        if(isAliveAt(x+neighbors[i][0],y+neighbors[i][1])){
            let tmp = checkRCS(self.cells[x][y],self.cells[x+neighbors[i][0]][y+neighbors[i][1]]);
            w1.push(tmp);
            w2.push(self.cells[x+neighbors[i][0]][y+neighbors[i][1]]._type)
            cc=cc+1;
        }else{
            continue;
        }
    }

    //var count = w2.filter(function(a){return a==self.cells[x][y]._type;}).length;
    //var count = cc;
    var count = cc-w1.filter(function(a){return a==-1}).length;
    if(w1.includes(-1)==true){
        //find max _type from -1
        let w_mu = w1.map(function(a,i){return a*(w2[i]);});
        let checker = _.countBy(w_mu.filter(function(a){return a<0;}));
        let max_v = Object.keys(checker)[Object.values(checker).indexOf(_.max(Object.values(checker)))];
        self.cells[x][y]._type =Math.abs(Number(max_v));
    }

    return count;

}

CellGrid.prototype.eachCell = function(callback){
    var rows = this.cells.length,
        columns = this.cells[0].length,
        x,y;
    for(var i = 0; i < rows * columns; i++){
        x = i%rows; y = Math.floor(i/rows);
        callback.apply(this,[this.cells[x][y],x,y]);
    }
};

CellGrid.prototype.reset = function(){
    this.eachCell(function(cell,x,y){
        cell.isAlive = (Math.random() > 0.5);
        //branch if cell is live / die
        if (cell.isAlive){
            cell._type = Math.floor(Math.random()*CLASSNUM)+1;
        }
    });
};

CellGrid.prototype.prepareStep = function() {
    this.eachCell(function(cell,x,y){
        //cell.computeNextState(this.aliveNeighborsFor(x,y));
        cell.computeNextState(this.aliveNeighborsFor_type(x,y));
    });
};

CellGrid.prototype.step = function() {
    this.prepareStep();
    this.eachCell(function(cell,x,y){
        cell.nextState();
    });
};

CellGrid.prototype.aliveCells = function() {
    var alive = [];
    this.eachCell(function(cell){
        cell.isAlive && alive.push(cell);
    });
    return alive;
};

