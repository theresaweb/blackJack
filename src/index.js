import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      card: this.props.thisCard
    };
  }
  render() {
    return (
      <div>
        <div class="card">
          <img
            alt={this.state.card.value}
            src={this.state.card.image}
            width="40px"
            height="60px"
          />
        </div>
      </div>
    );
  }
}

class Hand extends React.Component {
  renderCard(dealNum) {
    return (
      <Card
        thisCard={this.props.thisDeal[dealNum]}
        hand={this.props.hand}
        dealNumber={this.props.dealNumber}
      />
    );
  }
  handleAddCard() {
    const thisHand = this.props.hand.slice();
    this.setState({
      gameReset: false,
      dealNumber: this.props.dealNumber + 1,
      hand: thisHand.concat([
        {
          cards: this.state.card
        }
      ])
    });
    this.renderCard(this.props.dealNumber);
  }
  render() {
    return (
      <div>
        <div>
          game reset is {this.props.gameReset.toString()} and{" "}
          {this.props.dealNumber}
        </div>
        {this.props.dealNumber < 1 ? (
          this.renderCard(this.props.dealNumber)
        ) : (
          <div />
        )}
        <button onClick={this.handleAddCard}>Hit Me</button>
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
