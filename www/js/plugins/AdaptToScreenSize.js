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

    // --- System Opcji ---
    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.adaptToScreen = this.adaptToScreen;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        var f = this.readFlag(config, 'adaptToScreen');
        this.adaptToScreen = (f !== undefined) ? f : true;
    };

    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'adaptToScreen');
    };

    // --- Zarządzanie Rozdzielczością ---
    SceneManager.applySelectedResolution = function() {
        var targetW = ConfigManager.adaptToScreen ? window.screen.width : 816;
        var targetH = ConfigManager.adaptToScreen ? window.screen.height : 624;

        Graphics.width = targetW;
        Graphics.height = targetH;
        Graphics.boxWidth = targetW; 
        Graphics.boxHeight = targetH; 
        
        if (Graphics._renderer) Graphics._renderer.resize(targetW, targetH); 
        Graphics._updateAllElements(); 

        if (SceneManager._scene) {
            SceneManager.goto(SceneManager._scene.constructor);
        }
    };

    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        var lastValue = ConfigManager[symbol];
        _Window_Options_setConfigValue.call(this, symbol, value);
        if (symbol === 'adaptToScreen' && lastValue !== value) {
            SceneManager.applySelectedResolution();
        }
    };

    // --- WYMUSZENIE ROZCIĄGANIA TŁA (BATTLEBACK) ---
    // Nadpisujemy funkcję lokalizacji, aby ignorowała kafelkowanie
    Spriteset_Battle.prototype.locateBattleback = function() {
        var width = Graphics.width;
        var height = Graphics.height;
        var sprite1 = this._back1Sprite;
        var sprite2 = this._back2Sprite;

        if (ConfigManager.adaptToScreen) {
            [sprite1, sprite2].forEach(function(sprite) {
                if (sprite && sprite.bitmap && sprite.bitmap.isReady()) {
                    sprite.origin.x = 0;
                    sprite.origin.y = 0;
                    sprite.x = 0;
                    sprite.y = 0;
                    // Wymuszamy skalowanie tła do pełnego ekranu
                    sprite.scale.x = width / sprite.bitmap.width;
                    sprite.scale.y = height / sprite.bitmap.height;
                }
            });
        } else {
            // Powrót do standardu jeśli opcja wyłączona
            sprite1.scale.x = 1;
            sprite1.scale.y = 1;
            sprite2.scale.x = 1;
            sprite2.scale.y = 1;
        }
    };

    // --- WYMUSZENIE CENTROWANIA WROGÓW ---
    // Nadpisujemy właściwość screenX w silniku gry
    var _Game_Enemy_screenX = Game_Enemy.prototype.screenX;
    Game_Enemy.prototype.screenX = function() {
        var x = _Game_Enemy_screenX.call(this);
        if (ConfigManager.adaptToScreen) {
            // Obliczamy różnicę między standardem (816) a obecnym ekranem
            var offset = (Graphics.width - 816) / 2;
            return x + offset;
        }
        return x;
    };

    // --- EKRAN TYTUŁOWY I OBRAZY ---
    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        if (ConfigManager.adaptToScreen) {
            var width = Graphics.width;
            var height = Graphics.height;
            [this._backSprite1, this._backSprite2].forEach(function(sprite) {
                if (sprite) {
                    sprite.bitmap.addLoadListener(function() {
                        sprite.scale.x = width / sprite.bitmap.width;
                        sprite.scale.y = height / sprite.bitmap.height;
                    });
                }
            });
        }
    };

    var _Sprite_Picture_update = Sprite_Picture.prototype.update;
    Sprite_Picture.prototype.update = function() {
        _Sprite_Picture_update.call(this);
        if (ConfigManager.adaptToScreen && this.bitmap && this.bitmap.width >= 800) {
            this.scale.x = Graphics.width / this.bitmap.width;
            this.scale.y = Graphics.height / this.bitmap.height;
            this.x = Graphics.width / 2;
            this.y = Graphics.height / 2;
            this.anchor.set(0.5, 0.5);
        }
    };

})();