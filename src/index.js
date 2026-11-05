import Game from "./classes/Game.js";
import GoalPanel from "./classes/GoalPanel.js";

const canvas = document.querySelector("canvas");
const game = new Game(canvas);
const goalPanel = new GoalPanel(() => game.start());

document
    .querySelector(".button-report")
    .addEventListener("click", () => goalPanel.show());
