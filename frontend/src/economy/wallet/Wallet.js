class Wallet {
    constructor() {
        this.credits = 0;
        this.spaceCoins = 0;
    }

    getBalance() {
        return {
            credits: this.credits,
            spaceCoins: this.spaceCoins,
        };
    }
}

export default Wallet;
