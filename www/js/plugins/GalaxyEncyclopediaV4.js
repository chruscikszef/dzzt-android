/*:
 * @plugindesc [v4.2] Encyklopedia Wrogów i Postaci (Eventy).
 * @author GalaxyLIVAN
 *
 * @param CommandName
 * @text Nazwa w menu
 * @desc Nazwa widoczna w menu głównym gry.
 * @default Encyklopedia
 *
 * @param EnabledByDefault
 * @text Włączone domyślnie?
 * @type boolean
 * @on TAK
 * @off NIE
 * @desc Czy opcja Encyklopedii ma być widoczna w menu od samego początku gry?
 * @default true
 *
 * @help
 * ============================================================================
 * KOMENDY PLUGINU (Plugin Commands):
 * ============================================================================
 * 1. Encyclopedia Enable
 * - Ręczne odblokowanie encyklopedii w menu (ESC).
 *
 * 2. Encyclopedia AddEvent [Opcjonalnie: NazwaPliku.png]
 * - Dodaje event do encyklopedii.
 * - Jeśli nie podasz nazwy niestandardowego pliku dla podglądu, weźmie aktualny wygląd eventu.
 * - Przykład: Encyclopedia AddEvent Actor1.png
 * - Plik musi znajdować się w folderze img/characters.
 *
 * ============================================================================
 * NOTATKI (Note):
 * ============================================================================
 * WROGOWIE: Tagi <EnemyBook1:tekst> do <EnemyBook8:tekst>. (Wpisz w "Note")
 * NPC: Wpisz swój opis w polu "Note" eventu - plugin powinnien sam zawinąć tekst tak aby nie wychodził poza ekran.
 * ============================================================================
 *
 * ============================================================================
 * WAŻNE: W komendzie wpisuj tylko nazwę pliku, bez ścieżki img/characters/.
 * Przykład: Encyclopedia AddEvent Enotekk.png
 * ============================================================================
 */

