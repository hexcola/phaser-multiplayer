/**
 * //a player class in the server
 * @param {*} startX 
 * @param {*} startY 
 * @param {*} startAngle 
 */
let Player = ( startX, startY, startAngle ) => {
    this.x = startX;
    this.y = startY;
    this.angle = startAngle;
}

//let handler = Player.prototype;

module.exports = Player;