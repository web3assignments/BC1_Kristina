pragma solidity >=0.5.11;

/*
* This is the contract that imitates the Copenhagen interpretation of Schrodinger's Cat problem.
**/
contract SchrodingersCat {

    enum CatState {Superposition, Alive, Dead}
    enum BoxState {Open, Closed}

    struct Box {
        CatState cat_state;
        BoxState box_state;
    }

    /**
    * Initially the box is closed and the cat is in the superposition.
    */
    Box public myBox =  Box(CatState.Superposition, BoxState.Closed);

    /**
    * Checks whether the box is in the closed state.
    */
    modifier boxIsClosed() {
        require(myBox.box_state == BoxState.Closed, "Box has already been opened");
        _;
    }

    /**
    * Opens the box and observes the contents of the box.
    */
    function openBox () public boxIsClosed {
        myBox.box_state = BoxState.Open;
        getRandom() ? myBox.cat_state = CatState.Alive : myBox.cat_state = CatState.Dead;
    }

    /**
    * Returns True if the cat is alive, otherwise False.
    */
    function catIsAlive() public view returns(bool){
        return myBox.cat_state == CatState.Alive;
    }

    /**
    * Returns a random boolean.
    */
    function getRandom() private view returns(bool) {
        return bool(uint256(keccak256(abi.encodePacked(block.difficulty, block.coinbase, block.timestamp)))%2 == 0);
    }
}
