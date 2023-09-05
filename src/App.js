import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import background from "./styles/bg.png";
import video from "./img/video.mp4";
import styled from "styled-components";
import Accordion from './Accordion';
import styles from "./App.css"

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  letter-spacing: 3px;
  font-family: 'Press Start 2P', cursive;
  border-radius: 20px;
  border: none;
  background-color: #99bbf3;
  font-weight: bold;
  font-size: 30px;
  color: var(--accent);
  width: 350px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledButton2 = styled.button`
  letter-spacing: 2px;
  font-family: 'Press Start 2P', cursive;
  border-radius: 15px;
  border: none;
  background-color: #99bbf3;
  font-weight: bold;
  font-size: 30px;
  color: var(--accent);
  padding: 20px;
  width: 300px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;


export const StyledRoundButton = styled.button`
  padding: 10px;
  background: transparent;
  border-radius: 100%;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton2 = styled.button`
  background: transparent;
  border-radius: 100%;
  border: none;
  padding: 10px;
  font-weight: bold;
  font-size: 30px;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 100px;
  transition: width 0.5s;
  transition: height 0.5s;
`;


export const StyledImg = styled.img`
width: 1500px;
  transition: width 0.5s;
`;

export const StyledGrid = styled.img`
width: 600px;
  transition: width 0.5s;
`;

export const StyledImg2 = styled.img`
  border-radius: 20px;
  @media (min-width: 1000px) {
    width: 400px;
  }
  transition: width 0.5s;
`;

