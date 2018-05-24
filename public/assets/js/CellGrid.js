"use strict";
function genRCS(N){
    let RCS_state = []

    let f_row=[]
    if(N%2==1){
        f_row=[0];
        for(let i=0;i<N-1;i++){
            if(i%2==0) f_row.push(1);
            else f_row.push(-1);
        }
    }else{
        f_row=[0,1,0];
        for(let i=0;i<N-3;i++){
            if(i%2==0) f_row.push(-1);
            else f_row.push(1);
        }
    }

    RCS_state.push(f_row.slice())
    let A = f_row;

    for(let i=0;i<N-1;i++){
        A.unshift(A.pop());
        RCS_state.push(A.slice())
    }
    return RCS_state
}

function checkRCS(cell1,cell2){
    //console.log(cell1._type+" ",cell2._type)
    try{
        return rcs_state[cell1._type-1][cell2._type-1];
    }catch(e){ //when compare with dead cell
        return 1;
    }
}
const CLASSNUM = 5;
const rcs_state = genRCS(CLASSNUM);
const eat_first = 1;

// ISSUE
// 1. gray zone --> V
// 2. initial - type --> V
// 3. 
// 4. scalability issue
// 5. get stat --> V
// 6. functions
//    - put some dots
//    - change staus in server

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
            //cell._type = 0; //insert dummy type...?
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
    let self = this,
        neighbors = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

    function isAliveAt(i,j){
        if(i < 0 || i >= self.cells.length || j < 0 || j >= self.cells[0].length){
            return false;
        }
        return self.cells[i][j].isAlive;
    }
    //var count = 0;
    let w1 = []
    let w2 = []
    let cc = 0;
    for(let i = 0; i < neighbors.length; i++){
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
    let count = cc;
    let next_type;
    //var count = cc-w1.filter(function(a){return a==-1}).length;
    if(w1.includes(-1)==true){ //when this cell loses RCS
        //find max _type from -1
        let w_mu = w1.map(function(a,i){return a*(w2[i]);});
        let checker = _.countBy(w_mu.filter(function(a){return a<0;}));
        let max_v = Object.keys(checker)[Object.values(checker).indexOf(_.max(Object.values(checker)))];
        //let max_v = Object.keys(checker)[Object.values(checker).indicesOf(_.max(Object.values(checker)))[Math.floor(Math.random()*_.max(Object.values(checker)))]];
        // when tie --> first pops first
        // return randomly....
        //self.cells[x][y]._type =Math.abs(Number(max_v));
        next_type = Math.abs(Number(max_v));

    }else{ //when this cell win/draw RCS
        //let w_mu = w1.map(function(a,i){return a*(w2[i]);});
        let checker = _.countBy(w2.filter(function(a){return a>0;}));
        //let checker = _.countBy(w_mu.filter(function(a){return a>0;}));
        //drop 0
        let max_v = Object.keys(checker)[Object.values(checker).indexOf(_.max(Object.values(checker)))];
        //let max_v = Object.keys(checker)[Object.values(checker).indicesOf(_.max(Object.values(checker)))[Math.floor(Math.random()*_.max(Object.values(checker)))]];
        //console.log(checker)
        //self.cells[x][y]._type =Math.abs(Number(max_v));
        if(self.cells[x][y].isAlive==false){
            next_type = Math.abs(Number(max_v));
        }else{
            next_type = self.cells[x][y]._type;
        }

    }

    return {'count':count,'next_type':next_type};

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

CellGrid.prototype.getStatus = function(){
    //return matrix [wxh]
    let matix = [];
    this.eachCell(function(cell,x,y){
        if(cell._type==undefined){
            matix.push(0);
        }else{
            matix.push(cell._type)
        }
    })
    return matix;
};

CellGrid.prototype.aliveCells = function() {
    var alive = [];
    this.eachCell(function(cell){
        cell.isAlive && alive.push(cell);
    });
    return alive;
};

CellGrid.prototype.getRCS = function(){
    return rcs_state;
};




Array.prototype.indicesOf = function(x){
  return this.reduce((p,c,i) => c === x ? p.concat(i) : p ,[]);
};
