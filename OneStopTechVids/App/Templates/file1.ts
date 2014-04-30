class Square {
    private sideLength: number;
    constructor(sideLength: number) {
        this.sideLength = sideLength;
    }

    public findArea(): number {
        return this.sideLength * this.sideLength;
    }
}


