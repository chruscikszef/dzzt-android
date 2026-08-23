/* eslint-disable spaced-comment */
/*:
 * @pluginname X_ChapterSelect
 * @plugindesc A chapter selection system for your games
 * @modulename X_Chapter
 * @required
 * @external
 *
 * @author FeniX Contributors (https://fenixenginemv.gitlab.io/)
 *
 * @param loadLatestSave
 * @text Load Latest Save
 * @type boolean
 * @desc Load the latest save file to use for the chapter selection scene.
 * @default false
 *
 * @param chapters
 * @text Chapters
 * @type struct<Chapter>[]
 * @desc A list of all your chapters
 * @default ["{\"name\":\"01 That Dream\",\"description\":\"\\\"One day it all made sense, the next, well, the next day,\\\\nlets just say everything started \\\\nto change.\\\"\",\"summary\":\"\\\"\\\\\\\\C[3]Harold\\\\\\\\C[0] fell ill and \\\\\\\\C[3]Thersea\\\\\\\\C[0] set out\\\\non an adventure for a rare herb.\\\"\",\"thumbnail\":\"pictures/snowy_winter\",\"lockState\":\"true\",\"startMapId\":\"1\",\"playerX\":\"18\",\"playerY\":\"9\",\"requiredVariables\":\"[\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"value\\\\\\\":\\\\\\\"1\\\\\\\"}\\\"]\",\"requiredSwitches\":\"[\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"2\\\\\\\",\\\\\\\"value\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"3\\\\\\\",\\\\\\\"value\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\"}","{\"name\":\"02 Once Upon A Star\",\"description\":\"\\\"There it was, I gazed upon the starry\\\\nnight's sky and then it all made\\\\nsense. \\\\\\\\i[10]\\\"\",\"summary\":\"\\\"Travel the \\\\\\\\C[1] Dark Woods \\\\\\\\C[0] and\\\\nfind the \\\\\\\\C[4]Golden Stone.\\\"\",\"thumbnail\":\"pictures/starry_night\",\"lockState\":\"false\",\"startMapId\":\"2\",\"playerX\":\"14\",\"playerY\":\"7\",\"requiredVariables\":\"[\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"11\\\\\\\",\\\\\\\"value\\\\\\\":\\\\\\\"1\\\\\\\"}\\\"]\",\"requiredSwitches\":\"[\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"10\\\\\\\",\\\\\\\"value\\\\\\\":\\\\\\\"true\\\\\\\"}\\\",\\\"{\\\\\\\"id\\\\\\\":\\\\\\\"11\\\\\\\",\\\\\\\"value\\\\\\\":\\\\\\\"true\\\\\\\"}\\\"]\"}","{\"name\":\"03 The Supernatural\",\"description\":\"\\\"This is when it all starts to get\\\\nreally weird. Are you ready for it\\\\nall?\\\"\",\"summary\":\"\\\"\\\"\",\"thumbnail\":\"\",\"lockState\":\"false\",\"startMapId\":\"3\",\"playerX\":\"5\",\"playerY\":\"2\",\"requiredVariables\":\"[]\",\"requiredSwitches\":\"[]\"}"]
 *
 * @param chapterWindow
 * @text Chapter Window Options
 * @type struct<ItemWindow>
 * @desc The customizations for the chapter selection window
 * @default {"x":"0","y":"this._helpWindow.height","width":"Graphics.width / 2","height":"Graphics.height - this._helpWindow.height","itemHeight":"160","maxItems":"4","fontSize":"18"}
 *
 * @param thumbnailWindow
 * @text Thumbnail Window Options
 * @type struct<BasicWindow>
 * @desc The customizations for the thumbnail window
 * @default {"x":"this._chapterSelectWindow.width","y":"this._helpWindow.height","width":"Graphics.width / 2","height":"Graphics.height / 2"}
 *
 * @param summaryWindow
 * @text Summary Window Options
 * @type struct<BasicWindow>
 * @desc The customizations for the summary window
 * @default {"x":"this._thumbnailWindow.x","y":"this._thumbnailWindow.y + this._thumbnailWindow.height","width":"Graphics.width / 2","height":"Graphics.height - (this._thumbnailWindow.height + this._helpWindow.height)"}
 *
 * @param horizontalLineColor
 * @text Horizontal Line Color
 * @type string
 * @desc The horizontal line color. This line is drawn under chapter titles
 * @default #fcefb3
 *
 * @param helpWindowTerm
 * @text Help Window Term
 * @type string
 * @desc The term used in the help window when selecting a chapter
 * @default Select a chapter to continue
 *
 * @param summaryTitle
 * @text Summary Title
 * @type string
 * @desc The term used as the title to th summary window
 * @default Summary
 *
 * @param isChapterCommandEnabled
 * @text Chapter Command Enabled
 * @type boolean
 * @desc Should the chapter command be included in the title scene's command window
 * @default true
 *
 * @param chapterCommandText
 * @text Chapter Command Text
 * @type string
 * @desc The text to use as the command's name on the title scene's command window
 * @default Chapter Select
 *
 * @help
--------------------------------------------------------------------------------
 # TERMS OF USE

 MIT License -

 * Free for use in any RPG Maker MV game project, commercial or otherwise

 * Credit may go to FeniXEngine Contributors or FeniXEngine

 * Though not required, you may provide a link back to the original source code,
   repository or website.
 -------------------------------------------------------------------------------
  # INSTALLATION

  Place the plugin file directly in your game project's `/js/plugins/`
  directory

 -------------------------------------------------------------------------------
 # INFORMATION

 This plugin provides the user the option of creating chapters for their game.
 Each chapter will allow you to reset and setup switches and variables which
 will be required for the player to play through the chapter again.

 -------------------------------------------------------------------------------
 # Parameters
 The plugin's parameters provide many options for you to customize the way the
 chapter is presented in the chapter selection scene.

 What is Required switches and variables?

 These are the switches and variables that you know are required to be setup
 in a way that the chapter can correctly proceed. For example if you did a
 full play-through of your game, then some switches and variables will be
 incorrectly set. Starting a chapter without resetting the switch and variable
 values would probably cause unexpected behavior and the chapter would be
 unplayable.

 -------------------------------------------------------------------------------
 # Script Calls

 $gameSystem.chapters()
 This script call return an array of all chapters

 $gameSystem.getChapterById(chapterId)
 Returns the chapter object by its ID

 $gameSystem.getChapterDescription()
 Returns the chapters description

 $gameSystem.isChapterLocked()
 Returns true is the chapter is locked

 $gameSystem.lockChapter()
 Locks the chapter

 $gameSystem.unlockChapter()
 Unlocks the chapter

 -------------------------------------------------------------------------------
 # Plugin Commands

 The Plugin command keyword is: Chapter

 ## Open Chapter Select Scene
 Chapter Open

 ## Lock a chapter
 Chapter Lock chapterId

 ## Unlock a chapter
 Chapter Unlock chapterId

*/

