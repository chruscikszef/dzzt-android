/*:
 * @plugindesc Dodaje tekst autora i wersji na ekran tytułowy (RPG Maker MV).  
 * @author GalaxyLIVAN
 *
 * @param Author Text
 * @text Tekst autora
 * @default Twórca: GalaxyLIVAN
 *
 * @param Version Text
 * @text Tekst wersji
 * @default Wersja 1.0
 *
 * @param Font Size
 * @text Rozmiar czcionki
 * @type number
 * @default 22
 *
 * @help
 * Plugin dodaje dwa napisy:
 * Lewy dół  → autor gry
 * Prawy dół → numer wersji
 *
 * Brak komend pluginu.
 */

(function() {

    var parameters = PluginManager.parameters('TitleExtraTextMV');
    var authorText = String(parameters['Author Text'] || "Twórcy portu: Chruscik1, GalaxyLIVAN");
    var versionText = String(parameters['Version Text'] || "Wersja 3.0.0 (Android 2.0)");
    var fontSize = Number(parameters['Font Size'] || 22);

    // --- Dodanie napisu na scenę tytułową ---
    var _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        this.createExtraText();
    };

    Scene_Title.prototype.createExtraText = function() {
        const sprite = new Sprite(new Bitmap(Graphics.width, Graphics.height));
        const bitmap = sprite.bitmap;
        bitmap.fontSize = fontSize;

        // Lewy dół
        bitmap.drawText(
            authorText,
            20,
            Graphics.height - 40,
            Graphics.width / 2,
            40,
            "left"
        );

        // Prawy dół
        bitmap.drawText(
            versionText,
            0,
            Graphics.height - 40,
            Graphics.width - 20,
            40,
            "right"
        );

        this.addChild(sprite);
    };

})();
