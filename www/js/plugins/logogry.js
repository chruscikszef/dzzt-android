/*:
 * @plugindesc Podmienia domyślny tytuł gry na logo w Scene_Title z dopasowaną skalą
 * @author GalaxyLIVAN
 *
 * @param Logo File
 * @text Plik Logo
 * @desc Nazwa pliku z folderu img/titles1
 * @default Logo
 *
 * @param Scale
 * @text Skala Logo
 * @desc Skala logo względem oryginalnego rozmiaru (1 = 100%)
 * @default 0.5
 *
 * @help
 * Plugin sprawia, że w Scene_Title zamiast napisu tytułu gry
 * wyświetla się logo z pliku z folderu img/titles1.
 * Skala domyślna ustawiona tak, aby było podobne do domyślnego napisu tytułu.
 */

(function() {
    var parameters = PluginManager.parameters('TitleLogo');
    var logoFile = String(parameters['Logo File'] || 'Logo');
    var scale = Number(parameters['Scale'] || 0.5);

    var _Scene_Title_create = Scene_Title.prototype.create;
    Scene_Title.prototype.create = function() {
        _Scene_Title_create.call(this);
        this.createLogo();
    };

    Scene_Title.prototype.createLogo = function() {
        // Usuń domyślny napis tytułu
        if (this._gameTitle) {
            this.removeChild(this._gameTitle);
            this._gameTitle = null;
        }

        // Dodaj logo zamiast tytułu
        this._logoSprite = new Sprite(ImageManager.loadTitle1(logoFile));

        // Ustaw pozycję dokładnie tam, gdzie był tekst
        this._logoSprite.x = Graphics.width / 2;
        this._logoSprite.y = Graphics.height / 4; // domyślna pozycja napisu tytułu
        this._logoSprite.anchor.x = 0.5;
        this._logoSprite.anchor.y = 0.5;

        // Dopasuj skalę
        this._logoSprite.scale.x = scale;
        this._logoSprite.scale.y = scale;

        this.addChild(this._logoSprite);
    };
})();
