/*: 
 * @plugindesc Dodaję opcję która dopasowywuje rozdzielczość do ekranu 
 * @author KYDSGAME (Plugin został nieco przerobiony przez GalaxyLIVANA)
 *
 * @param Option Name
 * @text Nazwa w opcjach
 * @default Dopasuj ekran
 */ 

(function() { 

    var parameters = PluginManager.parameters('AdaptToScreenSize');
    var optionName = String(parameters['Option Name'] || 'Dopasuj ekran');

    ConfigManager.adaptToScreen = true;

    // --- Logika Opcji ---
    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.adaptToScreen = this.readFlag(config, 'adaptToScreen');
        if (this.adaptToScreen === undefined) this.adaptToScreen = true;
    };

    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'adaptToScreen');
    };

    // --- Funkcja wymuszająca rozdzielczość ---
    function forceResolution() {
        var w = ConfigManager.adaptToScreen ? window.screen.width : 816;
        var h = ConfigManager.adaptToScreen ? window.screen.height : 624;
        if (Graphics.width !== w) {
            Graphics.width = w;
            Graphics.height = h;
            Graphics.boxWidth = w;
            Graphics.boxHeight = h;
            if (Graphics._renderer) Graphics._renderer.resize(w, h);
            Graphics._updateAllElements();
        }
    }

    // --- WYMUSZONE ROZCIĄGANIE (STRETCH) TŁA ---
    var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        if (ConfigManager.adaptToScreen) {
            [this._back1Sprite, this._back2Sprite].forEach(function(sprite) {
                if (sprite && sprite.bitmap && sprite.bitmap.isReady()) {
                    sprite.origin.x = 0;
                    sprite.origin.y = 0;
                    sprite.scale.x = Graphics.width / sprite.bitmap.width;
                    sprite.scale.y = Graphics.height / sprite.bitmap.height;
                }
            });
        }
    };

    // --- TOTALNE CENTROWANIE WROGÓW (FORMACJA) ---
    var _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        if (ConfigManager.adaptToScreen) {
            var enemies = $gameTroop.members();
            var count = enemies.length;
            var spacing = 160; 
            var totalWidth = (count - 1) * spacing;
            var startX = (Graphics.width / 2) - (totalWidth / 2);

            enemies.forEach(function(enemy, index) {
                // Wymuszamy pozycję bezpośrednio w parametrach obiektu
                enemy._screenX = startX + (index * spacing);
                enemy._screenY = Graphics.height / 2 + 60; // Środek pionowy + lekki offset pod tekst
            });
        }
    };

    // Zapobieganie przesunięciom przez silnik
    Game_Enemy.prototype.screenX = function() { return this._screenX || 0; };
    Game_Enemy.prototype.screenY = function() { return this._screenY || 0; };

    // --- EKRAN TYTUŁOWY (STRETCH) ---
    var _Scene_Title_update = Scene_Title.prototype.update;
    Scene_Title.prototype.update = function() {
        _Scene_Title_update.update ? _Scene_Title_update.update.call(this) : _Scene_Title_update.call(this);
        forceResolution(); // Sprawdzamy rozdzielczość przy każdej klatce tytułu
        if (ConfigManager.adaptToScreen && this._backSprite1) {
            var s1 = this._backSprite1;
            var s2 = this._backSprite2;
            if (s1.bitmap.isReady()) {
                s1.scale.x = Graphics.width / s1.bitmap.width;
                s1.scale.y = Graphics.height / s1.bitmap.height;
            }
            if (s2 && s2.bitmap.isReady()) {
                s2.scale.x = Graphics.width / s2.bitmap.width;
                s2.scale.y = Graphics.height / s2.bitmap.height;
            }
        }
    };

    // Aktualizacja przy zmianie opcji
    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        _Window_Options_setConfigValue.call(this, symbol, value);
        if (symbol === 'adaptToScreen') forceResolution();
    };

})();