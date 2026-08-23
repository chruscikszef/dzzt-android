//=============================================================================
// LIVAN_Bestiary.js
//=============================================================================

/*:
 * @plugindesc [v1.4] Bestiariusz
 * @author GalaxyLIVAN
 *
 * @param CommandName
 * @text Nazwa w menu
 * @desc Nazwa widoczna w menu głównym gry.
 * @default Bestiariusz
 *
 * @param Exceptions
 * @text Wyjątki
 * @desc Wpisz nazwy przeciwników, którzy nie trafią do bestiariusza (oddzielone przecinkiem).
 * @default 
 *
 * @help
 * ============================================================================
 * Instrukcja:
 * ============================================================================
 * W zakładce Przeciwnicy (Enemies) w bazie danych, w polu Notatki (Note) wpisz
 * opis używając poniższych tagów.
 *
 * Masz do dyspozycji 7 linijek tekstu:
 *
 * <EnemyBook1:Tekst linijki 1>
 * <EnemyBook2:Tekst linijki 2>
 * <EnemyBook3:Tekst linijki 3>
 * i tak do siedmiu
 *
 * Przeciwnik zostanie automatycznie dodany do książki po pokonaniu go w walce 
 * (no chyba że dodasz go do wyjątków).
 * Grafika przeciwnika powinna zostać automatycznie przeskalowana, jeśli jest zbyt duża,
 * aby zmieścić się w podglądzie przeciwnika.
 * ============================================================================
 */

