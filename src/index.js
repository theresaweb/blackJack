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
      gameReset: this.props.gameReset,
      dealNumber: this.props.dealNumber,
      hand: this.props.hand
    };
  }
  renderCard(i) {
    return <Card value={this.props.hand[i]} />;
  }
  render() {
    return this.props.hand.map((card, index) => (
      <div class="card">{this.renderCard(index)}</div>
    ));
  }
}
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      gameReset: true,
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
  handleAddCard() {
    // updating state here should update hand
    const incNum = this.state.dealNumber + 1;
    this.setState((prevState, props) => ({
      dealNumber: incNum,
      thisCard: prevState.thisDeal[incNum],
      hand: prevState.thisDeal.slice(0, prevState.dealNumber)
    }));
    const curHand = this.state.hand.slice();
    if (calculateOver(this.state.hand)) {
      this.setState((prevState, props) => ({
        isOver: true
      }));
    }
  }
  gameReset() {
    this.setState({
      gameReset: true,
      dealNumber: 0,
      thisDeal: [],
      hand: [
        {
          cards: [],
          isOver: false
        }
      ]
    });
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
        <div class="game">
          <div>{status}</div>
          <button onClick={this.handleAddCard.bind(this)}>Hit Me</button>
          <Hand
            thisDeal={this.state.thisDeal}
            gameReset={this.state.gameReset}
            dealNumber={this.state.dealNumber}
            hand={this.state.thisDeal.slice(0, dealSize)}
          />
          <button
            onClick={() => {
              this.gameReset();
            }}
          >
            Start Game
          </button>
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
  const max = 21;
  for (let i = 0; i < hand.length; i++) {
    if (hand[i].value > max) {
      return true;
    } else {
      return true;
    }
  }
  return true;
}
