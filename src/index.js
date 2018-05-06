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
      card: []
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
            card: result.cards[0]
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
    const { error, isLoaded, card } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <div class="card">
            <img src={this.state.card.image} width="40px" height="60px" />
          </div>
        </div>
      );
    }
  }
}

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hitMeClicked: false
    };
  }
  renderCard() {
    return <Card deckId={this.props.deckId} hand={this.props.hand} />;
  }
  handleAddCard = () => {
    this.setState({
      hitMeClicked: true
    });
  };
  render() {
    return (
      <div>
        {this.state.hitMeClicked ? (
          <div>{this.renderCard()}</div>
        ) : (
          <div>
            {this.renderCard()}
            {this.renderCard()}
          </div>
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
      hand: [
        {
          cards: [],
          cardsCount: 0,
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
  render() {
    //show status
    let status;
    if (this.state.hand.isOver) {
      status = "You Lose";
    } else {
      status = "Still under 21";
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
          <Hand deckId={deckId} hand={this.state.hand} />
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