export const StyledImg3 = styled.img`
  width: 100%;
  transition: transform 1s;
  :hover {
    transform: translateZ(10px);
  }
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;




function App() {
  const accordionData = [
    {
      title: 'How do I bridge funds to Base?',
      content: `First, you have to add the Base Network to Metamask. You can go to chainlist.org and search "Base" to add it. Next, head over to the Base Bridge website https://bridge.base.org/deposit and ensure you've selected the 'Deposit' option. From here, click the 'Connect wallet' button and select your wallet from the list of available options. Follow the prompts in your wallet to connect it to the bridge. Once connected, you're ready to deposit your desired funds.
      `
    },
    {
      title: 'How can I mint?',
      content: `You must make sure that you are connected to the Base Mainnet. \n
      Once you have been able to bridge your desired $ETH to the Base Network go to our mint section, connect your wallet and select how many amounts of BMB Monkeys you want to mint!`
    },
    {
      title: 'How much is the supply of the Monkeys?',
      content: `The first Generation of the Based-Zoo, The Based Monkeys, will consist of 999 unique NFTs on the Base Network.
      `
    },
    {
      title: 'How do I see them or trade?',
      content: `You can trade them right now and see your minted Monkeys on Opensea!
      `},
      {
        title: 'How do I join the Based-Zoo DAO?',
        content: `More details about the discord join will be available soon. You'll need at least 1 BMB!
        `
      },
  ];
  const dispatch = useDispatch();
  const aboutRef = useRef(null);
  const faqRef = useRef(null);
  const mintRef = useRef(null);
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [isActive, setIsActive] = useState(false);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Select how many BMB Monkeys do you want to mint`);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });

  const claimNFTs = () => {
    let cost = 1900000000000000;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    let totalCostWeiNum = cost * mintAmount
    let trueCost = BigInt(totalCostWeiNum).toString();
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: trueCost,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Error. Try again.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `Congratulations! You minted ${mintAmount} ${CONFIG.NFT_NAME}!`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 20) {
      newMintAmount = 20;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  const handleAbout = () => {
    aboutRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const handleFaq = () => {
    faqRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const handleMint = () => {
    mintRef.current?.scrollIntoView({behavior: 'smooth'});
  };

  const handleTwitter = () => {
    window.open(
      'https://twitter.com/Base_MBS',
      '_blank'
    );
  };

const handleOpensea = () => {
    window.open(
      'https://opensea.io/collection/bmb-gen-1-monkeys',
      '_blank'
    );
  };



  return (
    <s.Screen>

      <div className="main" style={{display:"flex", 
      backgroundImage: `url(${background})`,
      backgroundAttachment: "fixed",
      backgroundPosition: "center",
      flex: "1",
      ai: "1"
       }}>

<s.Container
        ai={"center"}>

        <div className="nav" style={{display:"flex"}}>
          <div className="logo">
       <s.TextNav
            style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                padding: 50,
                letterSpacing: 2,
                color: "var(--accent-text)",
                marginTop: "-10px",
              }}
            >
              Base Monkey Business
       </s.TextNav>
          </div>
          
          <div className="bar" style={{display:"flex", marginLeft: "600px"}}>
          <div className="option1" onClick={handleAbout}>
          <s.TextNav
            style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                padding: 50,
                letterSpacing: 2,
                color: "var(--accent-text)",
                marginTop: "-10px",
                cursor: "pointer"
              }}
            >
              About
       </s.TextNav>
          </div>

          <div className="option2" style={{marginLeft:"0px"}} onClick={handleOpensea}>
          <s.TextNav
            style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                padding: 50,
                letterSpacing: 2,
                color: "var(--accent-text)",
                marginTop: "-10px",
                cursor: "pointer"
              }}
            >
              Opensea
       </s.TextNav>
          </div>

          <div className="option3" style={{marginLeft:"0px"}} onClick={handleFaq}>
          <s.TextNav
            style={{
                textAlign: "center",
                fontSize: 20,
                fontWeight: "bold",
                padding: 50,
                letterSpacing: 2,
                color: "var(--accent-text)",
                marginTop: "-10px",
                cursor: "pointer"
              }}
            >
              FAQ
       </s.TextNav>
          </div>
          </div>  
       </div>
   

       <s.SpacerLargeX />
       <s.SpacerMedium />

       <s.TextTitle 
       style={{
          fontSize: 40,
          fontStyle: "italic",
       }}>
          Join the Based-Zoo DAO
        </s.TextTitle>
        <s.SpacerLarge/>
        <s.TextTitle
        style={{
          fontSize: 35,
          letterSpacing: 30,
       }}>
          <b>BMB</b> GEN 1
        </s.TextTitle>
        <s.SpacerLargeX />
        <StyledImg
        src={"/config/images/banner.png"}
        >
        </StyledImg>


        <s.SpacerLargeX />
        <s.SpacerMedium />

        <StyledButton onClick={handleMint}
        style={{
              boxShadow: "2px 5px 5px 4px rgba(0,0,0,0.5)",
              width: "320px",
              padding: 20
            }}
            >
            MINT NOW
        </StyledButton>
      
        <s.SpacerLargeXX />
        <s.SpacerLargeX />

        <div class="mint">
      <div class="slider">
        <div class="slide-track">
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/1.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/2.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/3.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/4.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/5.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/6.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/7.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/8.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/9.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/10.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/11.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/12.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/13.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/14.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/15.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/16.png"}
          />
          </div>

      </div>
      </div>
      </div>
      
      <s.SpacerLargeXX />

      <div className="about" ref={aboutRef}> 
      <s.SpacerLargeX />
      
      <s.TextTitle 
      style={{
        textAlign: "center"
      }}
      >
        What is Base Monkey Business (BMB)?
      </s.TextTitle>
      <s.SpacerLargeX />
      <s.TextSubTitle
      style={{
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold",
        letterSpacing: 2,
        color: "var(--accent-text)",
        marginTop: 20,
        marginLeft: 100,
        marginRight: 100
      }}
    >
