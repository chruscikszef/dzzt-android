/*: 
 * @plugindesc Plugin dodaje dwie opcje dopasowania sobie ekranu i rozdzielczości (opcja: dopasuj ekran oraz opcja: Proporcje 16:9)
 * @author GalaxyLIVAN, KYDSGAME
 *
 * @param NameAdapt
 * @text Nazwa: Dopasuj ekran
 * @default Dopasuj ekran (fun. testowa)
 *
 * @param Name169
 * @text Nazwa: Tryb 16:9
 * @default Proporcje 16:9
 */ 

(function() { 

    var params = PluginManager.parameters('TekLag_ScreenManager');
    var nameAdapt = String(params['NameAdapt'] || 'Dopasuj ekran (fun. testowa)');
    var name169 = String(params['Name169'] || 'Proporcje 16:9');

    // --- 1. Konfiguracja ---
    ConfigManager.adaptToScreen = false;
    ConfigManager.mobileWide = false;

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.adaptToScreen = this.adaptToScreen;
        config.mobileWide = this.mobileWide;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.adaptToScreen = this.readFlag(config, 'adaptToScreen');
        this.mobileWide = this.readFlag(config, 'mobileWide');
    };

    // --- 2. Zarządzanie Menu Opcji (Poprawione Enter/Dotyk) ---
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(nameAdapt, 'adaptToScreen');
        this.addCommand(name169, 'mobileWide');
    };

    Window_Options.prototype.isCommandEnabled = function(index) {
        var symbol = this.commandSymbol(index);
        if (symbol === 'adaptToScreen' && ConfigManager.mobileWide) return false;
        if (symbol === 'mobileWide' && ConfigManager.adaptToScreen) return false;
        return true;
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        if (this.isCommandEnabled(index)) {
            _Window_Options_processOk.call(this);
        } else {
            SoundManager.playBuzzer();
        }
    };

    var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        if (this.isCommandEnabled(this.index())) _Window_Options_cursorRight.call(this, wrap);
    };

    var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        if (this.isCommandEnabled(this.index())) _Window_Options_cursorLeft.call(this, wrap);
    };

    var _Window_Options_drawItem = Window_Options.prototype.drawItem;
    Window_Options.prototype.drawItem = function(index) {
        this.changePaintOpacity(this.isCommandEnabled(index));
        _Window_Options_drawItem.call(this, index);
        this.changePaintOpacity(true);
    };

    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        _Window_Options_setConfigValue.call(this, symbol, value);
        if (symbol === 'adaptToScreen' || symbol === 'mobileWide') {
            this.refresh();
            applyResolution();
        }
    };

    // --- 3. Logika Rozdzielczości i Skalowania Tła ---
    function applyResolution() {
        var w = 816;
        var h = 624;

        if (ConfigManager.adaptToScreen) {
            w = window.innerWidth || window.screen.width;
            h = window.innerHeight || window.screen.height;
        } else if (ConfigManager.mobileWide) {
            w = 1104; 
            h = 621;  
        }

        if (Graphics.width !== w || Graphics.height !== h) {
            Graphics.width = w;
            Graphics.height = h;
            Graphics.boxWidth = w; 
            Graphics.boxHeight = h; 
            if (Graphics._renderer) Graphics._renderer.resize(w, h);
            Graphics._updateAllElements();
            recenterUI();
        }
    }

    function recenterUI() {
        var scene = SceneManager._scene;
        if (scene && scene._windowLayer) {
            scene._windowLayer.children.forEach(function(win) {
                if (win instanceof Window) win.x = (Graphics.boxWidth - win.width) / 2;
            });
        }
    }

    function fitBackground(sprite) {
        if (sprite && sprite.bitmap && sprite.bitmap.isReady()) {
            var ratioX = Graphics.width / sprite.bitmap.width;
            var ratioY = Graphics.height / sprite.bitmap.height;
            var scale = Math.max(ratioX, ratioY); 
            
            sprite.scale.x = scale;
            sprite.scale.y = scale;
            sprite.anchor.set(0.5, 0.5);
            sprite.x = Graphics.width / 2;
            sprite.y = Graphics.height / 2;
        } else if (sprite && sprite.bitmap) {
            sprite.bitmap.addLoadListener(function() { fitBackground(sprite); });
        }
    }

    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        fitBackground(this._backSprite1);
        fitBackground(this._backSprite2);
    };

    var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
            fitBackground(this._back1Sprite);
            fitBackground(this._back2Sprite);
        }
    };

    var _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        applyResolution();
    };

})();