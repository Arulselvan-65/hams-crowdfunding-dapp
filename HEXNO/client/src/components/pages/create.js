import { useState } from 'react';
import axios from 'axios';
import { ethers } from "ethers";
import { SpinnerDotted } from "spinners-react";
import exit from '../Images/exit.png';
import upload from "../Images/upload.png";
import exit1 from '../Images/exit1.png';
import "../CssFiles/create.css";

const crowdFundContract = require("../CrowdFund.json");
const ABI = crowdFundContract.abi;
const contractAddress = require('../crowdFundAddress.json');

const Create = () => {
    const [file, setFile] = useState(null);
    const [projectFile, setProjectFile] = useState(null);
    const [createNftOpen, setCreateNftOpen] = useState(false);
    const [requiredSpin, setRequiredSpin] = useState(false);
    const [URIs, setURIs] = useState([]);
    const [IMGs,setIMGs] = useState([]);


    const clearFile = () => { setFile('') }

    const handleFileChange = (e) => {
        let file = e.target.files[0];
        if (file) setFile(file);
    }
    const handleProjectFileChange = (e) => {
        let file = e.target.files[0];
        console.log(file);
        if (file) setProjectFile(file);
    }

    const generateCID = async () => {
        const name = document.querySelector('.nft-name').value;
        const description = document.querySelector('.nft-description').value;
        const trait1 = document.querySelector('.trait1').value;
        const value1 = document.querySelector('.value1').value;
        const trait2 = document.querySelector('.trait2').value;
        const value2 = document.querySelector('.value2').value;

        if (file === null || file==="") {
            window.alert("Upload Image!!");
        }
        if (name === "" || description === "" || trait1 === "" || value1 === "" || trait2 === "" || value2 === "") {
            window.alert("Fill all the Fields!!");
        }
        else {
            let attributes = [
                { trait_type: trait1, value: value1 },
                { trait_type: trait2, value: value2 }
            ]
            let imgHash;
            let jsonHash

            const keys = await axios.get("http://localhost:3002/api/credentials");

            const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
            let data = new FormData();
            data.append('file', file);
            setRequiredSpin(true);
            await axios.post(url, data, {
                headers: {
                    'Content-Type': `multipart/form-data; boundary= ${data._boundary}`,
                    'pinata_api_key': keys.data.pinataApiKey,
                    'pinata_secret_api_key': keys.data.pinataSecretApiKey
                }
            }
            ).then(async (response) => {
                imgHash = response.data.IpfsHash;
            }).catch(function (error) {
                console.log(error);
            });

            const urlToJSON = `https://api.pinata.cloud/pinning/pinJsonToIPFS`;

            let Data = {
                name: name,
                description: description,
                image: `ipfs://${imgHash}`,
                attributes: attributes
            }
            let jsonData = JSON.stringify(Data);

            await axios.post(urlToJSON, jsonData, {
                headers: {
                    'Content-Type': `application/json; boundary= ${jsonData._boundary}`,
                    'pinata_api_key': keys.data.pinataApiKey,
                    'pinata_secret_api_key': keys.data.pinataSecretApiKey
                }
            }
            ).then(function (response) {
                jsonHash = response.data.IpfsHash;
            }).catch((E) => {
                console.log("Error : ", E);
            });
            setRequiredSpin(false);
            let btn = document.querySelector('.create-btn');
                btn.innerHTML = "Created!!";
                btn.style.backgroundColor = "#9bd3ef";
                document.querySelector('.create-btn').disabled = true;  
            
            let arr = URIs;
            arr.push(jsonHash);
            setURIs(arr);

            let ar = IMGs;
            ar.push(imgHash);
            setIMGs(ar)

            if(arr.length === 1){
                let btn = document.querySelector('.create-btn1');
                btn.innerHTML = "Created!!";
                btn.style.backgroundColor = "#9bd3ef";
                document.querySelector('.create-btn1').disabled = true;                
            }
            if(arr.length === 2){
                let btn = document.querySelector('.create-btn2');
                btn.innerHTML = "Created!!";
                btn.style.backgroundColor = "#9bd3ef"
                document.querySelector('.create-btn2').disabled = true;
            }
           if(arr.length === 3){
                
                let btn = document.querySelector('.create-btn3');
                btn.innerHTML = "Created!!";
                btn.style.backgroundColor = "#9bd3ef"
                document.querySelector(".create-btn3").disabled = true;
           }
        }
    }

    const sendDetails = async (projectId) => {
        const smallDescription = document.querySelector(".small-des").value;
        const fullDescription = document.querySelector(".full-des").value;

        if(URIs.length === 3){
            if (smallDescription === "" || fullDescription === "") {
                window.alert("Fill the Descriptions!!");
            } else {
                await axios.post("http://localhost:3002/submit", {
                    projectId: projectId,
                    smallDescription: smallDescription,
                    fullDescription: fullDescription,
                    uris: URIs,
                    imgs: IMGs,
                });
            }
        }
        else{
            window.alert("Create all the Nfts!!");
        }
    };

    async function createProject() {
        const title = document.querySelector(".title").value;
        const value = document.querySelector(".value").value;
        const min_contribution = document.querySelector(".minimum-contribution").value;
        const recipient_address = document.querySelector(".recipient-address").value;
        const end_date = document.querySelector('.end-date').value;
        const estimate_return = document.querySelector('.estimated-date').value;

        var difference = Math.abs(new Date(estimate_return).getTime() - new Date(end_date).getTime());

        var daysDifference = Math.ceil(difference / (1000 * 3600 * 24));

        console.log("Number of days between the two dates:", daysDifference);


        // if (title === "" || value === "" || min_contribution === "" || recipient_address === "") {
        //     window.alert("Fill all the fileds!!!!");
        // } else {
        //     if (value < 1) {
        //         alert(`Value should be atleast 1 ETH.`);
        //     }
        //     if ((recipient_address.length - 2) < 40) {
        //         alert(`Invalid Recipient Address!!!`);
        //     }
        //     else {
        //         try {
        //             const provider = new ethers.BrowserProvider(window.ethereum);
        //             const signer = await provider.getSigner();
        //             const contract = new ethers.Contract(`${contractAddress.address}`, ABI, signer);
        //             const tx = await contract.createProject(title, value, min_contribution, recipient_address);
        //             setRequiredSpin(true);
        //             await tx.wait().then(async () => {
        //                 if (tx) {
        //                     let projectId = await contract.getProjectId();
        //                     sendDetails(projectId.toString());
        //                     setRequiredSpin(false);
        //                 }
        //             });
        //         } catch (e) {
        //             window.alert("Confirm Creating a Project!!");
        //         }
        //     }
        // }
    }

    return (
        <div className='create'>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
                {requiredSpin && (<div className='spin-div'> <SpinnerDotted style={{ color: "#009deb" }} size={150} /></div>)}
            </div>
            <div className="project-create-Modal">
                <div className="data-collection-box">
                    <h1 style={{ textAlign: "center", marginBottom: "13px",fontSize: "40px" }}>
                        Create Project </h1>
                    <h3 style={{ marginTop: "15px" }}> Project Data </h3>
                    <div className="hash-divider"></div>
                    <div style={
                        {
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 190px)",
                            justifyContent: "start",
                            gap: "150px",
                        }
                    }>
                        <div>
                            <label htmlFor="title" > Title: </label>
                            <input type="text" name="title" placeholder="Title" className="title" style={{ marginTop: "10px" }} />
                        </div>
                        <div>
                            <label htmlFor="value" > Value: </label>
                            <input type="text" name="value" placeholder="Value" className="value" style={{ marginTop: "10px" }} />
                        </div>

                        <div>
                            <label htmlFor="min-value" > Minimum Contribution: </label>
                            <input type="text" name="min-value" placeholder="Minimum Contribution" className="minimum-contribution" style={{ marginTop: "10px" }} />
                        </div>

                        <div>
                            <label htmlFor="recipient-address" > Recipient Address </label>
                            <input type="text" name="recipient-address" placeholder="Recipient Address" className="recipient-address" style={{ marginTop: "10px", width: "270px" }} />
                        </div>
                    </div>

                    <h3 style={{ marginTop: "15px" }}> NFTs </h3>

                    <div className="hash-divider" > </div>
                    <div style={
                        {
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 190px)",
                            justifyContent: "start",
                            gap: "150px",
                        }
                    }>
                        <div>
                            <label htmlFor="image1URI"> NFT for Pack1 : </label>
                            <button className="create-btn1" onClick={() => setCreateNftOpen(true)}><p>Create</p></button>
                        </div>
                        <div>
                            <label htmlFor="image2URI"> NFT for Pack2 : </label>
                            <button className="create-btn2" onClick={() => setCreateNftOpen(true)}><p>Create</p></button>
                        </div>
                        <div>
                            <label htmlFor="image3URI"> NFT for Pack3 : </label>
                            <button className="create-btn3" onClick={() => setCreateNftOpen(true)}><p>Create</p></button>
                        </div>
                    </div>

                    <h3 style={{ marginTop: "15px" }}> Description </h3>
                    <div className="hash-divider"></div>
                    <div style={{ display: "flex", justifyContent: "start", gap: "110px", }}>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="smallDescription" > Description: </label>
                            <textarea spellCheck={false} className="small-des"></textarea>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="fullDescription" > Detailed Description: </label>
                            <textarea spellCheck={false} style={{ width: "610px" }} className="full-des"></textarea>
                        </div>
                    </div>

                    <h3 style={{ marginTop: "8px" }}> Project Details </h3>
                    <div className="hash-divider"></div>
                    <div style={
                        {
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 190px)",
                            justifyContent: "start",
                            gap: "150px",
                        }
                    }>
                        <div>
                            <label htmlFor="end-date" > Funding End Date: </label>
                            <input type="date" name="end-date" className="end-date" style={{ marginTop: "10px",cursor: "pointer" }} />
                        </div>
                        <div style={{width: "200px"}}>
                            <label htmlFor="estimated-date" > Estimated Reward Delivery: </label>
                            <input type="date" name="estimated-date" className="estimated-date" style={{ marginTop: "10px",cursor: "pointer" }} />
                        </div>
                        <div>
                            <label htmlFor="image3URI"> Picture related to Project : </label>
                            <label className="custom-file-uploa" >
                                <input type="file" accept="image/*" className="file-input" onChange={(e) => handleProjectFileChange(e)}/>
                                {projectFile ? 
                                <p className='custom-file-upload'>Uploaded !!</p>
                                :
                                <p className='custom-file-upload'>Upload Image</p>
                                }
                            </label>
                        </div>
                    </div>
                    <button onClick={createProject} className='create-project-button'> Create Project</button>
                </div>
            </div>


            {createNftOpen &&
                <div className="overall-div">
                    <div className='nft-create-div'>
                        <div style={{ height: "70px", color: "white", paddingTop: "25px" }}>
                            <h1 style={{ textAlign: "center" }}>Create NFT</h1>
                        </div>
                        <div className='exit-btn'>
                            <img src={exit} style={{ height: "100%", objectFit: "cover" }} onClick={() => { setCreateNftOpen(false); setFile(''); }} />
                        </div>

                        <div className='nft-main-div'>
                            <div>
                            <div className='nft-image-upload'>
                                {file ?
                                    <>
                                        <div style={{ position: "absolute", top: 0, zIndex: 40, right: 0 }}>
                                            <img src={exit1} width="100%" style={{ cursor: "pointer", borderRadius: "50%", objectFit: 'cover' }} onClick={clearFile} />
                                        </div>
                                        <img src={file ? URL.createObjectURL(file) : ''} width="100%" height="100%" style={{ objectFit: "cover", borderRadius: "8px" }}></img>
                                    </>
                                    :
                                    <label className="custom-file-upload1" >
                                        <input type="file" accept="image/*" className="file-input" onChange={(e) => handleFileChange(e)} />
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <img id="upload-img" src={upload} alt="upload" style={{ objectFit: "cover", height: "60px", width: "50px", marginBottom: "7px",userSelect: "none" }}></img>
                                            <p style={{userSelect: "none"}}>Upload Image</p>
                                        </div>
                                    </label>
                                }
                            </div>
                                <div className='nft-detail'>
                                    <label htmlFor='nft-title' className='lable' style={{textAlign: "center"}}>Name</label>
                                    <input className='nft-name'></input>
                                </div>
                            </div>

                            <div className='nft-detail-div'>
                                <label htmlFor='nft-des' className='lable'>Description</label>
                                <input className='nft-description'></input>
                                <label className='lable'>Value</label>
                                <input className='nft-description'></input>
                                <label className='lable'>Quantity</label>
                                <input className='nft-description'></input>
                                <label className='lable'>Rewards</label>
                                <textarea spellCheck={false} style={{ width: "400px" }} className="rewards"></textarea>
                                <button className='create-btn' onClick={generateCID}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )

}


export default Create;