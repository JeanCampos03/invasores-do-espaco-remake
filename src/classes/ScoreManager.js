class ScoreManager {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.high = 0;
    }

    incrementScore(value) {
        this.score += value;

        if (this.score > this.high) {
            this.high = this.score;
        }
    }

    incrementLevel() {
        this.level += 1;
    }

    reset() {
        this.score = 0;
        this.level = 0;
    }
}

export default ScoreManager;