BMB presents a series of 999 Monkey NFTs in pixel art, each a visual virtual piece, meticulously created for the BaseChain platform. Embrace and express your distinctive web3 person as you become part of the vibrant Based-Zoo DAO community. Become a prominent figure in the Base Community unite with the Base Monkey Business revolution.
      </s.TextSubTitle>
      <s.SpacerLargeXX />
      <div class="dao" style={{marginLeft:"170px", display: "flex"}}>
      <StyledImg
        src={"/config/images/dao1.jpeg"}
        style={{
          width: "450px",
          height: "450px",
          borderRadius: "30px",
          marginRight: "60px",
          marginTop: "50px"
        }}
        >
        </StyledImg>


      <video id="video1" width="550" autoPlay muted loop>
      <source src={video} type="video/mp4"/>
        </video>

        <StyledImg
        src={"/config/images/dao2.jpeg"}
        style={{
          width: "450px",
          height: "450px",
          borderRadius: "30px",
          marginLeft: "60px",
          marginTop: "50px"
        }}
        >
        </StyledImg>

        </div>
        <s.SpacerLargeXX />
      <s.TextTitle 
      style={{
        textAlign: "center"
      }}
      >
        What is Based-Zoo DAO?
      </s.TextTitle>
      <s.SpacerLargeX />
      <s.TextSubTitle
      style={{
        textAlign: "center",
        fontSize: 19,
        fontWeight: "bold",
        letterSpacing: 2,
        color: "var(--accent-text)",
        marginTop: 20,
        marginLeft: 100,
        marginRight: 100
      }}
    >
Based-Zoo DAO is a decentralized community governed by the holders of the BMB Gens launched on the Base Mainnet. Each one will have access to a closed DAO (mainly managed on discord) in which different topics of crypto and nfts on Base Chain will be shared such as news of emerging Base projects with NFT and token alpha (...a channel of new tokens LP...), technical analysis channel with short/long term calls of various tokens mid-high mcap, A space to share your love for NFT Monkeys and Base, and much more to come!
      </s.TextSubTitle>
      


<s.SpacerLargeXX />

<s.TextTitle 
      style={{
        textAlign: "center",
        fontSize: 29,
        fontStyle: "italic",
        color: "#20cf4f",
      }}
      >
        GEN 1
      </s.TextTitle>
      <s.SpacerMedium />
      <s.TextTitle 
      style={{
        textAlign: "center",
        fontSize: 35
      }}
      >
        <b>The Based Monkeys</b>
      </s.TextTitle>
    
      <s.SpacerLargeX />
      <s.SpacerLarge />

      <div class="grid" style={{display:"flex", marginLeft: "60px"}}>
  <StyledGrid
        src={"/config/images/grid.png"}
        style={{
        }}
        
        />
        <StyledGrid
        src={"/config/images/2monke.png"}
        style={{
        }}
        
        />
        <StyledGrid
        src={"/config/images/2grid.png"}
        style={{
        }}
        
        />
    </div>
</div>

      
<s.SpacerLargeXX />
<div ref={mintRef}>
<s.SpacerLargeX />
<s.SpacerLarge />


