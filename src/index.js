import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";

function Card(props) {
  return <img src={props.value.image} alt={props.value.value} width="40" />;
}
class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisDeal: this.props.thisDeal,
      dealNumber: this.props.dealNumber,
      hand: this.props.hand
    };
  }
  renderCard(i) {
    return <Card value={this.props.hand[i]} />;
  }
  render() {
    return this.props.hand.map((card, index) => (
      <div className="card">{this.renderCard(index)}</div>
    ));
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
      cardTotal: 0
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
    // updating state here should update hand
    const incNum = this.state.dealNumber + 1;
    this.setState((prevState, props) => ({
      dealNumber: incNum,
      thisCard: prevState.thisDeal[incNum],
      hand: prevState.thisDeal.slice(0, prevState.dealNumber)
    }));
    var total = calculateOver(this.state.hand);
    if (total > 21) {
      this.setState((prevState, props) => ({
        isOver: true,
        cardTotal: { total }
      }));
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
      cardTotal: 0
    });
    render(<Game key={"uniqueID"} />, document.getElementById("game"));
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
          <div>{this.state.cardTotal}</div>
          <div>
            <button
              className="hitmeBtn"
              onClick={this.handleAddCard.bind(this)}
            >
              Hit Me
            </button>
          </div>
          <Hand
            thisDeal={this.state.thisDeal}
            dealNumber={this.state.dealNumber}
            hand={this.state.thisDeal.slice(0, dealSize)}
          />
          <div>
            <button className="resetBtn" onClick={this.gameReset.bind(this)}>
              Start Game
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
render(<Game />, document.getElementById("game"));

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
      formattedHand[i] = hand[i].value;
    }
  }
  for (let i = 0; i < formattedHand.length; i++) {
    total += formattedHand[i];
  }
  return total;
}
