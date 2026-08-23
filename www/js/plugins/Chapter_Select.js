/*:
 * @plugindesc Chapter Select + Unlock Chapter 2 on map 42 → start on map 110
 * @author enotekk
 */

(function() {

// =====================================================================
//  LOCAL STORAGE – SAVE / LOAD
// =====================================================================

let unlockedChapters = {
    chapter2: false
};

function loadChapterUnlocks() {
    try {
        const data = JSON.parse(localStorage.getItem("chapterUnlocksMV"));
        if (data) unlockedChapters = data;
    } catch(e) {
        console.warn("Could not load chapter unlock data.");
    }
}

function saveChapterUnlocks() {
    localStorage.setItem("chapterUnlocksMV", JSON.stringify(unlockedChapters));
}

loadChapterUnlocks();


// =====================================================================
//  UNLOCK CHAPTER 2 WHEN ENTERING MAP ID 42
// =====================================================================

const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);

    if ($gameMap.mapId() === 42 && !unlockedChapters.chapter2) {
        unlockedChapters.chapter2 = true;
        saveChapterUnlocks();
        console.log("Rozdział 2 został odblokowany!");
    }
};


// =====================================================================
//  OVERRIDE NEW GAME & CONTINUE → CHAPTER SELECT
// =====================================================================

Scene_Title.prototype.commandNewGame = function() {
    SceneManager.push(Scene_ChapterSelect);
};

Scene_Title.prototype.commandContinue = function() {
    SceneManager.push(Scene_ChapterSelect);
};


// =====================================================================
//  SCENE: CHAPTER SELECT
// =====================================================================

function Scene_ChapterSelect() {
    this.initialize.apply(this, arguments);
}

Scene_ChapterSelect.prototype = Object.create(Scene_MenuBase.prototype);
Scene_ChapterSelect.prototype.constructor = Scene_ChapterSelect;

Scene_ChapterSelect.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createCommandWindow();
};

Scene_ChapterSelect.prototype.createCommandWindow = function() {
    this._commandWindow = new Window_ChapterSelectCommand();
    this._commandWindow.setHandler('chapter1', this.startChapter1.bind(this));
    this._commandWindow.setHandler('chapter2', this.startChapter2.bind(this));
    this._commandWindow.setHandler('cancel', this.popScene.bind(this));
    this.addWindow(this._commandWindow);
};


// =====================================================================
//  START CHAPTERS
// =====================================================================

// --- Chapter 1 ---
Scene_ChapterSelect.prototype.startChapter1 = function() {
    this.startFadeOut(60, true);
    setTimeout(() => {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    }, 1000);
};

// --- Chapter 2 (start map 110) ---
Scene_ChapterSelect.prototype.startChapter2 = function() {
    this.startFadeOut(60, true);
    setTimeout(() => {
        DataManager.setupNewGame();
        $gamePlayer.reserveTransfer(110, 0, 0, 2, 0); 
        SceneManager.goto(Scene_Map);
    }, 1000);
};


// =====================================================================
//  WINDOW: CHAPTER SELECT MENU
// =====================================================================

function Window_ChapterSelectCommand() {
    this.initialize.apply(this, arguments);
}

Window_ChapterSelectCommand.prototype = Object.create(Window_Command.prototype);
Window_ChapterSelectCommand.prototype.constructor = Window_ChapterSelectCommand;

Window_ChapterSelectCommand.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, 0);
    this.updatePlacement();
};

Window_ChapterSelectCommand.prototype.windowWidth = function() {
    return 400;
};

Window_ChapterSelectCommand.prototype.numVisibleRows = function() {
    return 6;
};

Window_ChapterSelectCommand.prototype.updatePlacement = function() {
    this.x = (Graphics.boxWidth - this.width) / 2;
    this.y = (Graphics.boxHeight - this.height) / 2;
};

Window_ChapterSelectCommand.prototype.makeCommandList = function() {
    this.addCommand("Rozdział 1 - Śladami Artysty", 'chapter1', true);

    const ch2 = unlockedChapters.chapter2;
    this.addCommand(
        ch2 ? "Rozdział 2 - Echo Jaskiń" : "Rozdział 2 (zablokowany)",
        'chapter2',
        ch2
    );

    this.addCommand("Rozdział 3 (zablokowany)", 'chapter3', false);
    this.addCommand("Powrót", 'cancel');
};

})();
