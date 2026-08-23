//=============================================================================
// OpheliaEnigma_FullscreenResolution.js
//=============================================================================

/*:
 * @plugindesc Allows the developer to set a specific resolution throughout the game
 * and start it in fullscreen.
 *
 * @author OpheliaEnigma
 *
 * @param width
 * @desc Number of pixels for new resolution's width.
 * Maintaining a ratio close to 16:9 is preferred.
 * @default 1104
 *
 * @param height
 * @desc Number of pixels for new resolution's height.
 * Maintaining a ratio close to 16:9 is preferred.
 * @default 624
 * 
 * @help
 *
 * Allows the developer to set a specific resolution throughout the game. The
 * game will be launched in fullscreen with the chosen resolution.
 *
 * When overriding the default resolution (816x624), maintaining a ratio close
 * to 16:9 is preferred in order to eliminate black bars on fullscreen mode
 * because must modern screens use this ratio. The default override resolution
 * on this plugin is set to 1104x624 because it retains the original height
 * of RPG Maker MV's default resolution, thus avoiding the need to change most
 * plugins, has a ratio very close to 16:9 and is still divisible by 48 (17*3,
 * the default map tilesize number of pixels).
 * 
 *                      COPYRIGHT NOTICE:
 *                      -----------------
 *
 * This plugin is free to be used for non-commercial projects, however, for
 * usage on commercial projects, please visit https://opheliaenigma.itch.io/
 * and donate the amount specified for this plugin. Any doubt don't hesitate
 * to contact me, OpheliaEnigma, either through the specified link or my
 * email address: OpheliaEnigmaUltimateCoder [at] gmail.com
 */


//=============================================================================
// OpheliaEnigma_FullscreenResolution Code
//=============================================================================
(function(){

	// get plugin parameters
	params = PluginManager.parameters('OpheliaEnigma_FullscreenResolution');

	var _width  = Number(params["width"]);
	var _height = Number(params["height"]);
	
	//=============================================================================
	// Scene_Boot
	//=============================================================================
	var _SBS = Scene_Boot.prototype.start;
	
	Scene_Boot.prototype.start = function() {
		_SBS.call(this);
		Graphics._switchFullScreen();
	}
	
	//=============================================================================
	// Scene_Base_Create
	//=============================================================================
	var _SBC = Scene_Base.prototype.create;
	
	Scene_Base.prototype.create = function() {
		_SBC.call(this);
		Graphics.height    = _height;
		Graphics.width     = _width;
		Graphics.boxWidth  = _width;
		Graphics.boxHeight = _height;
	}
})();
