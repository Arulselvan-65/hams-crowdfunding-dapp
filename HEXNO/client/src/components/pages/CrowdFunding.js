import { React, useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../CssFiles/CrowdFunding.css";
import ar from "../Images/ar.jpg";
import ar1 from "../Images/ar1.jpg";
import ar2 from "../Images/ar2.jpg";
import create from "../Images/create.png";
import axios from "axios";
import { ethers } from "ethers";
import { SpinnerCircular } from "spinners-react";
import { Link } from "react-router-dom";

const s = require("../CrowdFund.json");
const ABI = s.abi;
const contAddr = require('../crowdFundAddress.json');

const CrowdFunding = ()=> {

  const [items, setitems] = useState([]);
  const [hasFinished, setHasFinished] = useState(false);
  const [roundSpin, setroundSpin] = useState(false);

  async function getProjects() {
    setroundSpin(true);
    const response = await axios.get("http://localhost:3002/submissions");
    const serverDetails = response.data;
    const provider = new ethers.JsonRpcProvider(
      "https://sepolia.infura.io/v3/1de2c1c15d0c444f995d92341fc47b1c"
    );
    const contract = new ethers.Contract(`${contAddr.address}`, ABI, provider);
    let n = await contract.getProjectId();
    n = parseInt(n);
    console.log("Overall size:", n);
    let l = [];

    for (let i = 1; i <= 1; i++) {
      try {
        if (serverDetails) {
          let d = serverDetails[i - 1];
          let s = await contract.projects(i);
          const data = {
            title: s[0],
            value: parseInt(s[1]) / 10 ** 18,
            collectedValue: parseInt(s[2]) / 10 ** 18,
            minimumContribution: parseInt(s[3]) / 10 ** 18,
            recipient: s[4],
            isCompleted: s[5],
            contributorsCount: parseInt(s[6]),
            id: s[7],
            smallDescription: d.smallDescription,
            fullDescription: d.fullDescription,
            uri1: d.uri1,
            uri2: d.uri2,
            uri3: d.uri3,
            img1: d.img1,
            img2: d.img2,
            img3: d.img3,
          };
          if (data.title) l.push(data);
        }
      } catch (e) {
        console.error(e);
      }
    }
    l = l.sort((a, b) => (a.isCompleted === b.isCompleted) ? 0 : a.isCompleted ? 1 : -1);
    setitems(l);
    setHasFinished(true);
    console.log("completed");
    setroundSpin(false);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        getProjects();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);


  const TypingEffect = ({ text, speed }) => {
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(true);
    useEffect(() => {
      let isMounted = true;
      const typeText = (index) => {
        if (index <= text.length && isMounted) {
          setDisplayedText(text.substring(0, index));
          setTimeout(() => typeText(index + 1), speed);
        } else {
          const blinkInterval = setInterval(() => {
            setShowCursor((prev) => !prev);
          }, 860);
          setTimeout(() => {
            clearInterval(blinkInterval);
            isMounted && typeText(0);
          }, 5000);
          return () => {
            clearInterval(blinkInterval);
            isMounted = false;
          };
        }
      };
      typeText(0);
      return () => {
        isMounted = false;
        setDisplayedText("");
      };
    }, [text, speed]);

    return (
      <div style={{ display: "inline-block" }} >
        <p style={{ display: "inline" }}
          className="tit-t" > {displayedText} </p> 
          {
          showCursor && (<span style={{fontWeight: "bold", borderLeft: "7px solid white", paddingLeft: "4px"}}></span>)
          } 
      </div>
    );
  };

  const paragraphText =
    "Empower your project dreams with our crowdfunding platform. Create a compelling campaign, share your story, and invite backers to support your vision. Start your crowdfunding journey today and turn ideas into reality!";
  const settings = {
    dots: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const slideData = [{
    id: 1,
    imageUrl: ar,
    alt: "Image 1"
  },
  {
    id: 2,
    imageUrl: ar2,
    alt: "Image 2"
  },
  {
    id: 3,
    imageUrl: ar1,
    alt: "Image 3"
  },
  ];

  return (
    <>
      <div className="caro" style={{ pointerEvents: "none" }} >
        <Slider {...settings}>
          {slideData.map((slide) => (
            <div key={slide.id}>
              <img src={slide.imageUrl} alt={slide.alt}
                style={{ width: "100%", height: "90vh" }} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="container-2">
        <div className="content">
          <h1 className="title"> {" "}
            Create a <span style={{ color: "#00A9FF" }}> Project </span> and Bring </h1>
          <h1 className="tit-1" > {" "}Your Ideas to < span style={{ color: "#00A9FF" }}> Life! </span></h1>
          <TypingEffect text={paragraphText} speed={30} />
          <Link to="/create">
            <button className="create-button">
              Create a Project
            </button>
          </Link>
        </div>
        <img src={create}
          style={{ height: "550px" }} />
      </div>

      <div className="container-1" >
        <div className="left-side-1" >
          <h1 style={{ textAlign: "center", marginBottom: "2%", fontSize: "60px" }}>
            Projects
          </h1>
          <div>
            {roundSpin && (
              <SpinnerCircular style={{ color: "#009deb", marginTop: "15%", marginLeft: "42%" }} size={150} />
            )
            } 
          </div>

          {hasFinished ? (
            <div className="card-1">
              {items.map((item, index) => (
                <div key={index} className="val">
                  <div style={{ display: "flex", alignItems: "right", justifyContent: "space-between" }}>
                    <h3 style={{ fontSize: "40px" }}>
                      {item.title}
                    </h3>

                    <h5 className="complete-status" style={{ marginTop: "15px", fontSize: "20px", color: item.isCompleted === true ? "#70e000" : "#fdc500" }}>
                      {item.isCompleted === true ? "✔Completed" : "Open for Funding..."}
                    </h5>
                  </div>
                  <h3 style={{ marginTop: "15px" }}> Description </h3>
                  <div className="hash-divider" > </div> <div style={{ width: "1000px" }}>
                    {item.smallDescription && (
                      <p className="small-description"> {item.smallDescription} </p>
                    )}
                  </div>

                  <div className="hash-divider"> </div>
                  <div className="titles">
                    <div className="column"> Value </div>
                    <div className="column"> Collected Value </div>
                    <div className="column"> Minimum Contribution </div>
                  </div>
                  <div className="titles" >
                    <div className="nft-det">
                      {item.value}
                    </div>
                    <div className="nft-det">
                      {item.collectedValue}
                    </div>
                    <div className="nft-det">
                      {item.minimumContribution}
                    </div>
                  </div>

                  <div className="hash-divider" > </div>
                  <div style={{ display: "flex" }}>
                    <h4 style={{ marginTop: "2%" }}>Recipient Address <span> &nbsp; &nbsp; &nbsp; &nbsp; </span>:</h4 >
                    <p style={{ marginTop: "2%", fontSize: "17.5px", color: "#d6d6d6" }}>
                      &nbsp; &nbsp; {item.recipient}
                    </p>
                  </div>

                  <div style={{ display: "flex" }}>
                    <h4 style={{ marginTop: "2%" }}>
                      Contributors Count <span> &nbsp;</span>:{" "} </h4>
                    <p style={{ marginTop: "2%", fontSize: "17.5px", color: "#d6d6d6" }}>
                      &nbsp; &nbsp; {item.contributorsCount} </p> </div>
                  {item.isCompleted ? 
                    ("")
                    : (
                      // <button className="fund-button" onClick={() => openPaymentDialog(items[index])}>
                      //   Fund this Project
                      // </button>
                      ""
                    )
                  }
                </div>
              ))}
            </div>
          ) : ("")}
        </div>
      </div>
    </>
  );
}

export default CrowdFunding;