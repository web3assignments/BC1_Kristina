import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from "web3";
import abi from './abi.json';

function App() {
  const [boxId, setBoxId] = useState("");
  const [SchrodingersCat, setSchrodingersCat] = useState();
  const [account0, setAccount0] = useState();
  const [image, setImage] = useState("./closed.jpg");
  
  var web3 = new Web3(window.ethereum);
  const imgs =  new Map();

  imgs.set(0, "./closed.jpg");
  imgs.set(1, "./full.jpg")
  imgs.set(2, "./empty.jpg")


  useEffect(() => {
    run();
  }, []);

  async function run() {
    await window.ethereum.enable();
    setSchrodingersCat(new web3.eth.Contract(abi, "0x69ad5b63d0Bb0A9f5C28E57a6Db9B7Dd6c509b2E"));
    setAccount0("0x4F0Bd406c78426e3beaF933B068f45606B29E286");
  }

  async function create(){
    var box = await SchrodingersCat.methods
      .createBox()
      .send({from: account0, gas: 3000000, value: 0});
    var boxId = box.events.Created.returnValues.id;
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
    setImage(imgs.get(alive ? 1: 2));
    console.log(`Acc: ${account0}`);
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
