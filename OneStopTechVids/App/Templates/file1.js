var Square = (function () {
    function Square(sideLength) {
        this.sideLength = sideLength;
    }
    Square.prototype.findArea = function () {
        return this.sideLength * this.sideLength;
    };
    return Square;
})();
//# sourceMappingURL=file1.js.map
