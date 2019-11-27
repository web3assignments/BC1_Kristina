Web3 = require('web3');
web3 = new Web3('https://ropsten.infura.io');
const TestPlayAddress = "0xc01081B6f0b96f00923C2f5612643d084eC04880";
const TestCreate=[
    {
        "constant": false,
        "inputs": [],
        "name": "createBox",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

async function create(){
    const SchrodingersCat = new web3.eth.Contract(TestCreate, TestPlayAddress);
    var result = await SchrodingersCat.methods.createBox().call();
    //shouldn't return anything
    console.log(`Create: ${result.json}`);
}

const TestOpen=[   {
    "constant": false,
    "inputs": [],
    "name": "openBox",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  }
]

async function open(){
    const SchrodingersCat = new web3.eth.Contract(TestOpen, TestPlayAddress);
    var result = await SchrodingersCat.methods.openBox().call();
    //shouldn't return anything
    console.log(`Open: ${result.json}`);
}


const TestAlive=[
    {
      "constant": true,
      "inputs": [],
      "name": "catIsAlive",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
]
  
async function alive(){
    const SchrodingersCat = new web3.eth.Contract(TestAlive, TestPlayAddress);
    var result = await SchrodingersCat.methods.catIsAlive().call();
    //should return true or false
    console.log(`${result ? 'Congratulations! ' : 'I am sorry to inform you, that '}Schrodingers' Cat is ${result ? 'alive!' : 'dead...'}`);
}

create();
open();
alive();