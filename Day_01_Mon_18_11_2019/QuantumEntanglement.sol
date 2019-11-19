pragma solidity >=0.5.11;
/*
* Warning! This code compiles, but does not work properly.
**/
contract SchrodingersCat {

    MyIterpritation inter;
    enum MyIterpritation { Copenhagen, Consistent, Ensemble, Relational, Transactional, Zeno_effects, Objective_collapse}
    enum CatState {Superposition, Alive, Dead}
    enum BoxState {Open, Closed}

    struct Box {
        CatState cat_state; // How do I default this?
        BoxState box_state;
    }
    Box public myBox;

    // Why is MyIterpritation int?
    function setInterpritation(MyIterpritation _inter) public { inter = _inter; }

    function get() public pure returns (CatState) {
        return CatState.Superposition;
    }

    modifier openBox() {
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

    function catIsAlive() public view returns(CatState){
        return myBox.cat_state; //Why does it return 0?
    }

    function getRandom() private view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.coinbase, block.timestamp)));
    }
}