/*:
 * @plugindesc Dodaje opcję wyłączającą wygładzanie (blur) grafiki i czcionek w ustawieniach.
 * @author GalaxyLIVAN
 *
 * @param OptionName
 * @text Nazwa opcji w menu
 * @desc Nazwa, która będzie wyświetlana w menu Opcji w grze.
 * @default Rozmycie
 *
 * @help
 * Plugin dodaje w ustawieniach gry nową opcję (domyślnie "Rozmycie").
 * - WŁĄCZONE (ON): Standardowe zachowanie RPG Maker MV (grafika rozmyta).
 * - WYŁĄCZONE (OFF): Tryb Pixel Perfect ostra grafika i tekst).
 * 
 */

(function() {
    // Pobranie parametrów pluginu
    var parameters = PluginManager.parameters('PixelFilterOption');
    var optionName = String(parameters['OptionName'] || 'Rozmycie');

    // Główna funkcja aplikująca ustawienia (uruchamiana przy starcie i zmianie w opcjach)
    function applySmoothingSettings(blurEnabled) {
        var mode = blurEnabled ? PIXI.SCALE_MODES.LINEAR : PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.SCALE_MODE = mode;

        // Aktualizacja już załadowanych tekstur w pamięci cache PIXI (dla czasu rzeczywistego)
        for (var key in PIXI.utils.BaseTextureCache) {
            var baseTexture = PIXI.utils.BaseTextureCache[key];
            if (baseTexture) {
                baseTexture.scaleMode = mode;
                baseTexture.update(); // Wymuszenie odświeżenia tekstury
            }
        }

        // Zmiana stylów CSS okna renderowania gry
        var canvas = document.getElementById('GameCanvas');
        if (canvas) {
            if (blurEnabled) {
                canvas.style.imageRendering = 'auto';
            } else {
                canvas.style.imageRendering = '-moz-crisp-edges';
                canvas.style.imageRendering = '-webkit-optimize-contrast';
                canvas.style.imageRendering = 'crisp-edges';
                canvas.style.imageRendering = 'pixelated';
            }
        }

        // Zmiana antyaliasingu czcionek na poziomie strony
        if (blurEnabled) {
            document.body.style.webkitFontSmoothing = 'auto';
            document.body.style.fontSmooth = 'auto';
        } else {
            document.body.style.webkitFontSmoothing = 'none';
            document.body.style.fontSmooth = 'never';
        }
    }

    // --- CONFIG MANAGER (Zapis i odczyt z pliku opcji config.rpgsave) ---
    ConfigManager.blurFilter = true; // Domyślnie rozmycie jest włączone (jak w czystym MV)

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.blurFilter = this.blurFilter;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.blurFilter = this.readFlag(config, 'blurFilter', true);
        applySmoothingSettings(this.blurFilter); // Zastosuj podczas uruchamiania gry
    };

    // --- WINDOW_OPTIONS (Dodanie przycisku do menu opcji) ---
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'blurFilter');
    };

    // Reakcja na zmianę opcji w czasie rzeczywistym
    var _Window_Options_changeValue = Window_Options.prototype.changeValue;
    Window_Options.prototype.changeValue = function(symbol, value) {
        _Window_Options_changeValue.call(this, symbol, value);
        if (symbol === 'blurFilter') {
            applySmoothingSettings(value);
        }
    };

    // --- BITMAP (Wymuszenie ostrości dla nowo tworzonych grafik i czcionek) ---
    var _Bitmap_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_initialize.call(this, width, height);
        this.smooth = ConfigManager.blurFilter;
    };

    var _Bitmap_drawText = Bitmap.prototype.drawText;
    Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
        if (this._context) {
            this._context.imageSmoothingEnabled = ConfigManager.blurFilter;
        }
        _Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align);
    };

})();