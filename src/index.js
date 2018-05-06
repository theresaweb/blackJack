import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import "./index.css";

function Card(props) {
  return (
    <div>
      <div class="card">Card</div>
    </div>
  );
}

class Hand extends React.Component {
  renderCard() {
    return <Card />;
  }
  render() {
    return (
      <div>
        <div>{this.props.deckId}</div>
        <div className="hand-row">
          {this.renderCard()}
          {this.renderCard()}
        </div>
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
      theDeck: [],
      deckId: "",
      theCard: []
      //stepNumber: 0,
      //xIsNext: true
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
  hitMeClick(i) {
    /* const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });*/
  }
  render() {
    const { error, isLoaded, deckId } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return <Hand deckId={deckId} />;
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