/*~struct~Chapter:
 * @param name
 * @text Name
 * @type string
 * @desc The name of this chapter
 * @default
 *
 * @param description
 * @text Description
 * @type note
 * @desc A description or small summary of this chapter
 * @default
 *
 * @param summary
 * @text Summary
 * @type note
 * @desc A small summary of the events which occurred during this chapter
 * @default
 *
 * @param thumbnail
 * @text Thumbnail
 * @type file
 * @dir /img/
 * @desc A picture or screenshot to represent this chapter
 * @default
 *
 * @param lockState
 * @text Lock State
 * @type boolean
 * @on Unlock
 * @off Lock
 * @desc The default state of this chapter's lock. Enable to allow access on a new game
 * @default false
 *
 * @param startMapId
 * @text Start Map ID
 * @type number
 * @desc The map this chapter should load and set the player location to.
 * @default
 *
 * @param playerX
 * @text Player X
 * @type number
 * @desc The player's x axis starting position
 * @default
 *
 * @param playerY
 * @text Player Y
 * @type number
 * @desc The player's y axis starting position
 * @default
 *
 * @param requiredVariables
 * @text Required Variables
 * @type struct<VariableChange>[]
 * @desc This will be a list of variables that you need to set up for the chapter to proceed correctly
 * @default
 *
 * @param requiredSwitches
 * @text Required Switches
 * @type struct<SwitchChange>[]
 * @desc This will be a list of switches that you need to set up for the chapter to proceed correctly
 * @default
 *
 */

