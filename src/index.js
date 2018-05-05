import React from "react";
import { render } from "react-dom";
import Hello from "./Hello";
import Styles from "./index.css";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theDeck: [],
      theCard: {}
      //stepNumber: 0,
      //xIsNext: true
    };
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
    //const winner = calculateWinner(current.squares);

    /*let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }*/

    return (
      <div className="game">
        <div className="game-board">{/* return hand and hit me button */}</div>
      </div>
    );
  }
}

const Header = () => (
  <div style={styles}>
    <Hello name="Player" />
  </div>
);

render(<Header />, document.getElementById("header"));
render(<Game />, document.getElementById("game"));
