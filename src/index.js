import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";

class Card extends React.Component {
  render() {
    return (
      <div>
        <p>{this.props.deckId}</p>
        <div class="card">Card</div>
      </div>
    );
  }
}

class Hand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hitMeClicked: false,
      cardsCount: 0
    };
  }
  renderCard() {
    return <Card deckId={this.props.deckId} />;
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
      cards: []
    };
  }
  componentDidMount() {
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
    const { error, isLoaded, deckId } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return <Hand deckId={deckId} cards={this.state.cards} />;
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
