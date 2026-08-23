//----------------------------------------------------------------------------------------------------------------------
//ExitGame.js - Mobile Friendly Version (PL)
//----------------------------------------------------------------------------------------------------------------------
/*:
 * @plugindesc Dodaje przycisk wyjścia do menu głównego i menu w grze (Kompatybilny z Androidem).
 * @author Brian Howard (Zmodyfikowane dla poprawnego działania na Androidzie)
 *
 * @param ButtonText
 * @desc Tekst wyświetlany na przycisku wyjścia.
 * @default Wyjście z gry
 *
 * @help Aby użyć tego pluginu, umieść go w folderze js/plugins swojego projektu.
 */

(function() {

    var params = PluginManager.parameters('ExitGame');
    var sceneTitleWindow = Scene_Title.prototype.createCommandWindow;
    var windowTitleCommandList = Window_TitleCommand.prototype.makeCommandList;
    var sceneGameEndWindow = Scene_GameEnd.prototype.createCommandWindow;
    var windowGameEndCommandList = Window_GameEnd.prototype.makeCommandList;
    
    // Zmieniono domyślny fallback z 'Exit' na 'Wyjście z gry'
    var textExit = String(params['ButtonText'] || 'Wyjście z gry');

    // Funkcja zamykająca aplikację (naprawia czarny ekran na Androidzie)
    var performExit = function() {
        if (navigator.app && navigator.app.exitApp) {
            // Dla środowiska Cordova/Android
            navigator.app.exitApp();
        } else if (navigator.device && navigator.device.exitApp) {
            // Alternatywa dla innych środowisk mobilnych
            navigator.device.exitApp();
        } else {
            // Standardowe wyjście dla PC i fallback dla przeglądarek
            SceneManager.exit();
            if (window.close) window.close();
        }
    };

    //--- Menu Główne (Title Screen) ---
    Window_TitleCommand.prototype.makeCommandList = function() {
        windowTitleCommandList.call(this);
        this.addCommand(textExit, 'exitGame');
    };

    Scene_Title.prototype.createCommandWindow = function () {
        sceneTitleWindow.call(this);
        this._commandWindow.setHandler('exitGame', this.commandExitGame.bind(this));
    };
    
    Scene_Title.prototype.commandExitGame = function() {
        this._commandWindow.close();
        this.fadeOutAll();
        performExit();
    };

    //--- Menu w grze (Game End Screen) ---
    Window_GameEnd.prototype.makeCommandList = function() {
        windowGameEndCommandList.call(this);
        this.addCommand(textExit, 'exitGame');
    };

    Scene_GameEnd.prototype.createCommandWindow = function() {
        sceneGameEndWindow.call(this);
        this._commandWindow.setHandler('exitGame', this.commandExit.bind(this));
    };

    Scene_GameEnd.prototype.commandExit = function() {
        this.fadeOutAll();
        performExit();
    };
})();