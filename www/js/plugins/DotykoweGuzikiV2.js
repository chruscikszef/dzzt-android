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
 * - Ukrywa się automatycznie podczas walki.
 * - Można go wyłączyć w Opcjach (opcja: Przyciski Dotykowe).
 * - Domyślnie włączony.
 */

(function() {
    'use strict';

    const params = PluginManager.parameters('Livan_TouchUI_Options') || {};
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

    // --- DODANIE DO MENU OPCJI ---
    const _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(optionName, 'livanTouchVisible');
    };

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
        const scene = SceneManager._scene;
        
        const isBattle = scene instanceof Scene_Battle;
        const isForbiddenScene = scene instanceof Scene_Title || scene instanceof Scene_Boot || isBattle;
        
        if (!scene || isForbiddenScene || !ConfigManager.livanTouchVisible) {
            if (this._el) this._el.style.display = 'none';
            return;
        }

        if (this._el) {
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