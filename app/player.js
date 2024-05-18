import Score from "./score.js"

class Player {
    constructor(name) {
        this.score = new Score();
        this.name = name;
    }
}

export default Player