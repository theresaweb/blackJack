import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";
import Uuid4 from "uuid4";

function Card(props) {
  return <img src={props.value.image} alt={props.value.value} width="40" />;
}
class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisDeal: this.props.thisDeal,
      dealNumber: this.props.dealNumber,
      hand: this.props.hand,
      isOver: this.props.isOver
    };
  }
  TotalCards(incNum) {
    var total = calculateOver(this.state.hand, this.state.dealNumber);
    console.log("totalcards " + total);
    if (total > 21) {
      this.setState({
        isOver: "You lose"
      });
    }
  }
  handleAddCard() {
    const incNum = this.state.dealNumber + 1;
    console.log("incnum " + incNum);
    this.setState({
      dealNumber: incNum,
      thisCard: this.state.thisDeal[incNum],
      hand: this.state.thisDeal.slice(0, incNum + 1),
      isOver: this.state.isOver
    });
    this.TotalCards(incNum);
  }
  componentDidMount() {
    const incNum = this.state.dealNumber;
    this.TotalCards(incNum);
  }
  renderCard(i) {
    return <Card key={Uuid4()} value={this.state.hand[i]} />;
  }
  render() {
    //console.log(this.state.hand);
    // console.log(this.state.dealNumber)
    return (
      <div>
        <div>{this.state.isOver}</div>
        <button className="hitmeBtn" onClick={this.handleAddCard.bind(this)}>
          Hit Me
        </button>
        {this.state.hand.map((card, index) => (
          <div key={Uuid4()} className="card">
            {this.renderCard(index)}
          </div>
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
      dealNumber: 1,
      thisDeal: [],
      hand: [],
      isOver: "Count is under 21"
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
  gameReset() {
    this.setState({
      error: null,
      isLoaded: false,
      dealNumber: 1,
      thisDeal: [],
      hand: [],
      isOver: "Count is under 21"
    });
    render(<Game key={Uuid4()} />, document.getElementById("game"));
  }
  render() {
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      const dealSize = this.state.dealNumber + 1;
      return (
        <div className="game">
          <Hand
            key={Uuid4()}
            thisDeal={this.state.thisDeal}
            dealNumber={this.state.dealNumber}
            hand={this.state.thisDeal.slice(0, dealSize)}
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

function calculateOver(hand, dealNumber) {
  console.log("hand passed to calc over " + hand);
  console.log("dealnumber passed to calc over " + dealNumber);
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
