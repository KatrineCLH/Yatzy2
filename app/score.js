class Score {
    constructor() {
        this.ones = {held: false, value: 0}
        this.twos = {held: false, value: 0}
        this.threes = {held: false, value: 0}
        this.fours = {held: false, value: 0}
        this.fives = {held: false, value: 0}
        this.sixes = {held: false, value: 0}
        this.onePair = {held: false, value: 0}
        this.twoPair = {held: false, value: 0}
        this.threeSame = {held: false, value: 0}
        this.fourSame = {held: false, value: 0}
        this.fullHouse = {held: false, value: 0}
        this.smallStraight = {held: false, value: 0}
        this.largeStraight = {held: false, value: 0}
        this.chance = {held: false, value: 0}
        this.yatzy = {held: false, value: 0}
        this.total = {held: false, value: 0}
        this.sum = {held: false, value: 0}
        this.bonus = {held: false, value: 0}
        this.result = {held: false, value: 0}
    }
}

export default Score;