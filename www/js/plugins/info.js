//=============================================================================
// Informacje o Grze (MV)
//=============================================================================
/*:
 * @plugindesc Dodaje przycisk w ustawieniach, który wyświetla informacje o grze. (MV Version)
 * @author GalaxyLIVAN
 *
 * @help
 * Ten plugin dodaje przycisk w zakładce Ustawienia, który wyświetla
 * okno z informacjami o grze.
 */

(function() {
    // Dodajemy nową komendę do listy opcji
    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand('Informacje o grze', 'info_button', true);
    };

    // Obsługujemy kliknięcie przycisku "Informacje o grze"
    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.setHandler('info_button', this.commandInfoButton.bind(this));
    };

    Scene_Options.prototype.commandInfoButton = function() {
        SceneManager.push(Scene_Info);
    };

    // Tworzymy nową scenę z informacjami
    function Scene_Info() {
        this.initialize.apply(this, arguments);
    }

    Scene_Info.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Info.prototype.constructor = Scene_Info;

    Scene_Info.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Info.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        var text = "Dzień z Życia TekLaga - Wersja 3.0.0\nTwórcy Gry:\n Szef projektu: enotekk\n Muzyka: Wopsiak i Im5hadow\n Grafiki: Demencja, Lula, Kassper\n Korekta: Karambito\n \nSpecjalne podziękowania dla GalaxyLIVANA\nza pomoc z pluginami.\n\nSterowanie:\n\nRuch: strzałki lub mysz\nInterakcja: spacja, enter lub Z\nMenu/Powrót: ESC lub X\n\nMiłej Gry!";
        
        this._infoWindow = new Window_Base(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._infoWindow.drawTextEx(text, 10, 10);
        this.addWindow(this._infoWindow);
    };

    Scene_Info.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
            SceneManager.pop();
        }
    };

    // Ukrywamy status on/off dla przycisku "Informacje o grze"
    var _Window_Options_drawItem = Window_Options.prototype.drawItem;
    Window_Options.prototype.drawItem = function(index) {
        var symbol = this.commandSymbol(index);
        if (symbol === 'info_button') {
            var rect = this.itemRectForText(index);
            this.resetTextColor();
            this.changePaintOpacity(this.isCommandEnabled(index));
            this.drawText(this.commandName(index), rect.x, rect.y, rect.width, 'left');
        } else {
            _Window_Options_drawItem.call(this, index);
        }
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(symbol) {
        if (symbol === 'info_button') {
            return '';
        }
        return _Window_Options_statusText.call(this, symbol);
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (this.commandSymbol(this.index()) === 'info_button') {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callHandler('info_button');
        } else {
            _Window_Options_processOk.call(this);
        }
    };
})();
