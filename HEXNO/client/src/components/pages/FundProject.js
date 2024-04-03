import { useState } from "react";
const FundProject = () => {

    const [modals, setModals] = useState("");
    const [buttonind, setButtonind] = useState("");
    const [loading, setLoading] = useState(false);
    const [transactionHash, setTransactionHash] = useState("");
    const [currToken, setCurrToken] = useState("");
    const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

    const openPaymentDialog = (ind) => {
        setButtonind(ind);
        setIsPaymentDialogOpen(true);
    };
    const closePaymentDialog = () => {
        setIsPaymentDialogOpen(false);
        setButtonind("");
        setTransactionHash("");
        setLoading(false);
    };


    async function contribute(ind) {
        console.log(ind);
        const provider = new ethers.BrowserProvider(window.ethereum);
        const total = parseInt(ind.value);
        const min = parseInt(ind.minimumContribution / 10 ** 18);
        const Name = document.querySelector(".ContributorName");
        const Val = document.querySelector(".Contribution");
        let cid = "";
        let option = 0;

        const amt = parseFloat(Val.value);
        if (Name.value === "" || amt === "") {
            window.alert("Fill all the fileds!!!!");
        }
        if (typeof amt !== "number" || typeof total !== "number" || amt === 0) {
            window.alert("Invalid Input!!!");
        }
        if (min > Val) {
            window.alert("Should pay atleast MinimumContribution Value!!!");
        } else {
            const percentage = (amt / total) * 100;

            let p = percentage.toFixed(2);

            console.log(p);
            console.log(total);
            console.log(amt);
            if (amt == total) {
                cid = ind.uri3;
                option = 1;
                setCurrToken("✓ NFT Minted!");
            } else {
                if (p >= 10 && p <= 25) {
                    cid = ind.uri1;
                    option = 1;
                    setCurrToken("✓ NFT Minted!");
                } else if (p > 25 && p <= 50) {
                    cid = ind.uri2;
                    option = 1;
                    setCurrToken("✓ NFT Minted!");
                } else if (p > 50) {
                    cid = ind.uri3;
                    option = 1;
                    setCurrToken("✓ NFT Minted!");
                } else {
                    option = 0;
                    setCurrToken("✓ ERC-20 Minted!");
                }
            }

            try {
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(
                    `${contAddr.address}`,
                    ABI,
                    signer
                );
                const tx = await contract.contribute(
                    parseInt(ind.id),
                    Name.value,
                    cid.toString(),
                    option, {
                    value: ethers.parseEther(`${amt}`)
                }
                );
                const txHash = tx.hash;
                setLoading(true);
                setTransactionHash(txHash);
                await tx.wait();
                getProjects();
            } catch (e) {
                console.log("Error : ", e);
            } finally {
                setLoading(false);
            }
        }
    }

    return (
        <div>
                <div className="data-collection-box-1" >
                    <h1 style={{ textAlign: "center", marginBottom: "13px" }}>
                        Payment </h1>

                    <div className='close-btn'>
                        <img src={exit} style={{ height: "100%", objectFit: "cover" }} onClick={closePaymentDialog} />
                    </div>

                    <label style={{ marginTop: "20px" }}> Name: </label>

                    <input type="text" name="image1URI" placeholder="Name" className="ContributorName"
                        style={{ marginTop: "1px" }} />

                    <label style={{ marginTop: "20px" }}> Value: </label>
                    <input type="text" name="image1URI" placeholder="Value" className="Contribution"
                        style={{ marginTop: "1px" }} />

                    {loading ? (
                        <h5 style={{ fontSize: "20px", textAlign: "center" }}>
                            Minting Token...
                        </h5>)
                        :
                        transactionHash ? (
                            <>
                                <h5 style={
                                    {
                                        fontSize: "20px",
                                        color: "#5aa75a",
                                        fontFamily: "arial",
                                        textAlign: "center",
                                    }
                                }>
                                    {currToken}
                                </h5>
                            </>)
                            :
                            (<button className="button" onClick={() => contribute(buttonind)}> Fund Now </button>)
                    }

                    {transactionHash && (
                        <p style={{ textAlign: "center" }}>
                            <a href={`https://sepolia.etherscan.io/tx/${transactionHash}`} target="_blank"
                                style={{ color: "grey", fontFamily: "monospace" }}>
                                view on etherscan
                            </a>
                        </p>
                    )
                    }
                </div>
        </div>
    )
}


export default FundProject;