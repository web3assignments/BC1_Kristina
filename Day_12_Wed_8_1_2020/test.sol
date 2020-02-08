pragma solidity >=0.4.0 <0.6.0;
import "remix_tests.sol";
import "./testableCat.sol";

contract schrCatGeneralFlow {
  SchrodingersCat catContract;

  function beforeAll() public {
    catContract = new SchrodingersCat();
  }

  function createBox() public {
    uint boxId = catContract.createBox();
    Assert.equal(boxId, uint(1), "Error creating a box");
  }

  function checkBoxState() public {
    uint boxId = catContract.createBox();
    string memory boxState = catContract.getBoxState(boxId);
    Assert.equal(boxState, "Closed", "Box state has to be equal \"Closed\"");
  }

    function checkCatState() public {
    uint boxId = catContract.createBox();
    string memory catState = catContract.getCatState(boxId);
    Assert.equal(catState, "Superposition", "Cat state check has failed.");
  }

  function checkGetRandom() public {
    bool random = catContract.getRandom();
    Assert.equal(random || !random, true, "Rundom test failed.");
  }

  function checkCatIsAlive() public {
    uint boxId = catContract.createBox();
    bool alive = catContract.catIsAlive(boxId);
    Assert.equal(alive, false, "Cat shouldn't be alive at this stage.");
  }

  function compareStrings (string memory a, string memory b) public pure returns (bool) {
    return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))) );
  }

  function () external payable {}
}