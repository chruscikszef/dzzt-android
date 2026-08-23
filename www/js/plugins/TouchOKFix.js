/*:
 * @target MV MZ
 * @plugindesc Pozwala na wykrywanie dotyku/przetrzymania palca w warunkach przycisku OK.
 * @author GalaxyLIVAN
 *
 * @help TouchOKFix.js
 *
 * Domyślnie RPG Maker sprawdza dotyk ekranu osobną klasą TouchInput,
 * ignorując sprawdzanie klawisza OK w warunkach zdarzeń (Conditional Branch).
 * Ten plugin sprawia, że dotknięcie ekranu lub kliknięcie myszy jest
 * traktowane jak wciśnięcie przycisku OK.
 */

(function() {
    'use strict';

    const _Input_isPressed = Input.isPressed;
    Input.isPressed = function(keyName) {
        const result = _Input_isPressed.call(this, keyName);
        if (!result && keyName === 'ok') {
            return TouchInput.isPressed();
        }
        return result;
    };

    const _Input_isTriggered = Input.isTriggered;
    Input.isTriggered = function(keyName) {
        const result = _Input_isTriggered.call(this, keyName);
        if (!result && keyName === 'ok') {
            return TouchInput.isTriggered();
        }
        return result;
    };

    const _Input_isRepeated = Input.isRepeated;
    Input.isRepeated = function(keyName) {
        const result = _Input_isRepeated.call(this, keyName);
        if (!result && keyName === 'ok') {
            return TouchInput.isRepeated();
        }
        return result;
    };

})();