pragma solidity >=0.5.11;
/*
* GP: Some improvements
**/
contract SchrodingersCat {

    MyIterpritation public inter;
    enum MyIterpritation { Copenhagen, Consistent, Ensemble, Relational, Transactional, Zeno_effects, Objective_collapse}
    enum CatState {Superposition, Alive, Dead}
    enum BoxState {Open, Closed}

    struct Box {
        CatState cat_state; // How do I default this?
        BoxState box_state;
    }
    Box public myBox =  Box( CatState.Superposition, BoxState.Closed ); // GP: initialize

    // Why is MyIterpritation int?
    function setInterpritation(MyIterpritation _inter) public { inter = _inter; }

    function get() public pure returns (CatState) {
        return CatState.Superposition;
    }

    modifier openBox() { // GP: not most logical to use a modifier for this, could be function
        myBox.box_state = BoxState.Open;
        if(inter == MyIterpritation.Copenhagen){
            if(bool (getRandom()%2 == 0)){
                myBox.cat_state = CatState.Alive;
            } else{
                myBox.cat_state = CatState.Dead;
            }
        }
        // TODO handle all other interpritations
        _;
    }

    function catIsAlive() public openBox   returns(CatState){  // GP: added modifier here
        return myBox.cat_state; //Why does it return 0?
    }

    function getRandom() public view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.coinbase, block.timestamp)));
    }
}
