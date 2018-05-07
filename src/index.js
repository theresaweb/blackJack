import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      thisCard: this.props.thisCard,
      hand: this.props.hand,
      dealNumber: this.props.dealNumber
    };
  }
  render() {
    return (
      <div>
        <div>dealnumber in Card is {this.state.dealNumber}</div>
        <div class="card">
          <img
            alt={this.state.thisCard.value}
            src={this.state.thisCard.image}
            width="40px"
            height="60px"
          />
        </div>
      </div>
    );
  }
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
  renderCard() {
    return (
      <div>
        <div>dealnumber in rendercard is {this.state.dealNumber}</div>
        <Card
          thisCard={this.state.thisDeal[this.state.dealNumber]}
          hand={this.state.hand}
          dealNumber={this.state.dealNumber}
        />
      </div>
    );
  }
  render() {
    return (
      <div>
        <div>
          game reset is {this.state.gameReset.toString()} and{" "}
          {this.state.dealNumber}
        </div>
        <div>{this.renderCard()}</div>
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
      gameReset: true,
      dealNumber: 0,
      thisDeal: [],
      hand: [
        {
          cards: [],
          isOver: false
        }
      ]
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
  handleAddCard() {
    const incNum = this.state.dealNumber + 1;
    this.setState((prevState, props) => ({
      dealNumber: incNum
    }));
  }
  render() {
    //show status
    let status;
    if (this.state.hand.isOver) {
      status = "You Lose";
    } else {
      status = "Hand under 21";
    }
    /* const listCards = thisDeal.map(card => (
      <li key={card.code}>
        {card.value} of {card.suit}
      </li>
    ));*/
    if (this.state.error) {
      return <div>Error: {this.state.error.message}</div>;
    } else if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div class="game">
          <div>{status}</div>
          <button onClick={this.handleAddCard.bind(this)}>Hit Me</button>
          <Hand
            thisDeal={this.state.thisDeal}
            gameReset={this.state.gameReset}
            dealNumber={this.state.dealNumber}
            hand={this.state.hand}
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

function calculateOver(cards) {
  const max = 21;
  const over = false;
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].numValue > max) {
      return true;
    } else {
      return false;
    }
  }
  return null;
}
