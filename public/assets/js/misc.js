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
