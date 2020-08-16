
import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import TicTacToe from "../game";
import Board from "./organisms/board";

const App = Client({
  game: TicTacToe,
  board: Board
});

render(<App />, document.getElementById("root"));
