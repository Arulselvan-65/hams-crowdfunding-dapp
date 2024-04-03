import React, { useState, useEffect } from 'react';
import '../CssFiles/CrowdFunding.css';
import exit from '../Images/exit.png';

function UserDetails() {
  // Define state for the user's name
  const [name, setName] = useState('');
  const [file, setFile] = useState('');

  // Load the saved name when the component mounts
  useEffect(() => {
    const savedName = sessionStorage.getItem('userName');
    if (savedName) {
      setName(savedName);
    }
  }, []);

  // Function to handle saving the name
  const saveName = () => {
    const inputName = document.getElementById('nameInput').value;
    if (inputName.trim() !== '') {
      setName(inputName);
      sessionStorage.setItem('userName', inputName);
    }
  };

  // Function to handle removing the name when window is closed
  useEffect(() => {
    const beforeUnloadHandler = (event) => {
      event.preventDefault();
      sessionStorage.removeItem('userName');
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);

    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  return (
    <div>
      {/* <div className='nft-create-div'>
        <div style={{ height: "70px", color: "white", paddingTop: "25px" }}>
          <h1 style={{ textAlign: "center" }}>Create NFT</h1>
        </div>
        <div className='exit-btn'>
            <img src={exit} style={{height: "100%", objectFit: "cover"}}/>
        </div>
        <div className='nft-main-div'>
          <div className='nft-image-upload'>
            {file ?
                    <>
                        <div style={{position: "absolute", top: 0, zIndex: 40,right: 0}}>
                            <img src={exit} height="20px" width="30px" style={{cursor:"pointer", backgroundColor: "white", borderRadius: "50%"}} onClick={clearFile} />
                        </div>
                        <img src={file ? URL.createObjectURL(file) : ''} className='object-cover max-h-[400px]'></img>
                    </>
                    :
                    <input type='file' onChange={(e) => handleFileChange(e)} className='absolute top-48 left-24'></input>
                }
          </div>

          <div className='nft-detail-div'>
            <label htmlFor='nft-title' className='lable' style={{marginTop: 0}}>Name</label>
            <input id='nft-name'></input>
            <label htmlFor='nft-des' className='lable'>Description</label>
            <input id='nft-des'></input>
            <label className='lable' style={{ marginTop: "20px", textAlign: "center" }}>Attributes</label>

            <div className='nft-attribute-div'>
              <div className='single-group'>
                <label htmlFor='nft-des' className='lable'>Trait Type</label>
                <input id='nft-des'></input>
              </div>
              <div className='single-group'>
                <label htmlFor='nft-des' className='lable'>Value</label>
                <input id='nft-des'></input>
              </div>
            </div>
            <div className='nft-attribute-div'>
              <div className='single-group'>
                <label htmlFor='nft-des' className='lable'>Trait Type</label>
                <input id='nft-des'></input>
              </div>
              <div className='single-group'>
                <label htmlFor='nft-des' className='lable'>Value</label>
                <input id='nft-des'></input>
              </div>
            </div>

            <button className='create-btn'>Create</button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default UserDetails;