<ResponsiveWrapper flex={1} style={{ }} mint>
        
        <s.Container
          flex={1}
          jc={"center"}
          ai={"center"}
          style={{
            borderRadius: 24,
          }}
        >
           
          <s.Container flex={1} jc={"center"} ai={"center"} style={{ marginTop: "-50px" }}>
          <s.TextSubTitle2
            style={{
              textAlign: "center",
              fontSize: 40,
              fontWeight: 1000,
              letterSpacing: 12,
              color: "var(--secondary-text)",
            }}
          >
            GEN 1 Mint Live
          </s.TextSubTitle2>
          <s.SpacerLargeX />

          <StyledImg2 
            src={"/config/images/gif.gif"}
          />

          </s.Container>
          <s.TextTitle
            style={{
              textAlign: "center",
              fontSize: 50,
              fontWeight: "bold",
              color: "var(--accent-text)",
            }}
          >
       
          </s.TextTitle>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
         <s.SpacerLargeX />
         
          </s.TextDescription>
          {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
            <>
             <s.SpacerXSmall />
              <s.TextTitle
                style={{ textAlign: "center", color: "var(--accent-text)" }}
              >
                The sale has ended.
              </s.TextTitle>
              
            </>
          ) : (
            <>
              <s.TextTitle2
                style={{ textAlign: "center", color: "var(--accent-text)", fontSize: 25 }}
              >
                
                {data.totalSupply} / {CONFIG.MAX_SUPPLY}
              </s.TextTitle2>
              <s.SpacerLargeX />
              <s.TextTitle2
                style={{ textAlign: "center", color: "var(--accent-text)", fontSize: 28 }}
              >
                Mint price is 0.0019 <b>$ETH</b>
              </s.TextTitle2>
              <s.SpacerLargeX />
              {blockchain.account === "" ||
              blockchain.smartContract === null ? (
                <s.Container ai={"center"} jc={"center"}>
                  
                  <StyledButton2
                    onClick={(e) => {
                      e.preventDefault();
                      dispatch(connect());
                      getData();
                    }}
                    style={{ marginLeft: "-8px" }}
                  >
                    CONNECT
                  </StyledButton2>
                  

                  {blockchain.errorMsg !== "" ? (
                    <>
                  <s.SpacerLargeX />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          letterSpacing: 2
                        }}
                      >
                        
                      Shibarium network is currently clogged
                      </s.TextDescription>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                          letterSpacing: 2
                        }}
                      >
                        
                        Please wait for official announcements
                      </s.TextDescription>
                      
                    </>
                  ) : null}
                </s.Container>
              ) : (
                <>
                  <s.TextDescription
                    style={{
                      textAlign: "center",
                      color: "var(--accent-text)",
                    }}
                  >
                    
                    {feedback}
                  </s.TextDescription>
                  <s.SpacerMedium />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledRoundButton2
                      style={{ lineHeight: 0.4, color: "var(--primary)"}}
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        decrementMintAmount();
                      }}
                    >
                      -
                    </StyledRoundButton2>
                    <s.SpacerMedium />
                    
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)"
                      }}
                    >
                      {mintAmount}
                    </s.TextDescription>
                    
                    <s.SpacerMedium />
                    <StyledRoundButton2
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        incrementMintAmount();
                      }}
                      style={{
                        color: "var(--primary)"
                      }}
                    >
                      +
                    </StyledRoundButton2>
                  </s.Container>
                  
                  <s.SpacerSmall />
                  <s.Container ai={"center"} jc={"center"} fd={"row"}>
                    <StyledButton2
                      disabled={claimingNft ? 1 : 0}
                      onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                      }}
                    >
                      {claimingNft ? "WAIT" : "MINT"}
                    </StyledButton2>
                    
                  </s.Container>
                </>
              )}
            </>
          )}
        </s.Container>
      </ResponsiveWrapper>

      </div>

      <s.SpacerLargeXX />
      <s.SpacerLargeX />



      <div className="mint">
      <div class="mint">
      <div class="slider">
        <div class="slide-track">
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/1.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/2.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/3.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/4.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/5.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/6.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/7.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/8.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/9.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/10.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/11.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/12.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/13.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/14.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/15.png"}
          />
          </div>
          <div class="slide">
          <StyledImg3
            src={"/config/bmb/16.png"}
          />
          </div>

      </div>
      </div>
      </div>

      <s.SpacerLargeXX />
      <s.SpacerLargeX />
      
      <div className="faq">
      <s.TextTitle
      style={{
        textAlign: "center",
        fontSize: 40,
        fontWeight: 1000,
        letterSpacing: 25,
      }}
    >
        FAQ
      </s.TextTitle>

      <s.SpacerLargeX />
      <s.SpacerSmall />

      <s.Container
          flex={1}
          jc={"center"}
          ai={"center"}
          style={{
            borderRadius: 30,

          }}
          
        >
          

      <div class="accordion" ref={faqRef}>

        {accordionData.map(({ title, content }) => (
          <Accordion title={title} content={content} />
        ))}

    </div>

    <s.SpacerLargeXX />

    <div className="networks" style={{display:"flex", cursor: "pointer"}} >
    <div className="network1" onClick={handleTwitter}>
    <StyledLogo
    src={"/config/images/tw.png"}
    style={{
      width: "100px"
    }}
    />
    </div>
    </div>

    <s.SpacerLargeXX />
    </s.Container>
    </div>

</div>

<s.SpacerLarge />

</s.Container>
      </div>
    </s.Screen>
  );
}

export default App;