/*~struct~VariableChange:
 * @param id
 * @text Variable ID
 * @type variable
 * @desc The variable you want to set/change value of
 * @default
 *
 * @param value
 * @text Value
 * @type string
 * @desc The value you want to change the variable to
 * @default
 *
 */

/*~struct~SwitchChange:
 * @param id
 * @text Switch ID
 * @type switch
 * @desc The switch you want to set/change value of
 * @default
 *
 * @param value
 * @text Value
 * @type boolean
 * @desc The value you want to change the switch to
 * @default
 *
 */

/*~struct~ItemWindow:
 * @param x
 * @text X Position
 * @type number
 * @desc The position of the window on the x axis (Eval allowed)
 * @default 0
 *
 * @param y
 * @text Y Position
 * @type number
 * @desc The position of the window on the y axis (Eval allowed)
 * @default 0
 *
 * @param width
 * @text Width
 * @type number
 * @desc The width of the window (Eval allowed)
 * @default 400
 *
 * @param height
 * @text Height
 * @type number
 * @desc The height of the window (Eval allowed)
 * @default 400
 *
 * @param itemHeight
 * @text Item Height
 * @type number
 * @desc The height of each chapter rectangle in the window
 * @default 145
 *
 * @param maxItems
 * @text Max Items
 * @type number
 * @desc The max amount of items to display in the window.
 * @default 4
 *
 * @param fontSize
 * @text Font Size
 * @type number
 * @desc The default font size for the content in the window
 * @default 18
 *
 */

/*~struct~BasicWindow:
 * @param x
 * @text X Position
 * @type number
 * @desc The position of the window on the x axis (Eval allowed)
 * @default 0
 *
 * @param y
 * @text Y Position
 * @type number
 * @desc The position of the window on the y axis (Eval allowed)
 * @default 0
 *
 * @param width
 * @text Width
 * @type number
 * @desc The width of the window (Eval allowed)
 * @default 400
 *
 * @param height
 * @text Height
 * @type number
 * @desc The height of the window (Eval allowed)
 * @default 400
 *
 */

