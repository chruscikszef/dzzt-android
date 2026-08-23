/*:
 * @target MV MZ
 * @plugindesc Naprawia wykrywanie dotyku w warunku "Button OK".
 * @author GalaxyLIVAN
 *
 * @help TouchOKFix.js
 *
 * Przekierowuje dotyk ekranu na przycisk 'OK' TYLKO podczas przebywania na mapie.
 * W menu (przedmioty, ekwipunek, opcje) oraz podczas okien dialogowych
 * zachowana zostaje domyślna obsługa dotyku.
 */

(function() {
    'use strict';

    function isTouchOKAllowed() {
        // Działa tylko podczas przebywania na mapie
        if (!SceneManager._scene || !(SceneManager._scene instanceof Scene_Map)) {
            return false;
        }
        // Wyłącz na mapie, gdy aktywne jest okno dialogowe lub okno wyboru
        if ($gameMessage && $gameMessage.isBusy()) {
            return false;
        }
        return true;
    }

    const _Input_isPressed = Input.isPressed;
    Input.isPressed = function(keyName) {
        const result = _Input_isPressed.call(this, keyName);
        if (!result && keyName === 'ok' && isTouchOKAllowed()) {
            return TouchInput.isPressed();
        }
        return result;
    };

    const _Input_isTriggered = Input.isTriggered;
    Input.isTriggered = function(keyName) {
        const result = _Input_isTriggered.call(this, keyName);
        if (!result && keyName === 'ok' && isTouchOKAllowed()) {
            return TouchInput.isTriggered();
        }
        return result;
    };

    const _Input_isRepeated = Input.isRepeated;
    Input.isRepeated = function(keyName) {
        const result = _Input_isRepeated.call(this, keyName);
        if (!result && keyName === 'ok' && isTouchOKAllowed()) {
            return TouchInput.isRepeated();
        }
        return result;
    };

})();