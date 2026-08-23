/*:
 * @target MV
 * @plugindesc Skaluje i naprawia tła walki (battlebacks) pod rozdzielczość gry.
 * @author GalaxyLIVAN
 *
 * @param ScaleMode
 * @text Tryb skalowania
 * @desc Wybierz w jaki sposób tło ma wypełniać ekran.
 * @type select
 * @option Dopasuj i zachowaj proporcje (Cover)
 * @value cover
 * @option Rozciągnij na cały ekran (Stretch)
 * @value stretch
 * @default cover
 *
 * @help
 * Plugin automatycznie rozwiązuje problem uciętych lub 
 * niepełnych teł walki (battlebacks) po zwiększeniu rozdzielczości gry.
 *
 * Ustawienia (Tryby):
 * - Cover (Domyślny): Powiększa tło tak, aby wypełniło cały ekran,
 *   zachowując przy tym oryginalne proporcje obrazka. Odcina to co wystaje.
 * - Stretch: Rozciąga obrazek niezależnie w pionie i poziomie,
 *   aby dokładnie pasował do okna gry. Może lekko zniekształcić grafikę.
 */

(() => {
    // Próba automatycznego pobrania nazwy pliku pluginu (aby parametry działały przy zmianie nazwy)
    let pluginName = "FixBattlebackScale";
    let parameters = PluginManager.parameters(pluginName);
    
    if (Object.keys(parameters).length === 0) {
        const scriptElements = document.currentScript || (function() {
            const scripts = document.getElementsByTagName('script');
            return scripts[scripts.length - 1];
        })();
        if (scriptElements && scriptElements.src) {
            const url = scriptElements.src;
            pluginName = decodeURIComponent(url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.')));
            parameters = PluginManager.parameters(pluginName);
        }
    }

    const scaleMode = parameters['ScaleMode'] || 'cover';

    const _Sprite_Battleback_adjustPositionAndScale = Sprite_Battleback.prototype.adjustPositionAndScale;
    Sprite_Battleback.prototype.adjustPositionAndScale = function() {
        // Zatrzymujemy domyślną funkcję i nadpisujemy ją całkowicie
        if (!this.bitmap || !this.bitmap.isReady()) return;

        const screenW = Graphics.width;
        const screenH = Graphics.height;
        const bmpW = this.bitmap.width;
        const bmpH = this.bitmap.height;

        if (bmpW === 0 || bmpH === 0) return;

        // Obliczamy wymagane proporcje
        const scaleX = screenW / bmpW;
        const scaleY = screenH / bmpH;

        // Aplikujemy wybraną skalę
        if (scaleMode === 'stretch') {
            this.scale.x = scaleX;
            this.scale.y = scaleY;
        } else { // Tryb 'cover'
            const finalScale = Math.max(scaleX, scaleY);
            this.scale.x = finalScale;
            this.scale.y = finalScale;
        }

        // Poprawne wyśrodkowanie na osi X
        this.x = (screenW - (bmpW * this.scale.x)) / 2;
        
        // Wyrównanie na osi Y (Zależnie od systemu walki)
        if ($gameSystem.isSideView()) {
            // W widoku z boku (SideView) tło podłogi zwykle spoczywa na dole
            this.y = screenH - (bmpH * this.scale.y);
        } else {
            // W widoku z przodu (FrontView) centrujemy
            this.y = (screenH - (bmpH * this.scale.y)) / 2;
        }
    };
})();