(function() {
    var parameters = PluginManager.parameters('GalaxyEncyclopediaV3');
    var commandName = String(parameters['CommandName'] || 'Encyklopedia');
    var enabledByDefault = (parameters['EnabledByDefault'] || 'true') === 'true';

    function getEntries() {
        if (!$gameSystem._encyclopediaEntries) $gameSystem._encyclopediaEntries = [];
        return $gameSystem._encyclopediaEntries;
    }

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'Encyclopedia') {
            if (args[0] === 'Enable') $gameSystem._encyclopediaEnabled = true;
            if (args[0] === 'AddEvent') {
                var event = $gameMap.event(this._eventId);
                if (event) {
                    var list = getEntries();
                    var evData = event.event();
                    var customImg = args.length > 1 ? args.slice(1).join(' ') : null;
                    
                    var entry = {
                        type: 'char',
                        name: evData.name,
                        description: evData.note || "Brak opisu.",
                        // Jeśli podano plik - użyj go. Jeśli nie - weź grafikę i INDEX z eventu.
                        img: (customImg || event.characterName()).replace(/\.(png|jpg)$/i, ""),
                        imgIndex: customImg ? 0 : event.characterIndex(),
                        isFullSheet: !!customImg // Jeśli podano plik ręcznie, traktuj go jak cały obraz
                    };

                    if (!list.some(e => e.name === entry.name)) {
                        list.push(entry);
                        list.sort((a, b) => a.name.localeCompare(b.name));
                    }
                }
            }
        }
    };

    var _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        _Window_MenuCommand_addMainCommands.call(this);
        if ($gameSystem._encyclopediaEnabled) this.addCommand(commandName, 'encyclopedia');
    };

    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('encyclopedia', () => SceneManager.push(Scene_Encyclopedia));
    };

    function Scene_Encyclopedia() { this.initialize.apply(this, arguments); }
    Scene_Encyclopedia.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Encyclopedia.prototype.constructor = Scene_Encyclopedia;
    Scene_Encyclopedia.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._listWindow = new Window_EncList(0, 0, 300, Graphics.boxHeight);
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._listWindow);
        this._statusWindow = new Window_EncStatus(300, 0, Graphics.boxWidth - 300, Graphics.boxHeight);
        this.addWindow(this._statusWindow);
        this._listWindow.setStatusWindow(this._statusWindow);
    };

    function Window_EncList() { this.initialize.apply(this, arguments); }
    Window_EncList.prototype = Object.create(Window_Selectable.prototype);
    Window_EncList.prototype.constructor = Window_EncList;
    Window_EncList.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this.refresh(); this.activate();
    };
    Window_EncList.prototype.maxItems = function() { return getEntries().length; };
    Window_EncList.prototype.drawItem = function(index) {
        var item = getEntries()[index];
        if (item) this.drawText(item.name, this.itemRectForText(index).x, this.itemRectForText(index).y, this.itemRectForText(index).width);
    };
    Window_EncList.prototype.setStatusWindow = function(sw) { 
        this._statusWindow = sw; 
        this.select(0); 
    };
    Window_EncList.prototype.select = function(index) {
        Window_Selectable.prototype.select.call(this, index);
        if (this._statusWindow) this._statusWindow.setItem(getEntries()[index]);
    };

    function Window_EncStatus() { this.initialize.apply(this, arguments); }
    Window_EncStatus.prototype = Object.create(Window_Base.prototype);
    Window_EncStatus.prototype.constructor = Window_EncStatus;

    Window_EncStatus.prototype.setItem = function(item) {
        if (this._item !== item) {
            this._item = item;
            this.refresh();
        }
    };

    Window_EncStatus.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this.refresh(); // Wymuszamy render, by uniknąć błędów ładowania
    };

    Window_EncStatus.prototype.refresh = function() {
        this.contents.clear();
        if (!this._item) return;
        var w = this.contentsWidth();
        var lh = this.lineHeight();

        this.changeTextColor(this.systemColor());
        this.drawText("Postać:", 0, 0, w, 'center');
        this.resetTextColor();
        this.drawText(this._item.name, 0, lh, w, 'center');
        this.contents.fillRect(0, lh * 2, w, 2, this.normalColor());

        var bitmap = ImageManager.loadCharacter(this._item.img);
        if (bitmap.isReady()) {
            var sw, sh, sx, sy;
            
            if (this._item.isFullSheet) {
                // Skalowanie dla ręcznie podanego pełnego obrazu
                sw = bitmap.width;
                sh = bitmap.height;
                sx = 0; sy = 0;
            } else {
                // Skalowanie dla grafiki z arkusza postaci (Character Set)
                var isBig = ImageManager.isBigCharacter(this._item.img);
                sw = isBig ? bitmap.width / 3 : bitmap.width / 12;
                sh = isBig ? bitmap.height / 4 : bitmap.height / 8;
                sx = (this._item.imgIndex % 4 * 3 + 1) * sw;
                sy = (Math.floor(this._item.imgIndex / 4) * 4) * sh;
                // Poprawka dla pojedynczych dużych arkuszy
                if (isBig) { sx = sw; sy = 0; }
            }

            var imgMaxH = 220;
            var s = Math.min(2.0, (w - 40) / sw, imgMaxH / sh);
            var dw = sw * s;
            var dh = sh * s;
            
            this.contents.blt(bitmap, sx, sy, sw, sh, (w - dw) / 2, lh * 2 + 10 + (imgMaxH - dh) / 2, dw, dh);
        }

        this.drawTextAutoWrap(this._item.description, 20, lh * 2 + 240, w - 40);
    };

    Window_Base.prototype.drawTextAutoWrap = function(text, x, y, width) {
        var words = String(text).split(' ');
        var line = '';
        var stepY = 0;
        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            if (this.contents.measureTextWidth(testLine) > width && n > 0) {
                this.drawText(line.trim(), x, y + stepY, width);
                line = words[n] + ' ';
                stepY += this.lineHeight();
            } else { line = testLine; }
        }
        this.drawText(line.trim(), x, y + stepY, width);
    };
})();