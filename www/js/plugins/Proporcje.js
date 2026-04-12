/*:
 * @plugindesc [v1.2] Dodaje opcję zmiany proporcji ekranu na 16:9 
 * @author GalaxyLIVAN
 *
 * @help
 * Plugin od GalaxyLIVAN.
 * Nazwa opcji została ustawiona na: Proporcje 16:9 (funkcja testowa).
 * Nie wymaga konfigurowania parametrów w managerze.
 */

(function() {
    // Nazwa ustawiona bezpośrednio w kodzie, aby uniknąć problemów z managerem
    const optionName = "Proporcje 16:9 (funkcja testowa)";

    // 1. Dodanie opcji do menu
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'mobileWide');
    };

    // 2. Zarządzanie konfiguracją (zapisywanie ustawienia gracza)
    ConfigManager.mobileWide = false;

    const _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        const config = _ConfigManager_makeData.call(this);
        config.mobileWide = this.mobileWide;
        return config;
    };

    const _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.mobileWide = this.readFlag(config, 'mobileWide');
    };

    // 3. Logika zmiany rozdzielczości
    function applyResolution() {
        if (!Graphics || !SceneManager) return;

        // Tryb panoramiczny: 1104x621 | Tryb standardowy: 816x624
        const width = ConfigManager.mobileWide ? 1104 : 816;
        const height = ConfigManager.mobileWide ? 621 : 624;

        if (Graphics.width !== width || Graphics.height !== height) {
            Graphics.width = width;
            Graphics.height = height;
            Graphics.boxWidth = width;
            Graphics.boxHeight = height;
            
            // Odświeżenie sceny, aby przeliczyć pozycje okien UI
            if (SceneManager._scene && SceneManager._scene.start) {
                SceneManager._scene.start();
            }
        }
    }

    // Sprawdzanie rozdzielczości przy starcie każdej sceny
    const _Scene_Base_start = Scene_Base.prototype.start;
    Scene_Base.prototype.start = function() {
        _Scene_Base_start.call(this);
        applyResolution();
    };

    // Reakcja na kliknięcie w menu opcji
    const _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        _Window_Options_setConfigValue.call(this, symbol, value);
        if (symbol === 'mobileWide') {
            applyResolution();
        }
    };

})();