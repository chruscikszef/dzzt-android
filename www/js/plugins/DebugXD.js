//=============================================================================
// Debug.js
//=============================================================================

/*:
 * @plugindesc [v2.4] Menu Deweloperskie
 * @author GalaxyLIVAN 
 *
 * @help
 * ============================================================================
 * Instrukcja:
 * ============================================================================
 * KLAWISZOLOGIA NA MAPIE:
 * 
 * 1. Prawy Shift + Backspace
 *    Otwiera menu wszystkich map (Teleporter).
 *
 * 2. Prawy Shift + I + Backspace 
 *    Otwiera Menu Cheatów i Narzędzi.
 *
 * 3. Prawy Shift + O + Backspace
 *    Otwiera Menu Testów Walk (Baza wszystkich "Troops" / Przeciwników).
 * ============================================================================
 */

(function() {
    // ========================================================================
    // Globalny nasłuchiwacz klawiatury
    // ========================================================================
    var keysDown = {};

    document.addEventListener('keydown', function(event) {
        keysDown[event.code] = true;
        
        if (event.code === 'Backspace' && keysDown['ShiftRight']) {
            if ($gameTemp && SceneManager._scene instanceof Scene_Map) {
                if (keysDown['KeyI']) {
                    $gameTemp._requestLivanCheats = true;
                } else if (keysDown['KeyO']) {
                    $gameTemp._requestLivanBattles = true;
                } else {
                    $gameTemp._requestLivanTeleport = true;
                }
            }
        }
    });

    document.addEventListener('keyup', function(event) {
        keysDown[event.code] = false;
    });

    // ========================================================================
    // Odpalanie scen bez zawieszania głównej pętli
    // ========================================================================
    var _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if (this.isActive() && !$gameMessage.isBusy()) {
            if ($gameTemp._requestLivanTeleport) {
                $gameTemp._requestLivanTeleport = false;
                SceneManager.push(Scene_DebugTeleport);
            }
            if ($gameTemp._requestLivanCheats) {
                $gameTemp._requestLivanCheats = false;
                SceneManager.push(Scene_DebugCheats);
            }
            if ($gameTemp._requestLivanBattles) {
                $gameTemp._requestLivanBattles = false;
                SceneManager.push(Scene_DebugBattles);
            }
        }
    };

    // ========================================================================
    // Noclip logic
    // ========================================================================
    var _Game_Player_isDebugThrough = Game_Player.prototype.isDebugThrough;
    Game_Player.prototype.isDebugThrough = function() {
        return this._livanNoclip || _Game_Player_isDebugThrough.call(this);
    };

    // ========================================================================
    // SPECJALNE OKNO POWITALNE (NAGŁÓWEK)
    // ========================================================================
    function Window_DebugHeader() { this.initialize.apply(this, arguments); }
    Window_DebugHeader.prototype = Object.create(Window_Base.prototype);
    Window_DebugHeader.prototype.constructor = Window_DebugHeader;

    Window_DebugHeader.prototype.initialize = function(x, y, w, h) {
        Window_Base.prototype.initialize.call(this, x, y, w, h);
        this.drawText("Co ty tu robisz siusiaczku!?!?!", 0, 0, this.contentsWidth(), 'center');
    };

    // ========================================================================
    // SCENA 1: TELEPORTER (Prawy Shift + Backspace)
    // ========================================================================
    function Scene_DebugTeleport() { this.initialize.apply(this, arguments); }
    Scene_DebugTeleport.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugTeleport.prototype.constructor = Scene_DebugTeleport;

    Scene_DebugTeleport.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        var ww = 400;
        var wh = Graphics.boxHeight - 150;
        var titleHeight = 72;
        var wx = (Graphics.boxWidth - ww) / 2;
        var wy = (Graphics.boxHeight - wh + titleHeight) / 2;
        
        this._titleWindow = new Window_DebugHeader(wx, wy - titleHeight, ww, titleHeight);
        this.addWindow(this._titleWindow);

        this._mapListWindow = new Window_DebugMapList(wx, wy, ww, wh);
        this._mapListWindow.setHandler('ok', this.onMapOk.bind(this));
        this._mapListWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._mapListWindow);
    };

    Scene_DebugTeleport.prototype.onMapOk = function() {
        var mapId = this._mapListWindow.currentExt();
        if (mapId) {
            SoundManager.playLoad();
            $gamePlayer.reserveTransfer(mapId, 0, 0, $gamePlayer.direction(), 0);
            SceneManager.pop();
        } else {
            this._mapListWindow.activate();
        }
    };

    function Window_DebugMapList() { this.initialize.apply(this, arguments); }
    Window_DebugMapList.prototype = Object.create(Window_Selectable.prototype);
    Window_DebugMapList.prototype.constructor = Window_DebugMapList;

    Window_DebugMapList.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._data = [];
        for (var i = 1; i < $dataMapInfos.length; i++) {
            if ($dataMapInfos[i]) this._data.push($dataMapInfos[i]);
        }
        this.refresh();
        this.select(0);
        this.activate();
    };
    Window_DebugMapList.prototype.maxItems = function() { return this._data ? this._data.length : 0; };
    Window_DebugMapList.prototype.currentExt = function() { return this._data && this._data[this.index()] ? this._data[this.index()].id : null; };
    Window_DebugMapList.prototype.drawItem = function(index) {
        var map = this._data[index];
        if (map) {
            var rect = this.itemRectForText(index);
            this.drawText(String(map.id).padZero(3) + ": " + map.name, rect.x, rect.y, rect.width);
        }
    };

    // ========================================================================
    // SCENA 2: MENU CHEATÓW (Prawy Shift + I + Backspace)
    // ========================================================================
    function Scene_DebugCheats() { this.initialize.apply(this, arguments); }
    Scene_DebugCheats.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugCheats.prototype.constructor = Scene_DebugCheats;

    Scene_DebugCheats.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._commandWindow = new Window_DebugCheats(0, 0);
        var titleHeight = 72;
        
        this._commandWindow.x = (Graphics.boxWidth - this._commandWindow.width) / 2;
        this._commandWindow.y = (Graphics.boxHeight - this._commandWindow.height + titleHeight) / 2;
        
        this._titleWindow = new Window_DebugHeader(this._commandWindow.x, this._commandWindow.y - titleHeight, this._commandWindow.width, titleHeight);
        this.addWindow(this._titleWindow);
        
        this._commandWindow.setHandler('noclip',    this.commandNoclip.bind(this));
        this._commandWindow.setHandler('visibility',this.commandVisibility.bind(this));
        this._commandWindow.setHandler('heal',      this.commandHeal.bind(this));
        this._commandWindow.setHandler('level',     this.commandLevel.bind(this));
        this._commandWindow.setHandler('money',     this.commandMoney.bind(this));
        this._commandWindow.setHandler('items',     this.commandItems.bind(this));
        this._commandWindow.setHandler('music',     this.commandMusic.bind(this));
        this._commandWindow.setHandler('plugincmd', this.commandPluginCmd.bind(this));
        this._commandWindow.setHandler('switches',  this.commandSwitches.bind(this));
        this._commandWindow.setHandler('plugins',   this.commandPlugins.bind(this));
        this._commandWindow.setHandler('save',      this.commandSave.bind(this));
        this._commandWindow.setHandler('cancel',    this.popScene.bind(this));
        
        this.addWindow(this._commandWindow);
    };

    Scene_DebugCheats.prototype.commandNoclip = function() {
        $gamePlayer._livanNoclip = !$gamePlayer._livanNoclip;
        SoundManager.playEquip();
        this._commandWindow.refresh();
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandVisibility = function() {
        $gamePlayer.setTransparent(!$gamePlayer.isTransparent());
        SoundManager.playEquip();
        this._commandWindow.refresh();
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandHeal = function() {
        $gameParty.members().forEach(function(a) { a.recoverAll(); });
        SoundManager.playRecovery();
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandLevel = function() {
        var input = window.prompt("Wpisz poziom (Level) dla całej drużyny:", "99");
        if (input !== null && input.trim() !== "") {
            var lvl = parseInt(input, 10);
            if (!isNaN(lvl) && lvl > 0) {
                $gameParty.members().forEach(function(actor) {
                    actor.changeLevel(lvl, false);
                });
                SoundManager.playRecovery();
            } else {
                SoundManager.playBuzzer();
            }
        }
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandMoney = function() {
        var input = window.prompt("Wpisz ilość złota, którą chcesz dodać (lub podaj liczbę z minusem, aby odjąć):", "1000");
        if (input !== null && input.trim() !== "") {
            var amount = parseInt(input, 10);
            if (!isNaN(amount)) {
                $gameParty.gainGold(amount);
                SoundManager.playShop();
            } else {
                SoundManager.playBuzzer();
            }
        }
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandMusic = function() {
        if ($dataMap.bgm && $dataMap.bgm.name) {
            $gameMap.autoplay();
        } else {
            AudioManager.stopBgm();
        }
        SoundManager.playOk();
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandPluginCmd = function() {
        var input = window.prompt("Wpisz komendę pluginu (np. Ciemnosc wlacz):", "");
        if (input) {
            var args = input.trim().split(" ");
            var cmd = args.shift();
            var interpreter = new Game_Interpreter();
            interpreter.pluginCommand(cmd, args);
            SoundManager.playOk();
        }
        this._commandWindow.activate();
    };
    Scene_DebugCheats.prototype.commandItems = function() { SceneManager.push(Scene_DebugItems); };
    Scene_DebugCheats.prototype.commandSwitches = function() { SceneManager.push(Scene_DebugSwitches); };
    Scene_DebugCheats.prototype.commandPlugins = function() { SceneManager.push(Scene_DebugPlugins); };
    Scene_DebugCheats.prototype.commandSave = function() { SceneManager.push(Scene_Save); };

    function Window_DebugCheats() { this.initialize.apply(this, arguments); }
    Window_DebugCheats.prototype = Object.create(Window_Command.prototype);
    Window_DebugCheats.prototype.constructor = Window_DebugCheats;

    Window_DebugCheats.prototype.initialize = function(x, y) { Window_Command.prototype.initialize.call(this, x, y); };
    Window_DebugCheats.prototype.windowWidth = function() { return 400; };
    Window_DebugCheats.prototype.windowHeight = function() { return this.fittingHeight(11); };
    Window_DebugCheats.prototype.makeCommandList = function() {
        var noclipStatus = $gamePlayer._livanNoclip ? "[WŁĄCZONY]" : "[WYŁĄCZONY]";
        var visStatus = $gamePlayer.isTransparent() ? "[NIEWIDZIALNY]" : "[WIDZIALNY]";
        
        this.addCommand("Noclip " + noclipStatus, 'noclip');
        this.addCommand("Status Gracza " + visStatus, 'visibility');
        this.addCommand("Ulecz drużynę", 'heal');
        this.addCommand("Ustaw Level Drużyny", 'level');
        this.addCommand("Dodaj / Odejmij Złoto", 'money');
        this.addCommand("Menedżer Przedmiotów (Zdobądź) >", 'items');
        this.addCommand("Zresetuj / Odśwież Muzykę", 'music');
        this.addCommand("Wpisz Komendę Pluginu (Konsola)", 'plugincmd');
        this.addCommand("Menedżer Przełączników (Switches) >", 'switches');
        this.addCommand("Menedżer Wtyczek (Plugins) >", 'plugins');
        this.addCommand("Zapisz Grę (Save Menu) >", 'save');
    };

    // ========================================================================
    // SCENA 3: TESTY WALK (Prawy Shift + O + Backspace)
    // ========================================================================
    function Scene_DebugBattles() { this.initialize.apply(this, arguments); }
    Scene_DebugBattles.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugBattles.prototype.constructor = Scene_DebugBattles;

    Scene_DebugBattles.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        var ww = 400;
        var wh = Graphics.boxHeight - 150;
        var titleHeight = 72;
        var wx = (Graphics.boxWidth - ww) / 2;
        var wy = (Graphics.boxHeight - wh + titleHeight) / 2;
        
        this._titleWindow = new Window_DebugHeader(wx, wy - titleHeight, ww, titleHeight);
        this.addWindow(this._titleWindow);

        this._listWindow = new Window_DebugBattleList(wx, wy, ww, wh);
        this._listWindow.setHandler('ok', this.onBattleOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._listWindow);
    };
    Scene_DebugBattles.prototype.onBattleOk = function() {
        var troopId = this._listWindow.currentExt();
        if (troopId) {
            BattleManager.setup(troopId, true, false);
            BattleManager.onEncounter();
            SceneManager.push(Scene_Battle);
        } else {
            this._listWindow.activate();
        }
    };
    function Window_DebugBattleList() { this.initialize.apply(this, arguments); }
    Window_DebugBattleList.prototype = Object.create(Window_Selectable.prototype);
    Window_DebugBattleList.prototype.constructor = Window_DebugBattleList;

    Window_DebugBattleList.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._data = [];
        for (var i = 1; i < $dataTroops.length; i++) {
            if ($dataTroops[i] && $dataTroops[i].name) this._data.push($dataTroops[i]);
        }
        this.refresh();
        this.select(0);
        this.activate();
    };
    Window_DebugBattleList.prototype.maxItems = function() { return this._data ? this._data.length : 0; };
    Window_DebugBattleList.prototype.currentExt = function() { return this._data && this._data[this.index()] ? this._data[this.index()].id : null; };
    Window_DebugBattleList.prototype.drawItem = function(i) {
        var troop = this._data[i];
        if (troop) {
            var rect = this.itemRectForText(i);
            this.drawText(String(troop.id).padZero(3) + ": " + troop.name, rect.x, rect.y, rect.width);
        }
    };

    // ========================================================================
    // SCENA 4: MENEDŻER PRZEŁĄCZNIKÓW (SWITCHES)
    // ========================================================================
    function Scene_DebugSwitches() { this.initialize.apply(this, arguments); }
    Scene_DebugSwitches.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugSwitches.prototype.constructor = Scene_DebugSwitches;

    Scene_DebugSwitches.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        var ww = 480;
        var wh = Graphics.boxHeight - 150;
        var titleHeight = 72;
        var wx = (Graphics.boxWidth - ww) / 2;
        var wy = (Graphics.boxHeight - wh + titleHeight) / 2;
        
        this._titleWindow = new Window_DebugHeader(wx, wy - titleHeight, ww, titleHeight);
        this.addWindow(this._titleWindow);

        this._listWindow = new Window_DebugSwitches(wx, wy, ww, wh);
        this._listWindow.setHandler('ok', this.onOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._listWindow);
    };
    Scene_DebugSwitches.prototype.onOk = function() {
        var id = this._listWindow.currentExt();
        if (id) {
            var currentState = $gameSwitches.value(id);
            $gameSwitches.setValue(id, !currentState);
            SoundManager.playCursor();
            this._listWindow.redrawItem(this._listWindow.index());
        }
        this._listWindow.activate();
    };
    function Window_DebugSwitches() { this.initialize.apply(this, arguments); }
    Window_DebugSwitches.prototype = Object.create(Window_Selectable.prototype);
    Window_DebugSwitches.prototype.constructor = Window_DebugSwitches;

    Window_DebugSwitches.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._data = [];
        for (var i = 1; i < $dataSystem.switches.length; i++) {
            if ($dataSystem.switches[i]) this._data.push({ id: i, name: $dataSystem.switches[i] });
        }
        this.refresh();
        this.select(0);
        this.activate();
    };
    Window_DebugSwitches.prototype.maxItems = function() { return this._data ? this._data.length : 0; };
    Window_DebugSwitches.prototype.currentExt = function() { return this._data && this._data[this.index()] ? this._data[this.index()].id : null; };
    Window_DebugSwitches.prototype.drawItem = function(i) {
        var sw = this._data[i];
        if (sw) {
            var rect = this.itemRectForText(i);
            var status = $gameSwitches.value(sw.id) ? "[ON]" : "[OFF]";
            this.drawText(String(sw.id).padZero(4) + ": " + sw.name, rect.x, rect.y, rect.width - 60);
            this.drawText(status, rect.x + rect.width - 60, rect.y, 60, 'right');
        }
    };

    // ========================================================================
    // SCENA 5: MENEDŻER WTYCZEK (PLUGINS)
    // ========================================================================
    function Scene_DebugPlugins() { this.initialize.apply(this, arguments); }
    Scene_DebugPlugins.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugPlugins.prototype.constructor = Scene_DebugPlugins;

    Scene_DebugPlugins.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        var ww = 480;
        var wh = Graphics.boxHeight - 150;
        var titleHeight = 72;
        var wx = (Graphics.boxWidth - ww) / 2;
        var wy = (Graphics.boxHeight - wh + titleHeight) / 2;
        
        this._titleWindow = new Window_DebugHeader(wx, wy - titleHeight, ww, titleHeight);
        this.addWindow(this._titleWindow);

        this._listWindow = new Window_DebugPlugins(wx, wy, ww, wh);
        this._listWindow.setHandler('ok', this.onOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._listWindow);
    };
    Scene_DebugPlugins.prototype.onOk = function() {
        var index = this._listWindow.index();
        if ($plugins[index]) {
            $plugins[index].status = !$plugins[index].status;
            SoundManager.playCursor();
            this._listWindow.redrawItem(index);
        }
        this._listWindow.activate();
    };
    function Window_DebugPlugins() { this.initialize.apply(this, arguments); }
    Window_DebugPlugins.prototype = Object.create(Window_Selectable.prototype);
    Window_DebugPlugins.prototype.constructor = Window_DebugPlugins;

    Window_DebugPlugins.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this.refresh();
        this.select(0);
        this.activate();
    };
    Window_DebugPlugins.prototype.maxItems = function() { return $plugins.length; };
    Window_DebugPlugins.prototype.drawItem = function(i) {
        var plugin = $plugins[i];
        if (plugin) {
            var rect = this.itemRectForText(i);
            var status = plugin.status ? "[WŁĄCZONY]" : "[WYŁĄCZONY]";
            this.changeTextColor(plugin.status ? this.powerUpColor() : this.powerDownColor());
            this.drawText(plugin.name, rect.x, rect.y, rect.width - 120);
            this.drawText(status, rect.x + rect.width - 120, rect.y, 120, 'right');
            this.resetTextColor();
        }
    };

    // ========================================================================
    // SCENA 6: MENEDŻER PRZEDMIOTÓW (Wybór konkretnych sztuk)
    // ========================================================================
    function Scene_DebugItems() { this.initialize.apply(this, arguments); }
    Scene_DebugItems.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_DebugItems.prototype.constructor = Scene_DebugItems;

    Scene_DebugItems.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        var ww = 480;
        var wh = Graphics.boxHeight - 150;
        var titleHeight = 72;
        var wx = (Graphics.boxWidth - ww) / 2;
        var wy = (Graphics.boxHeight - wh + titleHeight) / 2;
        
        this._titleWindow = new Window_DebugHeader(wx, wy - titleHeight, ww, titleHeight);
        this.addWindow(this._titleWindow);

        this._listWindow = new Window_DebugItems(wx, wy, ww, wh);
        this._listWindow.setHandler('ok', this.onOk.bind(this));
        this._listWindow.setHandler('cancel', this.popScene.bind(this));
        this.addWindow(this._listWindow);
    };
    
    Scene_DebugItems.prototype.onOk = function() {
        var item = this._listWindow.item();
        if (item) {
            $gameParty.gainItem(item, 1); 
            SoundManager.playUseItem();
            this._listWindow.redrawItem(this._listWindow.index()); 
        }
        this._listWindow.activate();
    };

    function Window_DebugItems() { this.initialize.apply(this, arguments); }
    Window_DebugItems.prototype = Object.create(Window_Selectable.prototype);
    Window_DebugItems.prototype.constructor = Window_DebugItems;

    Window_DebugItems.prototype.initialize = function(x, y, w, h) {
        Window_Selectable.prototype.initialize.call(this, x, y, w, h);
        this._data = [];
        
        var pushData = function(list) {
            for (var i = 1; i < list.length; i++) {
                if (list[i] && list[i].name) this._data.push(list[i]);
            }
        }.bind(this);
        
        pushData($dataItems);
        pushData($dataWeapons);
        pushData($dataArmors);
        
        this.refresh();
        this.select(0);
        this.activate();
    };
    Window_DebugItems.prototype.maxItems = function() { return this._data ? this._data.length : 0; };
    Window_DebugItems.prototype.item = function() { return this._data && this._data[this.index()] ? this._data[this.index()] : null; };
    
    Window_DebugItems.prototype.drawItem = function(i) {
        var item = this._data[i];
        if (item) {
            var rect = this.itemRect(i);
            this.drawItemName(item, rect.x, rect.y, rect.width - 60);
            
            var qty = $gameParty.numItems(item);
            this.drawText("x" + qty, rect.x + rect.width - 60, rect.y, 60, 'right');
        }
    };

})();