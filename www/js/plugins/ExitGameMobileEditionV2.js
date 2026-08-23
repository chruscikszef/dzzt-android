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

    var textExit = String(params['ButtonText'] || 'Wyjście z gry');

    var tryExitApp = function() {
        try {
            if (window.cordova && navigator.app && navigator.app.exitApp) {
                navigator.app.exitApp();
                return;
            }
            if (window.cordova && navigator.device && navigator.device.exitApp) {
                navigator.device.exitApp();
                return;
            }
            SceneManager.terminate();
            window.location.href = "about:blank";
        } catch (e) {}
    };

    var performExit = function() {
        AudioManager.stopAll();
        SceneManager.goto(Scene_Title);
        setTimeout(function() {
            tryExitApp();
        }, 50);
    };

    Window_TitleCommand.prototype.makeCommandList = function() {
        windowTitleCommandList.call(this);
        this.addCommand(textExit, 'exitGame', true);
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

    Window_GameEnd.prototype.makeCommandList = function() {
        windowGameEndCommandList.call(this);
        this.addCommand(textExit, 'exitGame', true);
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