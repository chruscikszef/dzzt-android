/*:
 * @plugindesc Zwalnia ruch i wyłącza bieg w pokoju o ID 12. 
 * @author enotekk
 *
 * @help
 * W pokoju o ID 12 postać chodzi wolniej i nie może biegać.
 * W innych pokojach działa normalnie.
 */

(function() {

    // Zmienna dla zwolnionej prędkości (np. 2 zamiast 4)
    var slowMoveSpeed = 2;

    // Zapamiętujemy oryginalne metody
    var _Game_Player_moveSpeed = Game_Player.prototype.moveSpeed;
    var _Game_Player_canMove = Game_Player.prototype.canMove;

    // Nadpisujemy prędkość ruchu
    Game_Player.prototype.moveSpeed = function() {
        if ($gameMap.mapId() === 12) {
            return slowMoveSpeed;
        } else {
            return _Game_Player_moveSpeed.call(this);
        }
    };

    // Nadpisujemy funkcję sprawdzającą możliwość ruchu (dla biegu)
    var _Game_Player_isDashing = Game_Player.prototype.isDashing;
    Game_Player.prototype.isDashing = function() {
        if ($gameMap.mapId() === 12) {
            return false; // wyłączamy bieg w mapie 12
        } else {
            return _Game_Player_isDashing.call(this);
        }
    };

})();
