/*:
 * @plugindesc Naprawiony rebind menu — ESC i X NIE otwierają menu, C otwiera menu. Kompatybilny z pluginem wyłączania gry. 
 * @author enotekk
 *
 * @help
 * ESC — nadal działa dla pluginów (np. wyłączanie gry), ale NIE otwiera menu
 * X  — nie otwiera menu
 * C  — jedyny klawisz otwierający menu
 */

(function() {

    //--------------------------------------------------------
    // 1. Przywracamy pełny sygnał ESC (27) → 'escape'
    //--------------------------------------------------------
    Input.keyMapper[27] = 'escape'; 
    // Uwaga: w MV 'escape' NIE JEST równoznaczne z 'cancel'
    // dlatego Twój plugin od wyłączania gry będzie działać!

    //--------------------------------------------------------
    // 2. Usuwamy X (kod 88) z "cancel"
    //--------------------------------------------------------
    // Domyślnie X = 'escape', więc menu go używa → blokujemy
    delete Input.keyMapper[88];

    //--------------------------------------------------------
    // 3. Usuwamy ESC z funkcji otwierania menu,
    //    ale NIE blokujemy jego sygnału
    //--------------------------------------------------------
    const _Scene_Map_isMenuCalled = Scene_Map.prototype.isMenuCalled;
    Scene_Map.prototype.isMenuCalled = function() {

        // ZABLOKUJ otwieranie menu przez "cancel"
        // ale NIE ingeruj w Input.isPressed('escape')
        if (Input.isTriggered('cancel')) return false;

        return _Scene_Map_isMenuCalled.call(this);
    };

    //--------------------------------------------------------
    // 4. Dodajemy klawisz C jako jedyny otwierający menu
    //--------------------------------------------------------
    Input.keyMapper[67] = 'menuCallC'; // klawisz C jako osobny sygnał

    const _Scene_Map_updateCallMenu = Scene_Map.prototype.updateCallMenu;
    Scene_Map.prototype.updateCallMenu = function() {
        _Scene_Map_updateCallMenu.call(this);

        if (Input.isTriggered('menuCallC')) {
            this.callMenu();
        }
    };

})();
