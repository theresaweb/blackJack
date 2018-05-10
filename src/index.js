import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";
import Uuid4 from "uuid4";

function Card(props) {
  return <img src={props.value.image} alt={props.value.value} width="40" />;
}
class Hand extends React.Component {
  renderCard(i) {
    return <Card key={Uuid4()} value={this.props.hand[i]} />;
  }
  render() {
    /*let status = "";
    if (this.calculateOver(this.props.hand)) {
      status = "You lose";
    } else {
      status = "Count is under 21";
    }*/
    return (
      <div>
        <div>{status}</div>
        {this.props.hand.map((card, index) => (
          <div className="card">{this.renderCard(index)}</div>
        ))}
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
      dealNumber: 2,
      thisDeal: [],
      hand: [],
      isOver: false
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
      hand: updatedHand
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
      dealNumber: 2,
      thisDeal: [],
      hand: [],
      isOver: false
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
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="game">
          <div>{status}</div>
          <button
            disabled={!isEnabled}
            className="hitmeBtn"
            onClick={this.handleAddCard.bind(this)}
          >
            Hit Me
          </button>
          <Hand
            key={Uuid4()}
            thisDeal={this.state.thisDeal}
            dealNumber={this.state.dealNumber}
            hand={this.state.thisDeal.slice(0, this.state.dealNumber)}
            isOver={this.state.isOver}
          />
          <div>
            <button className="resetBtn" onClick={this.gameReset.bind(this)}>
              Restart Game
            </button>
          </div>
        </div>
      );
    }
  }
}

const Header = () => (
  <div>
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
