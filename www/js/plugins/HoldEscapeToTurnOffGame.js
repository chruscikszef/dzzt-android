/*:
 * @plugindesc Przytrzymanie ESC zamyka grę + animowany napis "Wyłączanie gry..." w lewym górnym rogu. 
 * @author enotekk
 *
 * @param HoldTime
 * @text Czas przytrzymania ESC (w klatkach)
 * @type number
 * @default 120
 * @desc 120 = ok. 2 sekundy przy 60 FPS
 *
 * @param DotSpeed
 * @text Szybkość animacji kropek (w klatkach)
 * @type number
 * @default 20
 * @desc Co ile klatek zmienia się ilość kropek.
 *
 * @help
 * Przytrzymaj ESC, aby zamknąć grę.
 * W lewym górnym rogu pojawia się animowany napis:
 * "Wyłączanie gry..."
 *
 * Kropki animują się w pętli: brak → . → .. → ... → (powrót)
 */

(function() {

    const params = PluginManager.parameters('HoldEscapeExitAnimated');
    const HOLD_TIME  = Number(params['HoldTime'] || 120);
    const DOT_SPEED  = Number(params['DotSpeed'] || 20);

    let escHoldCounter = 0;
    let dotCounter = 0;
    let dotFrame = 0;
    let messageSprite = null;

    // Tworzymy sprite tekstu na mapie
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        createMessageSprite(this);
    };

    function createMessageSprite(scene) {
        messageSprite = new Sprite(new Bitmap(400, 60));
        messageSprite.x = 10;
        messageSprite.y = 10;
        scene.addChild(messageSprite);
        messageSprite.visible = false;
    }

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        updateEscapeHold();
        updateDots();
        updateMessageSprite();
    };

    function updateEscapeHold() {
        if (Input.isPressed('escape')) {
            escHoldCounter++;

            messageSprite.visible = true;

            if (escHoldCounter >= HOLD_TIME) {
                // Zamknięcie gry (działa tylko w NW.js — czyli w MV na Windowsie)
                if (typeof require === "function") {
                    const gui = require('nw.gui');
                    gui.App.quit();
                } else {
                    // awaryjnie zamknij scenę (np. w testach)
                    window.close();
                }
            }
        } else {
            escHoldCounter = 0;
            messageSprite.visible = false;
            dotCounter = 0;
            dotFrame = 0;
        }
    }

    function updateDots() {
        if (!messageSprite.visible) return;

        dotFrame++;
        if (dotFrame >= DOT_SPEED) {
            dotFrame = 0;
            dotCounter = (dotCounter + 1) % 4; // 0,1,2,3 → powrót
        }
    }

    function updateMessageSprite() {
        if (!messageSprite.visible) return;

        const dots = ".".repeat(dotCounter);
        const text = "Wyłączanie gry" + dots;

        const bitmap = messageSprite.bitmap;
        bitmap.clear();
        bitmap.fontSize = 22;
        bitmap.drawText(text, 0, 0, 380, 40, "left");
    }

})();
