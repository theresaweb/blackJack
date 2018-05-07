import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      card: [],
      cards: []
    };
  }
  componentDidMount() {
    // fetch a card
    fetch(
      "https://deckofcardsapi.com/api/deck/" +
        this.props.deckId +
        "/draw/?count=1"
    )
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            card: result.cards[0],
            hand: []
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  render() {
    const { error, isLoaded } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div class="card">
            <img
              alt="{this.state.card.code}"
              src={this.state.card.image}
              width="40px"
              height="60px"
            />
          </div>
        </div>
      );
    }
  }
}

class Hand extends React.Component {
  renderCard() {
    return <Card deckId={this.props.deckId} hand={this.props.hand} />;
  }
  handleAddCard = () => {
    this.setState({
      gameReset: false
    });
  };
  render() {
    return (
      <div>
        <div>game reset is {this.props.gameReset.toString()}</div>
        {this.props.gameReset ? (
          <div>
            {this.renderCard()}
            {this.renderCard()}
          </div>
        ) : (
          <div>{this.renderCard()}</div>
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
      deckId: "",
      gameReset: false,
      hand: [
        {
          cards: [],
          isOver: false
        }
      ]
    };
  }
  componentDidMount() {
    // fetch a deck ID
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            deckId: result.deck_id
          });
        },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }
  gameReset = () => {
    this.setState({
      gameReset: true
    });
  };
  render() {
    //show status
    let status;
    if (this.state.hand.isOver) {
      status = "You Lose";
    } else {
      status = "Hand under 21";
    }
    // render the hand
    const { error, isLoaded, deckId } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div class="game">
          <div>{status}</div>
          <Hand
            deckId={deckId}
            gameReset={this.state.gameReset}
            hand={this.state.hand}
          />
          <div>{deckId}</div>
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
