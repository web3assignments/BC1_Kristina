//0xA132f8c49bB12a7291dbAbcc85067657092b6e14
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from "web3";
import CatContract from './contracts/SchrodingersCat.json';

function App() {
  var web3 = new Web3('https://mainnet.infura.io');
  const [boxId, setBoxId] = useState("");
  const [SchrodingersCat, setSchrodingersCat] = useState();
  const [account0, setAccount0] = useState();
  const [image, setImage] = useState("./closed.jpg");

  web3 = new Web3(window.ethereum);
  const imgs =  new Map();
  imgs.set(0, "./closed.jpg");
  imgs.set(1, "./full.jpg")
  imgs.set(2, "./empty.jpg")


  useEffect(() => {
    smth();
  }, []);
  
  async function smth() {
    await window.ethereum.enable();
    setSchrodingersCat(new web3.eth.Contract(CatContract.abi, "0xA132f8c49bB12a7291dbAbcc85067657092b6e14"));
    const currentAddress = await web3.eth.getAccounts();
    setAccount0(currentAddress[0]);
    console.log(`Acc: ${account0}`);
  }

  async function create(){
    var box = await SchrodingersCat.methods
      .createBox()
      .send({from: account0, gas: 3000000, value: 0});
    var boxId =   box.events.Created.returnValues.id;
    console.log(boxId)
    setBoxId(boxId);
  }

  async function open(){
    console.log(`BoxId: ${boxId}`)
    console.log(`Acc: ${account0}`);
    var opened = await SchrodingersCat.methods
          .openBox(boxId)
          .send({'from': account0, 'gas': 3000000, 'value': 10});
    const alive = opened.events.Observed.returnValues.is_alive;
    console.log(alive);
    setImage(imgs.get(alive ? 1: 2))
  }

  function reload(){
    setImage(imgs.get(0))
    setBoxId("")
  }

  return (
    <div className="card">
        
        <div className="card-body">
            <img className="card-img-top" src={image} alt="Card image cap"/>
            <div className="form-group">
              <label for="boxId">Number of the box:</label>
              <input id="boxId" type="number" className="form-control" value={boxId} onChange={(e) => setBoxId(e.target.value)}  aria-describedby="emailHelp" ></input>
              <small id="emailHelp" className="form-text text-muted">Enter the code of unopened box or click create to obtain new code.</small>
            </div>
            <button className="btn btn-primary mr-2" title="Create a box." onClick={() => create()}>Create</button>
            <button className={`btn btn-primary mr-2 ${(boxId == "") ? "disabled": "hello"}`} onClick={() => open()}>Open</button>
            <button className="btn btn-primary" onClick={() => reload()}>Next</button>
        </div>
    </div>
  );
}

export default App;
