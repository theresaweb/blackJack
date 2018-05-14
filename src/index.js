import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";
import Uuid4 from "uuid4";
import "bootstrap/dist/css/bootstrap.min.css";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faceUp: false
    };
  }
  toggleFaceUp() {
    const currentState = this.props.faceUp;
    this.setState({ faceUp: !currentState });
  }
  render() {
    let cardValue = /^[a-zA-Z]+$/.test(this.props.value.value)
      ? this.props.value.value.charAt()
      : this.props.value.value;
    return (
      <div
        className={this.state.faceUp ? null : "gradient-pattern"}
        onClick={this.toggleFaceUp.bind(this)}
      >
        <div data-id={this.props.value.code}>
          <div className="cardInner">
            {cardValue}
            {this.props.suitIcon}
          </div>
        </div>
      </div>
    );
  }
  handleCardClick() {}
}
class Hand extends React.Component {
  renderCard(i, suitIcon, hand) {
    let thisCard = hand[i];
    let faceUp = false;
    return (
      <Card
        key={Uuid4()}
        value={thisCard}
        index={i}
        suitIcon={suitIcon}
        faceUp={faceUp}
      />
    );
  }
  render() {
    if (this.props.isPlayer) {
      return (
        <div className="row hand">
          {this.props.playerHand.map((card, index) => {
            let rotStyle = {
              transform: "rotate(" + index * 10 + "deg)",
              left: index > 0 ? index * -100 + index * 10 : 0,
              bottom: index * -5,
              color:
                card.suit === "CLUBS" || card.suit === "SPADES"
                  ? "black"
                  : "red"
            };
            let suitIcon = "";
            if (card.suit === "CLUBS") {
              suitIcon = "\u2663";
            } else if (card.suit === "SPADES") {
              suitIcon = "\u2660";
            } else if (card.suit === "HEARTS") {
              suitIcon = "\u2665";
            } else if (card.suit === "DIAMONDS") {
              suitIcon = "\u2666";
            }
            return (
              <div className="card" style={rotStyle}>
                {this.renderCard(index, suitIcon, this.props.playerHand)}
              </div>
            );
          })}
        </div>
      );
    } else {
      return (
        <div className="row hand">
          {this.props.dealerHand.map((card, index) => {
            let rotStyle = {
              transform: "rotate(" + index * 10 + "deg)",
              left: index > 0 ? index * -100 + index * 10 : 0,
              bottom: index * -5,
              color:
                card.suit === "CLUBS" || card.suit === "SPADES"
                  ? "black"
                  : "red"
            };
            let suitIcon = "";
            if (card.suit === "CLUBS") {
              suitIcon = "\u2663";
            } else if (card.suit === "SPADES") {
              suitIcon = "\u2660";
            } else if (card.suit === "HEARTS") {
              suitIcon = "\u2665";
            } else if (card.suit === "DIAMONDS") {
              suitIcon = "\u2666";
            }
            return (
              <div className="card" style={rotStyle}>
                {this.renderCard(index, suitIcon, this.props.dealerHand)}
              </div>
            );
          })}
        </div>
      );
    }
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deckId: "",
      error: null,
      isLoaded: false,
      dealNumber: 1,
      dealerIsOver: false,
      playerIsOver: false,
      dealerHand: [],
      playerHand: [],
      playerTotal: 0,
      dealerTotal: 0
    };
  }
  componentDidMount() {
    // fetch a shuffled deck
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then(res => res.json())
      .then(
        shuffledCards => {
          let deckId = shuffledCards.deck_id;
          this.setState({
            deckId: deckId
          });
          fetch(
            "https://deckofcardsapi.com/api/deck/" + deckId + "/draw/?count=2"
          )
            .then(res => res.json())
            .then(deckResult => {
              let initialPlayerHand = this.state.playerHand.concat(
                deckResult.cards[0]
              );
              let initialDealerHand = this.state.playerHand.concat(
                deckResult.cards[1]
              );
              let playerTotal = calculateOver(initialPlayerHand);
              let dealerTotal = calculateOver(initialDealerHand);
              this.setState({
                isLoaded: true,
                playerHand: initialPlayerHand,
                dealerHand: initialDealerHand,
                playerTotal: playerTotal,
                dealerTotal: dealerTotal
              });
            });
        },
        error => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      );
  }
  handleAddCardPlayer() {
    let curPlayerHand = this.state.playerHand.slice();
    fetch(
      "https://deckofcardsapi.com/api/deck/" +
        this.state.deckId +
        "/draw/?count=1"
    )
      .then(res => res.json())
      .then(
        dealResult => {
          let newPlayerHand = curPlayerHand.concat(dealResult.cards);
          this.setState({
            isLoaded: true,
            playerHand: newPlayerHand
          });
          const curDealNumber = this.state.dealNumber;
          const updatedDealNum = curDealNumber + 1;
          this.setState({
            dealNumber: updatedDealNum
          });
          let playerTotal = calculateOver(this.state.playerHand);
          if (playerTotal > 21) {
            this.setState({
              playerIsOver: true,
              playerTotal: playerTotal
            });
          } else {
            this.setState({
              playerIsOver: false,
              playerTotal: playerTotal
            });
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      );
  }
  handleAddCardDealer() {
    let curDealerHand = this.state.dealerHand.slice();
    fetch(
      "https://deckofcardsapi.com/api/deck/" +
        this.state.deckId +
        "/draw/?count=1"
    )
      .then(res => res.json())
      .then(
        dealResult => {
          let newDealerHand = curDealerHand.concat(dealResult.cards);
          this.setState({
            isLoaded: true,
            dealerHand: newDealerHand
          });
          const curDealNumber = this.state.dealNumber;
          const updatedDealNum = curDealNumber + 1;
          this.setState({
            dealNumber: updatedDealNum,
            playerType: "dealer"
          });
          let dealerTotal = calculateOver(this.state.dealerHand);
          if (dealerTotal > 21) {
            this.setState({
              dealerIsOver: true,
              dealerTotal: dealerTotal
            });
          } else {
            this.setState({
              dealerIsOver: false,
              dealerTotal: dealerTotal
            });
          }
        },
        error => {
          this.setState({
            isLoaded: true,
            error: error
          });
        }
      );
  }
  gameReset() {
    this.setState({
      deckId: "",
      error: null,
      isLoaded: false,
      dealNumber: 1,
      dealerIsOver: false,
      playerIsOver: false,
      dealerHand: [],
      playerHand: [],
      playerTotal: 0,
      dealerTotal: 0
    });
    render(<Game key={Uuid4()} />, document.getElementById("game"));
  }
  render() {
    let playerStatus = "";
    let isEnabled = true;
    let thisPlayerTotal = this.state.playerTotal;
    if (this.state.playerIsOver) {
      playerStatus = "Player loses - total: " + thisPlayerTotal;
      isEnabled = false;
    } else {
      playerStatus = "Player has " + thisPlayerTotal;
      isEnabled = true;
    }
    let dealerStatus = "";
    let thisDealerTotal = this.state.dealerTotal;
    if (this.state.dealerIsOver) {
      dealerStatus = "Dealer loses - total: " + thisDealerTotal;
      isEnabled = false;
    } else {
      dealerStatus = "Dealer has " + thisDealerTotal;
      isEnabled = true;
    }
    if (this.state.error) {
      return (
        <div className="row align-content-center">
          <div className="col-md-12">
            <div>Error: {this.state.error.message}</div>;
          </div>
        </div>
      );
    } else if (!this.state.isLoaded) {
      return (
        <div className="row align-content-center">
          <div className="col-md-12">
            <div>Loading...</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="row justify-content-center">
          <div className="row align-content-center">
            <div className="col-md-12">
              <button onClick={this.gameReset.bind(this)}>Start/Deal</button>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-12">{playerStatus}</div>
                </div>
                <button
                  disabled={!isEnabled}
                  className="hitmeBtn cols-sm-12"
                  onClick={this.handleAddCardPlayer.bind(this)}
                >
                  Hit Me
                </button>
                <Hand
                  key={Uuid4()}
                  dealNumber={this.state.dealNumber}
                  dealerHand={this.state.dealerHand}
                  playerHand={this.state.playerHand}
                  playerIsOver={this.state.playerIsOver}
                  isPlayer={true}
                />
              </div>
              <div className="col-sm-6">
                <div className="row">
                  <div className="col-sm-12">{dealerStatus}</div>
                </div>
                <button
                  disabled={!isEnabled}
                  className="hitmeBtn cols-sm-12"
                  onClick={this.handleAddCardDealer.bind(this)}
                >
                  Hit Me
                </button>
                <Hand
                  key={Uuid4()}
                  dealNumber={this.state.dealNumber}
                  dealerHand={this.state.dealerHand}
                  playerHand={this.state.playerHand}
                  dealerIsOver={this.state.dealerIsOver}
                  isPlayer={false}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

const Header = () => (
  <div className="row">
    <Hello name="Player" />
  </div>
);

render(<Header />, document.getElementById("header"));
render(<Game key={Uuid4()} />, document.getElementById("game"));

function calculateOver(hand) {
  var total = 0;
  var formattedHand = [];
  for (var i = 0; i < hand.length; i++) {
    if (
      hand[i].value === "JACK" ||
      hand[i].value === "QUEEN" ||
      hand[i].value === "KING"
    ) {
      formattedHand[i] = 10;
    } else if (hand[i].value === "ACE") {
      formattedHand[i] = 1;
    } else {
      formattedHand[i] = Number(hand[i].value);
    }
  }
  for (let i = 0; i < formattedHand.length; i++) {
    total += formattedHand[i];
  }
  return total;
}