(function() {
    var parameters = PluginManager.parameters('LIVAN_Bestiary');
    var commandName = String(parameters['CommandName'] || 'Bestiariusz');
    var exceptionsParam = String(parameters['Exceptions'] || '');

    // --- Przygotowanie listy wyjątków ---
    var excludedEnemies = exceptionsParam.split(',').map(function(name) {
        return name.trim().toLowerCase();
    }).filter(function(name) {
        return name.length > 0;
    });

    // --- Funkcja pomocnicza do pobierania listy ---
    function getDiscoveredEnemies() {
        if (!$gameSystem._discoveredEnemies) {
            $gameSystem._discoveredEnemies = [];
        }
        return $gameSystem._discoveredEnemies;
    }

    // --- Rozszerzenie Game_System ---
    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        _Game_System_initialize.call(this);
        this._discoveredEnemies = [];
    };

    Game_System.prototype.addToEnemyBook = function(enemyId) {
        var list = getDiscoveredEnemies();
        if (!list.contains(enemyId)) {
            list.push(enemyId);
            list.sort((a, b) => a - b);
        }
    };

    // --- Automatyczne dodawanie po walce (z wyjątkami) ---
    var _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function() {
        _Game_Enemy_die.call(this);
        if (!$gameParty.inBattle()) return;
        var enemyData = $dataEnemies[this.enemyId()];
        
        if (enemyData && enemyData.name) {
             var enemyNameLower = enemyData.name.toLowerCase();
             if (excludedEnemies.indexOf(enemyNameLower) === -1) {
                 $gameSystem.addToEnemyBook(this.enemyId());
             }
        }
    };

    // --- Dodanie opcji do Menu (ESC) ---
    var _Window_MenuCommand_addMainCommands = Window_MenuCommand.prototype.addMainCommands;
    Window_MenuCommand.prototype.addMainCommands = function() {
        _Window_MenuCommand_addMainCommands.call(this);
        this.addCommand(commandName, 'bestiary', true);
    };

    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('bestiary', function() {
            SceneManager.push(Scene_Bestiary);
        });
    };

    // ========================================================================
    // Scena Bestiariusza
    // ========================================================================
    function Scene_Bestiary() {
        this.initialize.apply(this, arguments);
    }

    Scene_Bestiary.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Bestiary.prototype.constructor = Scene_Bestiary;

    Scene_Bestiary.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createListWindow();
        this.createStatusWindow();
    };

    Scene_Bestiary.prototype.createListWindow = function() {
        var ww = 300;
        var wh = Graphics.boxHeight;
        this._listWindow = new Window_BestiaryList(0, 0, ww, wh);
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._listWindow);
    };

    Scene_Bestiary.prototype.createStatusWindow = function() {
        var wx = this._listWindow.width;
        var ww = Graphics.boxWidth - wx;
        var wh = Graphics.boxHeight;
        this._statusWindow = new Window_BestiaryStatus(wx, 0, ww, wh);
        this.addWindow(this._statusWindow);
        this._listWindow.setStatusWindow(this._statusWindow);
    };

    // ========================================================================
    // Okno Listy (Lewa strona)
    // ========================================================================
    function Window_BestiaryList() {
        this.initialize.apply(this, arguments);
    }

    Window_BestiaryList.prototype = Object.create(Window_Selectable.prototype);
    Window_BestiaryList.prototype.constructor = Window_BestiaryList;

    Window_BestiaryList.prototype.initialize = function(x, y, width, height) {
        this._data = getDiscoveredEnemies();
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this.refresh();
        this.select(0);
        this.activate();
    };

    Window_BestiaryList.prototype.maxItems = function() {
        return this._data ? this._data.length : 0;
    };

    Window_BestiaryList.prototype.drawItem = function(index) {
        var enemyId = this._data[index];
        var enemy = $dataEnemies[enemyId];
        if (enemy) {
            var rect = this.itemRectForText(index);
            this.drawText(enemy.name, rect.x, rect.y, rect.width);
        }
    };

    Window_BestiaryList.prototype.setStatusWindow = function(statusWindow) {
        this._statusWindow = statusWindow;
        this.updateStatus();
    };

    Window_BestiaryList.prototype.updateStatus = function() {
        if (this._statusWindow && this._data) {
            var enemyId = this._data[this.index()];
            var enemyData = (enemyId && $dataEnemies[enemyId]) ? $dataEnemies[enemyId] : null;
            this._statusWindow.setEnemy(enemyData);
        }
    };

    Window_BestiaryList.prototype.select = function(index) {
        Window_Selectable.prototype.select.call(this, index);
        this.updateStatus();
    };

    // ========================================================================
    // Okno Statusu (Prawa strona - Obrazek i Opis)
    // ========================================================================
    function Window_BestiaryStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_BestiaryStatus.prototype = Object.create(Window_Base.prototype);
    Window_BestiaryStatus.prototype.constructor = Window_BestiaryStatus;

    Window_BestiaryStatus.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this.refresh();
        }
    };

    Window_BestiaryStatus.prototype.refresh = function() {
        this.contents.clear();
        if (!this._enemy) return;

        var w = this.contentsWidth();
        var lh = this.lineHeight();
        var currentEnemyId = this._enemy.id;

        // --- 1. Nagłówki ---
        this.changeTextColor(this.systemColor());
        this.drawText("Przeciwnik:", 0, 0, w, 'center');
        this.resetTextColor();
        this.drawText(this._enemy.name, 0, lh, w, 'center');
        this.contents.fillRect(0, lh * 2, w, 2, this.normalColor());

        // --- 2. Rysowanie i Skalowanie Obrazka ---
        var imgAreaY = lh * 2 + 10;
        var imgAreaHeight = 180;

        var bitmap = ImageManager.loadEnemy(this._enemy.battlerName, this._enemy.battlerHue);

        bitmap.addLoadListener(function() {
            if (!this._enemy || this._enemy.id !== currentEnemyId) return;

            var bw = bitmap.width;
            var bh = bitmap.height;

            var scaleW = w / bw;
            var scaleH = imgAreaHeight / bh;
            var scale = Math.min(1.0, scaleW, scaleH);

            var dw = Math.floor(bw * scale);
            var dh = Math.floor(bh * scale);

            var drawX = (w - dw) / 2;
            var drawY = imgAreaY + (imgAreaHeight - dh) / 2;

            this.contents.blt(bitmap, 0, 0, bw, bh, drawX, drawY, dw, dh);

        }.bind(this));

        // --- 3. Rysowanie Opisu ---
        var textStartY = imgAreaY + imgAreaHeight + 20;
        var maxLines = 9;

        for (var i = 1; i <= maxLines; i++) {
            var line = this._enemy.meta['EnemyBook' + i];
            if (line) {
                this.drawText(line.trim(), 20, textStartY + (i - 1) * lh, w - 40);
            }
        }
    };

})();