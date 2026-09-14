/*:
 * @plugindesc [MV] Dodaje dotykowe guziki które ułatwiają sterowanie dotykowe
 * @author GalaxyLIVAN
 *
 * @param Option Name
 * @text Nazwa w Opcjach
 * @desc Jak ma się nazywać przełącznik w menu opcji?
 * @default Przyciski Dotykowe
 *
 * @help
 * Plugin tworzy element HTML (Touch UI).
 * - Ukrywa się automatycznie podczas walki, filmów, dialogów, 
 *   ekranu śmierci, ekranów tytułowych oraz wydarzeń typu autorun/cutscenek.
 * - Można go wyłączyć w Opcjach (opcja: Przyciski Dotykowe).
 * - Domyślnie włączony.
 */

(function() {
    'use strict';

    // Odczyt parametrów z uwzględnieniem nazwy pliku
    const pluginName = document.currentScript ? document.currentScript.src.split('/').pop().replace(/\.js$/, '') : 'DotykoweGuzikiV2';
    const params = PluginManager.parameters(pluginName) || PluginManager.parameters('DotykoweGuzikiV2') || PluginManager.parameters('Livan_TouchUI_Options') || {};
    const optionName = String(params['Option Name'] || "Przyciski Dotykowe");

    // --- REJESTRACJA W CONFIGMANAGER ---
    ConfigManager.livanTouchVisible = true;

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.livanTouchVisible = this.livanTouchVisible;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        if (config['livanTouchVisible'] === undefined) {
            this.livanTouchVisible = true;
        } else {
            this.livanTouchVisible = this.readFlag(config, 'livanTouchVisible');
        }
    };

    // --- DODANIE DO MENU OPCJI (Odporne na inne pluginy) ---
    Window_Options.prototype.addLivanTouchOption = function() {
        if (!this._list.some(cmd => cmd.symbol === 'livanTouchVisible')) {
            this.addCommand(optionName, 'livanTouchVisible');
        }
    };

    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addLivanTouchOption();
    };

    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        if (_Window_Options_addGeneralOptions) {
            _Window_Options_addGeneralOptions.call(this);
        }
        this.addLivanTouchOption();
    };

    // --- POMOCNICZA FUNKCJA SPRAWDZANIA WIDEO ---
    function isVideoPlaying() {
        if (typeof Graphics._isVideoVisible === 'function') {
            return Graphics._isVideoVisible();
        }
        return !!(Graphics._video && !Graphics._video.paused && Graphics._video.style.display !== 'none');
    }

    // --- LOGIKA PRZYCISKU ---
    function Livan_Manager() {
        this._el = null;
    }

    Livan_Manager.init = function() {
        if (this._el) return;

        this._el = document.createElement('div');
        this._el.id = 'livan-touch-global';
        
        const s = this._el.style;
        s.position = 'absolute';
        s.zIndex = '10000';
        s.cursor = 'pointer';
        s.backgroundImage = "url('img/system/ButtonSet.png')";
        s.backgroundRepeat = 'no-repeat';
        s.backgroundSize = 'auto';
        s.display = 'none';

        this._el.onclick = (e) => {
            e.preventDefault();
            const scene = SceneManager._scene;
            if (!scene) return;
            if (scene instanceof Scene_Map) {
                SoundManager.playOk();
                SceneManager.push(Scene_Menu);
            } else {
                SoundManager.playCancel();
                SceneManager.pop();
            }
        };

        document.body.appendChild(this._el);
    };

    Livan_Manager.update = function() {
        // Zabezpieczenie na przypadek pominięcia Scene_Boot
        if (!this._el) {
            this.init();
        }
        if (!this._el) return;

        const scene = SceneManager._scene;
        
        const isBattle = scene instanceof Scene_Battle;
        const isGameOver = scene instanceof Scene_Gameover; 
        const isForbiddenScene = !scene || scene instanceof Scene_Title || scene instanceof Scene_Boot || isBattle || isGameOver;
        
        let isMapEventActive = false;
        const playingVideo = isVideoPlaying();
        
        if (scene instanceof Scene_Map && $gameMap && $gameMessage) {
            // Blokuje button przy aktywnym wydarzeniu (Autorun, rozmowa itp.) lub gdy otwarte jest okno tekstu
            isMapEventActive = $gameMap.isEventRunning() || $gameMessage.isBusy();
        }

        // Ukryj jeśli spełniony jest którykolwiek z warunków
        if (isForbiddenScene || !ConfigManager.livanTouchVisible || isMapEventActive || playingVideo) {
            this._el.style.display = 'none';
            return;
        }

        const s = this._el.style;
        s.display = 'block';
        s.top = '15px';
        s.right = '15px';
        s.height = '48px';

        if (scene instanceof Scene_Map) {
            s.width = '48px';
            s.backgroundPosition = 'right top'; 
        } else {
            s.width = '96px';
            s.backgroundPosition = 'left top';
        }
    };

    // --- HOOKI ---
    const _Scene_Boot_create = Scene_Boot.prototype.create;
    Scene_Boot.prototype.create = function() {
        _Scene_Boot_create.call(this);
        Livan_Manager.init();
    };

    const _Scene_Base_update = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        _Scene_Base_update.call(this);
        Livan_Manager.update();
    };

})();