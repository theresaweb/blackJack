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
  handleAddCard() {
    // updating state here should update hand
    const incNum = this.state.dealNumber + 1;
    this.setState({
      dealNumber: incNum,
      thisCard: this.state.thisDeal[incNum],
      hand: this.state.thisDeal.slice(0, this.state.dealNumber),
      isOver: this.state.isOver
    });
    var total = calculateOver(this.state.hand);
    if (total > 21) {
      this.setState((prevState, props) => ({
        isOver: true
      }));
    }
  }
  renderCard(i) {
    return <Card key={Uuid4()} value={this.state.hand[i]} />;
  }
  render() {
    return (
      <div>
        <button className="hitmeBtn" onClick={this.handleAddCard.bind(this)}>
          Hit Me
        </button>
        {this.state.hand.map((card, index) => (
          <div key={index} className="card">
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
  gameReset() {
    this.setState({
      error: null,
      isLoaded: false,
      dealNumber: 1,
      thisDeal: [],
      hand: [],
      isOver: false
    });
    render(<Game key={Uuid4()} />, document.getElementById("game"));
  }
  render() {
    //show status
    let status;
    if (this.state.isOver) {
      status = "You Lose";
    } else {
      status = "Hand under 21";
    }
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      const dealSize = this.state.dealNumber + 1;
      return (
        <div className="game">
          <div>{status}</div>
          <Hand
            key={Uuid4()}
            thisDeal={this.state.thisDeal}
            dealNumber={this.state.dealNumber}
            hand={this.state.thisDeal.slice(0, dealSize)}
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
  var total = 0;
  var formattedHand = [];
  for (var i = 0; i < hand.length; i++) {
    if (
      hand[i].value === "JACK" ||
      hand[i].value === "QUEEN" ||
      hand[i].value === "KING"
    ) {
      formattedHand[i] = 10;
    } else {
      formattedHand[i] = Number(hand[i].value);
    }
  }
  for (let i = 2; i < formattedHand.length; i++) {
    total += formattedHand[i];
  }
  return total;
}