var X_Chapter = (function (exports) {
'use strict';

/**
 * Recursive method that will convert all string values in an object to a more
 * appropriate type.
 *
 * In MV there are a lot of objects filled with strings of different values, a lot
 * of times we need to convert each value manually, instead use this to quickly
 * deep parse each value from string to the correct type.
 *
 * @function convertParameters
 * @since 1.0.0
 * @memberof module:Utils
 *
 * @param {object} parameters - The string filled object you want converted
 *
 * @returns An object with it's string values converted
 * @example
 *
 * const myParams = { p1: '22', p2: 'true' }
 * convertParameters(myParams) // => { p1: 22, p2: true }
 *
 * const myParams = { p1: '{a: 1'1, c: '2'}', p2: '[{}, {}, {}]' }
 * convertParameters(myParams) // => { p1: {a: 1, c: 2}, p2: [{}, {}, {}] }
 *
 */
function convertParameters (parameters) {
  function parseParameters (string) {
    try {
      return JSON.parse(string, (key, value) => {
        try {
          return parseParameters(value)
        } catch (e) {
          return value
        }
      })
    } catch (e) {
      return string
    }
  }
  return parseParameters(JSON.stringify(parameters))
}

const pluginName = document.currentScript.src.match(/.+\/(.+).js/)[1];

const rawParameters = PluginManager.parameters(pluginName);

const _Params = convertParameters(rawParameters);

function parsePath (path) {
  let folder = '';
  let filename = '';
  const paths = path.split('/');

  if (paths.length > 2) {
    paths.forEach((p, index) => {
      if (index === paths.length - 1) {
        filename = p;
        return
      }
      folder += `${p}/`;
    });
  } else {
    folder = `img/${paths[0]}/`;
    filename = paths[1];
  }

  return { folder, filename }
}

ImageManager.loadChapterThumbnail = function (path) {
  const { filename, folder } = parsePath(path);

  return this.loadBitmap(folder, filename, null, true)
};

ImageManager.reserveChapterThumbnail = function (path, hue, reservationId) {
  const { filename, folder } = parsePath(path);
  this.reserveBitmap(folder, filename, hue, false, reservationId);
};

const initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function () {
  initialize.call(this);
  this._chapters = [];
  this.setupChapters();
};

Game_System.prototype.setupChapters = function () {
  _Params.chapters.forEach((chapter, index) => {
    this._chapters.push({
      id: index + 1,
      ...chapter
    });
  });
};

Game_System.prototype.updateChapters = function (keepLockState) {
  const oldChapters = this._chapters.clone();
  this._chapters = [];
  _Params.chapters.forEach((chapter, index) => {
    const oldChapter = oldChapters[index];
    this._chapters.push({
      id: index + 1,
      ...chapter,
      lockState: keepLockState && oldChapter ? oldChapter.lockState : chapter.lockState
    });
  });
};

Game_System.prototype.chapters = function () {
  return this._chapters
};

Game_System.prototype.getChapterById = function (chapterId) {
  return this._chapters[chapterId - 1]
};

Game_System.prototype.getChapterDescription = function (chapterId) {
  return this._chapters[chapterId - 1].description
};

Game_System.prototype.isChapterLocked = function (chapterId) {
  return this._chapters[chapterId - 1].lockState === false
};

// A locked chapter's lockState will be set to false
Game_System.prototype.lockChapter = function (chapterId) {
  this._chapters[chapterId - 1].lockState = false;
};

// An unlocked chapter's lockState will be set to true
Game_System.prototype.unlockChapter = function (chapterId) {
  this._chapters[chapterId - 1].lockState = true;
};

const aliasSetup = Game_Map.prototype.setup;
Game_Map.prototype.setup = function (mapId) {
  aliasSetup.call(this, mapId);

  if ($gameTemp.needsChapterSetup) {
    const chapter = $gameSystem.getChapterById($gameTemp.chapterId);
    const switchData = chapter.requiredSwitches;
    const variableData = chapter.requiredVariables;

    $gameTemp.needsChapterSetup = false;
    $gameTemp.chapterId = 0;

    if (switchData && switchData.length > 0) {
      switchData.forEach(data => {
        $gameSwitches.setValue(data.id, data.value);
      });
    }

    if (variableData && variableData.length > 0) {
      variableData.forEach(data => {
        $gameVariables.setValue(data.id, data.value);
      });
    }
  }
};

Game_Temp.prototype.chapterId = 0;
Game_Temp.prototype.needsChapterSetup = false;

const loadSystemImages = Scene_Boot.prototype.loadSystemImages;
Scene_Boot.prototype.loadSystemImages = function () {
  loadSystemImages.call(this);
  const thumbnailPaths = _Params.chapters.map(c => c.thumbnail);
  thumbnailPaths.forEach(path => {
    ImageManager.reserveChapterThumbnail(path);
  });
};

/* eslint-disable no-control-regex, no-useless-escape */

/**
 * Calculates the visual width of a text string, considering optional message code processing.
 * When processing message codes, text size message codes are ignored and may cause incorrect results.
 *
 * Unsupported message codes:
 * - \I[n] - ignores icon size
 * - \PX[x] - ignores position
 * - \PY[y] - ignores position
 *
 * @param {string} text - The input text to calculate the width for.
 * @param {boolean} [ignoreCodes=false] - If true, skips RPG Maker message codes while calculating width.
 * @returns {number} The calculated visual width of the text.
 */
function calculateTextWidth (text, processMessageCodes = false) {
  if (processMessageCodes) {
    // convert RPG Maker codes and then proceed to calculate width
    text = text.replace(/\\/g, '\x1b');
    text = text.replace(/\x1b\x1b/g, '\\');
    while (text.match(/\x1bV\[(\d+)\]/gi)) {
      text = text.replace(/\x1bV\[(\d+)\]/gi, (_, p1) =>
        window.$gameVariables.value(parseInt(p1))
      );
    }

    text = text.replace(/\x1bN\[(\d+)\]/gi, (_, p1) =>
      window.Window_Base.prototype.actorName(parseInt(p1))
    );

    text = text.replace(/\x1bP\[(\d+)\]/gi, (_, p1) =>
      window.Window_Base.prototype.partyMemberName(parseInt(p1))
    );

    text = text.replace(/\x1bG/gi, window.TextManager.currencyUnit);
    text = text.replace(/\x1bC\[(\d+)\]/gi, ''); // remove color codes
    text = text.replace(/\x1bI\[(\d+)\]/gi, ''); // remove icon code
    text = text.replace(/\x1bPX\[(\d+)\]/gi, ''); // remove position code
    text = text.replace(/\x1bPY\[(\d+)\]/gi, ''); // remove position code
    text = text.replace(/\x1b\^/gi, ''); // remove don't wait for input code
    text = text.replace(/\x1b</gi, ''); // remove display all text at once code
    text = text.replace(/\x1b>/gi, ''); // remove cancel display all text at once code
    text = text.replace(/\x1b!/gi, ''); // remove wait for button input code
    text = text.replace(/\x1b\|/gi, ''); // remove wait for 1 second input code
    text = text.replace(/\x1b\./gi, ''); // remove wait for 1/4 second input code
    text = text.replace(/\x1b\$/gi, ''); // remove open gold code
    text = text.replace(/\x1b\}/gi, ''); // remove decrease text size code
    text = text.replace(/\x1b\{/gi, ''); // remove increase text size code
    text = text.replace(/\x1bFS\[(\d+)\]/gi, ''); // remove change text size to n code
  }

  return [...text].reduce((width, char) => {
    width += (char.charCodeAt(0) > 255 ? 2 : 1);
    return width
  }, 0)
}

function autowrap (text, maxWidth, processMessageCodes = false) {
  const lines = [];

  text.split('\n').forEach(line => {
    if (calculateTextWidth(line, processMessageCodes) <= maxWidth) {
      lines.push(line);
    } else {
      let cur = 0;
      let tmpLine = '';

      while (cur < line.length) {
        let word = '' + line[cur++];
        if (word[0] !== ' ' && word.charCodeAt(0) < 256) {
          while (cur < line.length && line[cur] !== ' ' && line.charCodeAt(cur) < 256) {
            word += line[cur++];
          }
        }
        const wordWidth = calculateTextWidth(word, processMessageCodes);
        let tempLineWidth = calculateTextWidth(tmpLine, processMessageCodes);

        if (wordWidth > maxWidth) {
          let tmpWord = '';
          for (const char of word) {
            const tmpWidth = calculateTextWidth(tmpWord + char, processMessageCodes);
            if (tmpWidth + tempLineWidth > maxWidth) {
              lines.push(tmpLine.trim());
              tmpLine = tmpWord = char;
              tempLineWidth = 0;
            } else {
              tmpWord += char;
            }
          }
          tmpLine = tmpWord;
        } else {
          if (wordWidth + tempLineWidth > maxWidth) {
            lines.push(tmpLine.trim());
            tmpLine = (word[0] !== ' ' || word.length > 1) ? word : '';
          } else {
            tmpLine += word;
          }
        }
      }

      if (tmpLine.length > 0) {
        lines.push(tmpLine.trim());
      }
    }
  });

  return lines
}

Window_Base.prototype.standardFontFace = function () {
  if (!('isChinese' in $gameSystem)) {
    return 'GameFont'
  }
  if ($gameSystem.isChinese()) {
    return 'SimHei, Heiti TC, sans-serif'
  } else if ($gameSystem.isKorean()) {
    return 'Dotum, AppleGothic, sans-serif'
  } else {
    return 'GameFont'
  }
};

Window_Base.prototype.drawTextAutoWrap = function (text, x, y, width) {
  const charAmount = $gameSystem.isChinese() ? '  ' : ' ';
  const charWidth = this.textWidth(charAmount);
  const maxCharactersPerLine = width / charWidth;
  // we want to remove all line breaks from the text that were manually entered
  text = text.replace(/(\r\n|\n|\r)/gm, ' ');
  text = autowrap(text, maxCharactersPerLine, true).join('\n');
  Window_Base.prototype.drawTextEx.call(this, text, x, y);
};

const aliasMakeCommandList = Window_TitleCommand.prototype.makeCommandList;
Window_TitleCommand.prototype.makeCommandList = function () {
  aliasMakeCommandList.call(this);
  this.addCommand(_Params.chapterCommandText, 'chapterSelect', this.isContinueEnabled());
};

class Window_ChapterSelect extends Window_Selectable {
  constructor (rect) {
    super(rect.x, rect.y, rect.width, rect.height);
    this._page = 0;
    this._data = [];
    this._thumbnails = [];
    this.contents.fontSize = _Params.chapterWindow.fontSize;
    this.refresh();
  }

  update () {
    super.update();
  }

  refresh () {
    this.contents.clear();
    this.makeItemList();
    this.drawAllItems();
  }

  itemHeight (index) {
    return _Params.chapterWindow.itemHeight
  }

  item () {
    return this._data && this.index() >= 0 ? this._data[this.index()] : null
  }

  isCurrentItemEnabled () {
    return this.isEnabled(this.item())
  }

  isEnabled (item) {
    return item.lockState === true
  }

  makeItemList () {
    this._data = $gameSystem.chapters();
  }

  maxItems () {
    return _Params.chapterWindow.maxItems
  }

  drawTextRect (text, rect) {
    const y = rect.y + this.contents.fontSize + this.standardPadding();
    const width = this.textWidth(text) - 5;
    this.contents.fillRect(rect.x + this.standardPadding(), y + 3, width + 25, 5, _Params.horizontalLineColor);
  }

  drawItem (index) {
    if (!this._data) return
    const chapter = this._data[index];

    if (chapter) {
      const rect = this.itemRect(index);
      this.changePaintOpacity(this.isEnabled(chapter));
      this.makeFontBigger();
      this.drawText(chapter.name, rect.x + this.standardPadding(), rect.y + this.standardPadding(), rect.width);
      this.drawTextRect(chapter.name, rect);
      this.makeFontSmaller();
      this.drawTextAutoWrap(chapter.description, rect.x + this.standardPadding(), rect.y + 50 + this.standardPadding(), rect.width - 8);
    }
  }
}

class Window_ChapterThumbnail extends Window_Base {
  constructor (rect) {
    super(rect.x, rect.y, rect.width, rect.height);
    this._chapter = null;
    this.createThumbnail();
  }

  createThumbnail () {
    this._thumbnail = new Sprite();
    this._thumbnail.x = 0 + this.standardPadding();
    this._thumbnail.y = 0 + this.standardPadding();
    this._thumbnail.width = this.width / 2;
    this._thumbnail.height = this.height / 2;
    this.addChild(this._thumbnail);
  }

  setChapter (chapter) {
    this._chapter = chapter;
    this.refresh();
  }

  update () {
    super.update();
  }

  drawTextRect (text, rect) {
    const y = rect.y + this.contents.fontSize;
    const width = this.textWidth(text);
    this.contents.fillRect(rect.x, y, width + 25, 5, '#fcefb3');
  }

  refresh () {
    const chapter = this._chapter;
    if (chapter && chapter.thumbnail) {
      this._thumbnail.bitmap = ImageManager.loadChapterThumbnail(chapter.thumbnail);
      this._thumbnail.bitmap.addLoadListener((bitmap) => {
        this._thumbnail.width = this.contents.width;
        this._thumbnail.height = this.contents.height;
      });
    }
  }
}

class Window_ChapterSummary extends Window_Base {
  constructor (rect) {
    super(rect.x, rect.y, rect.width, rect.height);
    this._chapter = null;
  }

  setChapter (chapter) {
    this._chapter = chapter;
    this.refresh();
  }

  update () {
    super.update();
  }

  refresh () {
    this.contents.clear();
    this.drawTitle();
    if (this._chapter) {
      this.drawChapterSummary();
    }
  }

  makeFontSmaller () {
    if (this.contents.fontSize >= 24) {
      this.contents.fontSize -= 8;
    }
  }

  drawTitle () {
    this.drawText(_Params.summaryTitle, 0, 0, this.width - this.standardPadding(), 'center');
    this.contents.fillRect(0, 35, this.width, 5, _Params.horizontalLineColor);
  }

  drawChapterSummary () {
    const chapter = this._chapter;
    this.drawTextAutoWrap(chapter.summary, 0, 45, this.contents.width);
    this.resetFontSettings();
  }
}

class Scene_ChapterSelect extends Scene_MenuBase {
  constructor () {
    super();
    super.initialize();
    this._selectedChapter = 0;
    this._loadSuccess = false;
  }


  helpWindowRect () {
    const wx = 0;
    const wy = 0;
    const ww = Graphics.boxWidth;
    const wh = Window_Base.prototype.fittingHeight(2);
    return new Rectangle(wx, wy, ww, wh)
  }

  buttonAreaHeight () {
    return 0
  }

  create () {
    super.create();
    DataManager.createGameObjects();
    DataManager.loadAllSavefileImages();
    this.createChapterBackground();
    this.createHelpWindow();

    this.createSaveFileList();
    this.createChapterSelect();
    this.createChapterThumbnail();
    this.createChapterSummary();
  }

  start () {
    super.start();
    if (this._saveFileList) {
      this._saveFileList.refresh();
    }
    if (_Params.loadLatestSave) {
      if (this.loadSaveMv(DataManager.latestSavefileId())) {
        this._loadSuccess = true;
        this._helpWindow.setText(_Params.helpWindowTerm);
        this._chapterSelectWindow.refresh();
      }
    }
  }

  update () {
    super.update();
    if (_Params.loadLatestSave && !this._chapterSelectWindow.open()) {
      this._thumbnailWindow.open();
      this._summaryWindow.open();
      this._chapterSelectWindow.open();
      this._chapterSelectWindow.activate();
      this._helpWindow.setText(_Params.helpWindowTerm);
      this._chapterSelectWindow.refresh();
    }
    if (!_Params.loadLatestSave && !this._saveFileList.isClosing() && this._saveFileList.isClosed() && !this._chapterSelectWindow.isOpen()) {
      this._thumbnailWindow.open();
      this._summaryWindow.open();
      this._chapterSelectWindow.open();
      this._chapterSelectWindow.activate();
    }
    if (this._selectedChapter !== this._chapterSelectWindow.index()) {
      this._selectedChapter = this._chapterSelectWindow.index();
      this._thumbnailWindow.setChapter(this.selectedChapter());
      this._summaryWindow.setChapter(this.selectedChapter());
    }
  }

  createChapterBackground () {
    this._chapterBackground = new Sprite();
    this.addChild(this._chapterBackground);
  }

  chapterSelectRect () {
    return new Rectangle(
      0,
      this._tryEval(_Params.chapterWindow.y),
      this._tryEval(_Params.chapterWindow.width),
      this._tryEval(_Params.chapterWindow.height)
    )
  }

  createChapterSelect () {
    const rect = this.chapterSelectRect();

    this._chapterSelectWindow = new Window_ChapterSelect(rect);
    this._chapterSelectWindow.setHandler('ok', this.onChapterSelect.bind(this));
    this._chapterSelectWindow.setHandler('cancel', this.popScene.bind(this));
    this._chapterSelectWindow.close();
    this.addWindow(this._chapterSelectWindow);
  }

  chapterThumbnailRect () {
    const options = _Params.thumbnailWindow;
    return new Rectangle(
      this._tryEval(options.x),
      this._tryEval(options.y),
      this._tryEval(options.width),
      this._tryEval(options.height)
    )
  }

  createChapterThumbnail () {
    const rect = this.chapterThumbnailRect();

    this._thumbnailWindow = new Window_ChapterThumbnail(rect);
    this._thumbnailWindow.close();
    this.addWindow(this._thumbnailWindow);
  }

  chapterSummaryRect () {
    const options = _Params.summaryWindow;
    return new Rectangle(
      this._tryEval(options.x),
      this._tryEval(options.y),
      this._tryEval(options.width),
      this._tryEval(options.height)
    )
  }

  createChapterSummary () {
    const rect = this.chapterSummaryRect();
    this._summaryWindow = new Window_ChapterSummary(rect);
    this._summaryWindow.close();
    this.addWindow(this._summaryWindow);
  }

  saveFilelistRect () {
    const helpRect = this.helpWindowRect();
    return new Rectangle(
      0,
      helpRect.bottom,
      Graphics.boxWidth,
      Graphics.boxHeight - (helpRect.height + this.buttonAreaHeight())
    )
  }

  createSaveFileList () {
    if (_Params.loadLatestSave) {
      return
    }
    const rect = this.saveFilelistRect();

    this._saveFileList = new Window_SavefileList(0, rect.y, rect.width, rect.height);
    this._saveFileList.setHandler('ok', this.onSaveListOk.bind(this));
    this._saveFileList.setHandler('cancel', this.popScene.bind(this));
    this._saveFileList.select(0);
    this._saveFileList.setTopRow(0 - 2);
    this._helpWindow.setText('Load a save file');
    this.addWindow(this._saveFileList);
  }

  selectedChapter () {
    return this._chapterSelectWindow.item()
  }

  onSaveFileLoaded () {
    this._loadSuccess = true;
    this._saveFileList.deactivate();
    this._saveFileList.close();
    this._helpWindow.setText(_Params.helpWindowTerm);
    this._chapterSelectWindow.refresh();
  }

  onSaveListOk () {
    const savefileId = this._saveFileList.index() + 1;
    if (this.loadSaveMv(savefileId)) {
      this.onSaveFileLoaded();
    } else {
      this._saveFileList.activate();
    }
  }

  loadSaveMv (savefileId) {
    if (DataManager.loadGame(savefileId)) {
      SoundManager.playLoad();
      return true
    } else {
      SoundManager.playBuzzer();
      return false
    }
  }

  onChapterSelect () {
    const chapter = this.selectedChapter();
    this._chapterSelectWindow.close();
    this.fadeOutAll();
    if (chapter.requiredVariables || chapter.requiredSwitches) {
      $gameTemp.needsChapterSetup = true;
      $gameTemp.chapterId = chapter.id;
    }
    $gamePlayer.reserveTransfer(chapter.startMapId, chapter.playerX, chapter.playerY);
    $gamePlayer.requestMapReload();
    SceneManager.goto(Scene_Map);
  }

  _tryEval (expression) {
    try {
      // eslint-disable-next-line no-eval
      return eval(expression)
    } catch (error) {
      console.error(`Unable to evaluate the following expression ${expression}`);
    }
  }
}

var Scene_ChapterSelect$1 = /*#__PURE__*/Object.freeze({
__proto__: null,
default: Scene_ChapterSelect
});

const createCommandWindow = Scene_Title.prototype.createCommandWindow;
Scene_Title.prototype.createCommandWindow = function () {
  createCommandWindow.call(this);
  if (_Params.isChapterCommandEnabled) {
    this._commandWindow.setHandler('chapterSelect', this.commandChapterSelect.bind(this));
  }
};

Scene_Title.prototype.commandChapterSelect = function () {
  this._commandWindow.close();
  SceneManager.push(Scene_ChapterSelect);
};

const pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
  if (command.toLowerCase() === 'chapter') {
    const subCommand = args[0].toLowerCase();
    switch (subCommand) {
      case 'lock':
        $gameSystem.lockChapter(args[1]);
        break
      case 'unlock':
        $gameSystem.unlockChapter(args[1]);
        break
      case 'open':
        SceneManager.push(Scene_ChapterSelect);
        break
      case 'update':
        $gameSystem.updateChapters(args[1] === 'true');
        break
      default:
        console.error(`There was a problem with plugin command ${command} ${subCommand}`);
        break
    }
  } else {
    pluginCommand.call(this, command, args);
  }
};

exports.Scene_ChapterSelect = Scene_ChapterSelect$1;

return exports;

})({});
