/*:
 * @plugindesc Autozapis (na bazie plugina Felski)
 * @author GalaxyLIVAN / Felski
 *
 * @param Option Name
 * @text Nazwa w opcjach
 * @default Autozapis
 *
 * @param Autosave Text
 * @text Tekst slotu
 * @desc Tekst wyświetlany w menu zapisu przy slocie autozapisu.
 * @default Autozapis
 *
 * @help
 * Plugin tworzy dedykowany slot autozapisu na samym szczycie listy.
 * - Nie można na nim zapisać gry ręcznie (slot jest zablokowany).
 * - Można go wyłączyć w Opcjach (wtedy slot staje się wyszarzony).
 * - Zapisuje po zmianie mapy (z poprawką na BGM), po walce i po przedmiocie.
 */

(function() {
    var parameters = PluginManager.parameters('AutosaveSystem');
    var optionName = String(parameters['Option Name'] || 'Autozapis');
    var autosaveText = String(parameters['Autosave Text'] || 'Autozapis');
    var AUTOSAVE_FILE_ID = 999; // Bezpieczne ID dla autozapisu

    // --- Konfiguracja Opcji ---
    ConfigManager.enableAutosave = true;

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.enableAutosave = this.enableAutosave;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        var f = this.readFlag(config, 'enableAutosave');
        this.enableAutosave = (f !== undefined) ? f : true;
    };

    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand(optionName, 'enableAutosave');
    };

    // --- Logika Slotów (Styl Felski) ---

    var _DataManager_maxSavefiles = DataManager.maxSavefiles;
    DataManager.maxSavefiles = function() {
        return _DataManager_maxSavefiles.call(this) + 1;
    };

    // Funkcja pomocnicza do mapowania indeksu listy na ID pliku
    Window_SavefileList.prototype.indexToId = function(index) {
        return index === 0 ? AUTOSAVE_FILE_ID : index;
    };

    // Rysowanie ID/Nazwy slotu
    Window_SavefileList.prototype.drawFileId = function(id, x, y) {
        var index = this.index(); // Sprawdzamy aktualny index rysowanego elementu
        if (id === AUTOSAVE_FILE_ID) {
            this.changePaintOpacity(ConfigManager.enableAutosave);
            this.drawText(autosaveText, x, y, 180);
        } else {
            this.changePaintOpacity(true);
            this.drawText(TextManager.file + " " + id, x, y, 180);
        }
    };

    // Podmiana rysowania elementu, by obsłużyć wyszarzanie całego wiersza
    var _Window_SavefileList_drawItem = Window_SavefileList.prototype.drawItem;
    Window_SavefileList.prototype.drawItem = function(index) {
        var id = this.indexToId(index);
        if (id === AUTOSAVE_FILE_ID) {
            this.changePaintOpacity(ConfigManager.enableAutosave);
        } else {
            this.changePaintOpacity(true);
        }
        _Window_SavefileList_drawItem.call(this, index);
    };

    // --- Blokady i Przekierowania Sceny ---

    // Zmieniamy metodę pobierania ID, aby Scena wiedziała, który plik wybrać
    Scene_File.prototype.savefileId = function() {
        return this._savefileWindow.indexToId(this._savefileWindow.index());
    };

    // Blokada nadpisywania w Scene_Save
    var _Scene_Save_onSavefileOk = Scene_Save.prototype.onSavefileOk;
    Scene_Save.prototype.onSavefileOk = function() {
        if (this.savefileId() === AUTOSAVE_FILE_ID) {
            SoundManager.playBuzzer();
            this._savefileWindow.activate();
        } else {
            _Scene_Save_onSavefileOk.call(this);
        }
    };

    // --- Logika Wyzwalaczy Autozapisu ---

    SceneManager.doAutosave = function() {
        if (ConfigManager.enableAutosave && !$gameParty.inBattle()) {
            $gameSystem.onBeforeSave();
            if (DataManager.saveGame(AUTOSAVE_FILE_ID)) {
                StorageManager.cleanBackup(AUTOSAVE_FILE_ID);
            }
        }
    };

    // Zmiana Mapy (z opóźnieniem na BGM)
    var _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        setTimeout(function() { SceneManager.doAutosave(); }, 300);
    };

    // Wygrana Walka
    var _BattleManager_processVictory = BattleManager.processVictory;
    BattleManager.processVictory = function() {
        _BattleManager_processVictory.call(this);
        SceneManager.doAutosave();
    };

    // Zdobycie Przedmiotu
    var _Game_Party_gainItem = Game_Party.prototype.gainItem;
    Game_Party.prototype.gainItem = function(item, amount, includeEquip) {
        _Game_Party_gainItem.call(this, item, amount, includeEquip);
        if (amount > 0 && SceneManager._scene instanceof Scene_Map) {
            SceneManager.doAutosave();
        }
    };

})();