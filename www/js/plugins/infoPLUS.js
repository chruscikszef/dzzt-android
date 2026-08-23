//=============================================================================
// Informacje o Grze (MV) - Wersja PLUS
//=============================================================================
/*:
 * @plugindesc Dodaje przycisk w ustawieniach z informacjami o grze (z możliwością przewijania scrollem lub paluchem :ilikeit:)
 * @author GalaxyLIVAN
 */

(function() {
    var _optSymbol = 'info_button';

    // --- Logika Menu Opcji ---
    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand('Informacje o grze', _optSymbol, true);
    };

    // Usunięcie napisu ON/OFF
    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        if (symbol === _optSymbol) return '';
        return _Window_Options_statusText.call(this, index);
    };

    // Poprawiona obsługa kliknięcia
    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === _optSymbol) {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callHandler(_optSymbol);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    var _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.setHandler(_optSymbol, this.commandInfoButton.bind(this));
    };

    Scene_Options.prototype.commandInfoButton = function() {
        SceneManager.push(Scene_Info);
    };

    // --- Scena Informacji ---
    function Scene_Info() { this.initialize.apply(this, arguments); }
    Scene_Info.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Info.prototype.constructor = Scene_Info;

    Scene_Info.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._infoWindow = new Window_InfoScroll();
        this.addWindow(this._infoWindow);
    };

    Scene_Info.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (Input.isTriggered("cancel") || TouchInput.isCancelled()) {
            SoundManager.playCancel();
            SceneManager.pop();
        }
    };

    // --- Okno Przewijania ---
    function Window_InfoScroll() { this.initialize.apply(this, arguments); }
    Window_InfoScroll.prototype = Object.create(Window_Selectable.prototype);
    Window_InfoScroll.prototype.constructor = Window_InfoScroll;

    Window_InfoScroll.prototype.initialize = function() {
        // NAPRAWIONY TEKST (Dodane brakujące cudzysłowy i plusy)
        this._fullText = "Dzień z Życia Teklaga - Wersja 3.0.0 (Wersja Android 2.0) \n\n" +
                         "Twórcy Gry:\n" +
                         " Główny Twórca: enotekk\n" +
                         " Grafiki: Demencja, Lula, Kassper\n" +
						 " Korekta: Karambito\n" +
                         " Twórcy mobilnego portu: Chruscik1, GalaxyLIVAN\n" +
                         " Muzykę stworzył: Wopsiak oraz Im5hadow\n\n" +
                         "Voice Aktorzy:\n Feles, Kassper, Karambito\n\n" +
                         "Letimotywy:\n Toby Fox, George Buzinkai\n\n" +
                         "Autorzy pluginów:\n GalaxyLIVAN, KYDSGAME, Brian Howard, enotekk\n\n" +
                         "Sterowanie: Dotykowe, wejście do menu poprzez guzik lub\n" +
                         "poprzez dwukrotne stuknięcie palcem (tak samo powrót)\n\n" +
                         "Zmiany w Wersji Android 2.0:\n" +
                         " - Zaaktualizowano wersję gry w porcie\n" +
						 " - Poprawiono działanie funkcji 16:9 i dopasowania ekranu\n" +
						 " - Dodano opcję dotyczącą rozmycia ekranu\n" +
						 " - Naprawiono parę błędów\n" +
                         "I to by było narazie na tyle!\n\n" +
                         "Miłej Gry!";

        Window_Selectable.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this.refresh();
        this.activate();
    };

    Window_InfoScroll.prototype.contentsHeight = function() {
        if (!this._fullText) return Graphics.boxHeight;
        var lineCount = this._fullText.split('\n').length;
        return Math.max((lineCount * this.lineHeight()) + 80, Graphics.boxHeight);
    };

    Window_InfoScroll.prototype.refresh = function() {
        this.contents.clear();
        this.drawTextEx(this._fullText, 20, 20);
    };

    Window_InfoScroll.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.processWheel();
        this.processTouchScroll();
    };

    Window_InfoScroll.prototype.processWheel = function() {
        if (TouchInput.wheelY !== 0) {
            this.origin.y += TouchInput.wheelY / 2;
            this.clampScroll();
        }
    };

    Window_InfoScroll.prototype.processTouchScroll = function() {
        if (TouchInput.isPressed()) {
            if (this._lastY !== undefined) {
                this.origin.y += (this._lastY - TouchInput.y);
                this.clampScroll();
            }
            this._lastY = TouchInput.y;
        } else {
            this._lastY = undefined;
        }
    };

    Window_InfoScroll.prototype.clampScroll = function() {
        var maxScroll = this.contentsHeight() - this.height;
        if (this.origin.y < 0) this.origin.y = 0;
        if (this.origin.y > maxScroll) this.origin.y = maxScroll;
    };
})();