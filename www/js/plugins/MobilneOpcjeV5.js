/*: 
 * @plugindesc Plugin dodaje dwie opcje dopasowania ekranu (Dopasuj ekran / 16:9) z automatycznym skalowaniem teł, centrowaniem przeciwników, obrazków oraz ekranów końcowych.
 * @author GalaxyLIVAN
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

    // --- 2. Zarządzanie Menu Opcji ---
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

    function getScaleRatio() {
        var ratioX = Graphics.width / 816;
        var ratioY = Graphics.height / 624;
        return Math.max(ratioX, ratioY, 1.0); 
    }

    function fitStaticBackground(sprite) {
        if (sprite && sprite.bitmap && sprite.bitmap.isReady()) {
            var scale = getScaleRatio();
            sprite.scale.x = scale;
            sprite.scale.y = scale;
            sprite.anchor.set(0.5, 0.5);
            sprite.x = Graphics.width / 2;
            sprite.y = Graphics.height / 2;
        } else if (sprite && sprite.bitmap) {
            sprite.bitmap.addLoadListener(function() { fitStaticBackground(sprite); });
        }
    }

    var _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        fitStaticBackground(this._backSprite1);
        fitStaticBackground(this._backSprite2);
    };

    function scaleBattleback(sprite) {
        if (!sprite || !sprite.bitmap || !sprite.bitmap.isReady()) return;
        var scale = getScaleRatio();
        
        sprite.tileScale.x = scale;
        sprite.tileScale.y = scale;
        
        sprite.origin.x = (sprite.bitmap.width - Graphics.width / scale) / 2;
        if ($gameSystem.isSideView()) {
            sprite.origin.y = sprite.bitmap.height - Graphics.height / scale;
        } else {
            sprite.origin.y = (sprite.bitmap.height - Graphics.height / scale) / 2;
        }
    }

    var _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function() {
        _Spriteset_Battle_update.call(this);
        if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
            scaleBattleback(this._back1Sprite);
            scaleBattleback(this._back2Sprite);
        }
    };

    var _Spriteset_Map_updateParallax = Spriteset_Map.prototype.updateParallax;
    Spriteset_Map.prototype.updateParallax = function() {
        _Spriteset_Map_updateParallax.call(this);
        if (this._parallax && this._parallax.bitmap && this._parallax.bitmap.isReady()) {
            if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
                var scale = getScaleRatio();
                this._parallax.tileScale.x = scale;
                this._parallax.tileScale.y = scale;
                
                this._parallax.origin.x = $gameMap.parallaxOx() / scale;
                this._parallax.origin.y = $gameMap.parallaxOy() / scale;
            }
        }
    };

    // --- 3.1. Poprawka pozycji i skalowania obrazków (Show Picture) ---
    var _Sprite_Picture_updatePosition = Sprite_Picture.prototype.updatePosition;
    Sprite_Picture.prototype.updatePosition = function() {
        _Sprite_Picture_updatePosition.call(this);
        var picture = this.picture();
        if (picture) {
            if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
                var baseX = picture.x();
                var baseY = picture.y();
                
                var offsetX = (Graphics.boxWidth - 816) / 2;
                var offsetY = (Graphics.boxHeight - 624) / 2;
                
                this.x = baseX + offsetX;
                this.y = baseY + offsetY;
            }
        }
    };

    var _Sprite_Picture_updateScale = Sprite_Picture.prototype.updateScale;
    Sprite_Picture.prototype.updateScale = function() {
        _Sprite_Picture_updateScale.call(this);
        var picture = this.picture();
        if (picture && this.bitmap && this.bitmap.isReady()) {
            if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
                if (this.bitmap.width >= 800) {
                    var scale = getScaleRatio();
                    this.scale.x = (picture.scaleX() / 100) * scale;
                    this.scale.y = (picture.scaleY() / 100) * scale;
                }
            }
        }
    };

    var _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        applyResolution();
    };

    // --- 4. Skalowanie Pozycji Przeciwników ---
    var _Game_Enemy_screenX = Game_Enemy.prototype.screenX;
    Game_Enemy.prototype.screenX = function() {
        var x = _Game_Enemy_screenX.call(this);
        if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
            x += (Graphics.boxWidth - 816) / 2;
        }
        return x;
    };

    var _Game_Enemy_screenY = Game_Enemy.prototype.screenY;
    Game_Enemy.prototype.screenY = function() {
        var y = _Game_Enemy_screenY.call(this);
        if (ConfigManager.adaptToScreen || ConfigManager.mobileWide) {
            if ($gameSystem.isSideView()) {
                y += (Graphics.boxHeight - 624);
            } else {
                y += (Graphics.boxHeight - 624) / 2;
            }
        }
        return y;
    };

    // --- 5. Skalowanie ekranów GameOver i MadeWithMv ---
    
    // Wymuszenie centrowania ekranu GameOver
    var _Scene_Gameover_start = Scene_Gameover.prototype.start;
    Scene_Gameover.prototype.start = function() {
        _Scene_Gameover_start.call(this);
        if (this._backSprite && (ConfigManager.adaptToScreen || ConfigManager.mobileWide)) {
            var scale = getScaleRatio();
            this._backSprite.scale.x = scale;
            this._backSprite.scale.y = scale;
            this._backSprite.anchor.set(0.5, 0.5);
            this._backSprite.x = Graphics.width / 2;
            this._backSprite.y = Graphics.height / 2;
        }
    };

    // Wymuszenie centrowania ekranu ładującego z pluginu MadeWithMv
    if (typeof Scene_Splash !== 'undefined') {
        var _Scene_Splash_start = Scene_Splash.prototype.start;
        Scene_Splash.prototype.start = function() {
            _Scene_Splash_start.call(this);
            if (this._sprite && (ConfigManager.adaptToScreen || ConfigManager.mobileWide)) {
                var scale = getScaleRatio();
                this._sprite.scale.x = scale;
                this._sprite.scale.y = scale;
                this._sprite.anchor.set(0.5, 0.5);
                this._sprite.x = Graphics.width / 2;
                this._sprite.y = Graphics.height / 2;
            }
        };
    }

})();