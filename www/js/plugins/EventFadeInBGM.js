/*:
 * @plugindesc Fade-in BGM (5s) when specific events are activated on Map 18
 * @author enotekk
 *
 * @help
 * This plugin makes the BGM fade in over 5 seconds when
 * events 168-173 are activated on map ID 18.
 */

(function() {

    const TARGET_MAP_ID = 18;
    const TARGET_EVENTS = [168, 169, 170, 171, 172, 173];
    const FADE_DURATION = 5; // seconds

    const _Game_Event_start = Game_Event.prototype.start;
    Game_Event.prototype.start = function() {
        _Game_Event_start.call(this);

        if ($gameMap.mapId() === TARGET_MAP_ID &&
            TARGET_EVENTS.includes(this.eventId())) {

            if (AudioManager._bgmBuffer) {
                AudioManager.fadeInBgm(FADE_DURATION);
            }
        }
    };

})();
