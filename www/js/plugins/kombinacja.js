/*:
 * @plugindesc Sekretna sekwencja ruchów gracza wyświetla wiadomość. 
 * @author enotekk
 *
 * @help
 * Sekwencja: góra, góra, dół, prawo, lewo, góra, dół, lewo, lewo, lewo, góra, dół
 * Po jej wykonaniu pokazuje się tekst z wiadomością.
 */

(function() {

    // Definiujemy sekwencję kierunków
    // 2 = dół, 4 = lewo, 6 = prawo, 8 = góra
    var moveSequence = [8,8,2,6,4,8,2,4,4,4,8,2];
    var currentIndex = 0;

    var _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function(d) {
        _Game_Player_moveStraight.call(this, d);

        // sprawdzamy sekwencję
        if (d === moveSequence[currentIndex]) {
            currentIndex++;
            if (currentIndex >= moveSequence.length) {
                triggerSecret();
                currentIndex = 0;
            }
        } else {
            // jeśli ruch nie pasuje → reset sekwencji
            currentIndex = 0;
        }
    };

    function triggerSecret() {
        var text = "Po chuj tu patrzysz LIVAN?";
        var faceName = "teklag"; // obraz w /img/faces/teklag.png
        var faceIndex = 0;
        $gameMessage.setFaceImage(faceName, faceIndex);
        $gameMessage.add(text);

        // wyświetlamy w aktualnej scenie
        var scene = SceneManager._scene;
        if (scene && scene._messageWindow) {
            scene._messageWindow.open();
        }
    }

})();
