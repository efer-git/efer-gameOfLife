function Cell(initialState) {
    //this._type = Math.floor(Math.random()*CLASSNUM)+1;
    this.isAlive = initialState;
    this.willBeAlive = false;
}

Cell.prototype.computeNextState = function(aliveNeighborsCount) {
    if(aliveNeighborsCount.count == 3){
        this.willBeAlive = true;
        this._type = aliveNeighborsCount.next_type;
    } else if(aliveNeighborsCount.count > 3 || aliveNeighborsCount.count < 2) {
        this.willBeAlive = false;
        delete this._type;
        //this._type = 0;
    } else {
        this.willBeAlive = this.isAlive;
        this._type = aliveNeighborsCount.next_type;
    }

    //return this.willBeAlive;
    return this;
};

Cell.prototype.nextState = function(){
    this.isAlive = this.willBeAlive;
}