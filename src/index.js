import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";
import Uuid4 from "uuid4";
import "bootstrap/dist/css/bootstrap.min.css";

class Card extends React.Component {
  render() {
    let cardValue = /^[a-zA-Z]+$/.test(this.props.value.value)
      ? this.props.value.value.charAt()
      : this.props.value.value;
    let faceUp = this.isClicked ? "" : "gradient-pattern";
    return (
      <div className="gradient-pattern">
        <div data-id={this.props.value.code}>
          {cardValue}
          {this.props.suitIcon}
        </div>
      </div>
    );
  }
}
class Hand extends React.Component {
  renderCard(i, suitIcon) {
    return (
      <Card
        key={Uuid4()}
        value={this.props.hand[i]}
        index={i}
        suitIcon={suitIcon}
      />
    );
  }
  render() {
    return (
      <div className="row hand">
        {this.props.hand.map((card, index) => {
          let rotStyle = {
            transform: "rotate(" + index * 15 + "deg)",
            left: index > 0 ? index * -100 + index * 15 : 0,
            bottom: index * -15,
            color:
              card.suit === "CLUBS" || card.suit === "SPADES" ? "black" : "red"
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
              {this.renderCard(index, suitIcon)}
            </div>
          );
        })}
      </div>
    );
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      dealNumber: 1,
      thisDeal: [],
      hand: [],
      isOver: false,
      playerTurn: true,
      playerDealNumber: 0,
      dealerDealNumber: 1
    };
  }
  componentDidMount() {
    // fetch a shuffled deck
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then(res => res.json())
      .then(shuffledCards =>
        fetch(
          "https://deckofcardsapi.com/api/deck/" +
            shuffledCards.deck_id +
            "/draw/?count=52"
        )
      )
      .then(res => res.json())
      .then(
        deckResult => {
          this.setState({
            isLoaded: true,
            thisDeal: deckResult.cards
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
  handleAddCard() {
    const curDealNumber = this.state.dealNumber;
    const updatedDealNum = curDealNumber + 1;
    const updatedHand = this.state.thisDeal.slice(0, curDealNumber + 1);
    this.setState({
      dealNumber: updatedDealNum,
      hand: updatedHand,
      playerTurn: !this.state.playerTurn
    });
    if (calculateOver(updatedHand) > 21) {
      this.setState({
        isOver: true
      });
    } else {
      this.setState({
        isOver: false
      });
    }
  }
  gameReset() {
    this.setState({
      error: null,
      isLoaded: false,
      dealNumber: 1,
      thisDeal: [],
      hand: [],
      isOver: false,
      playerTurn: true
    });
    render(<Game key={Uuid4()} />, document.getElementById("game"));
  }
  render() {
    let status = "";
    let isEnabled = true;
    if (this.state.isOver) {
      status = "You lose";
      isEnabled = false;
    } else {
      status = "Count under 21";
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
            <div>Loading...</div>;
          </div>
        </div>
      );
    } else {
      return (
        <div className="row justify-content-center">
          <div className="row align-content-center">
            <div className="col-md-12">
              <button onClick={this.gameReset.bind(this)}>Restart Game</button>
            </div>
          </div>
          <div className="col-sm-12">
            <div className="row">
              <div className="col-sm-12">{status}</div>
            </div>
            <div className="row">
              <div className="col-sm-6">
                <button
                  disabled={!isEnabled}
                  className="hitmeBtn cols-sm-12"
                  onClick={this.handleAddCard.bind(this)}
                >
                  Hit Me
                </button>
                <Hand
                  player={this.state.playerTurn}
                  key={Uuid4()}
                  thisDeal={this.state.thisDeal}
                  dealNumber={this.state.dealNumber}
                  hand={this.state.thisDeal.slice(0, this.state.dealNumber)}
                  isOver={this.state.isOver}
                />
              </div>
              <div className="col-sm-6">
                <button
                  disabled={!isEnabled}
                  className="hitmeBtn cols-sm-12"
                  onClick={this.handleAddCard.bind(this)}
                >
                  Dealer play card
                </button>
                <Hand
                  playerTurn={this.state.playerTurn}
                  key={Uuid4()}
                  thisDeal={this.state.thisDeal}
                  dealNumber={this.state.dealNumber}
                  hand={this.state.thisDeal.slice(0, this.state.dealNumber)}
                  isOver={this.state.isOver}
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
  console.log(hand);
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
  console.log(formattedHand);
  for (let i = 0; i < formattedHand.length; i++) {
    total += formattedHand[i];
  }
  console.log("total returned by cacl over" + total);
  return total;
}
