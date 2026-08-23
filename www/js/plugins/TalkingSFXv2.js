/*:
 * @plugindesc Plugin dodaje możliwość dodania efektu dźwiękowego (SFX) podczas gadania (wyświetlania tekstu) (coś w stylu deltarune i undertale).
 * @author GalaxyLIVAN
 *
 * @help
 * Aby uruchomić dźwięk w danym evencie, użyj Plugin Command i wpisz tam:
 * * SFX:nazwa_pliku (pamiętaj o dawaniu "_" zamiast spacji)
 * * Przykład: SFX: Test
 * (Plik musi znajdować się w folderze audio/se i być w formacie .ogg)
 * * Aby wyłączyć dźwięk w trakcie eventu lub przed kolejnym dialogiem, wpisz:
 * SFX:off
 */

(function() {
    var _TextSFX_name = '';
    var _charCount = 0;

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.apply(this, arguments);
        
        // Sprawdza czy komenda zaczyna się od SFX:
        if (command.toUpperCase().startsWith('SFX:')) {
            // Pobiera nazwę pliku po dwukropku (jeśli nie było spacji) 
            // lub z pierwszego argumentu (jeśli była spacja)
            var fileName = command.split(':')[1] || args[0];
            
            if (fileName) {
                fileName = fileName.trim();
                _TextSFX_name = (fileName.toLowerCase() === 'off') ? '' : fileName;
            }
        }
    };

    var _Window_Message_processNormalCharacter = Window_Message.prototype.processNormalCharacter;
    Window_Message.prototype.processNormalCharacter = function(textState) {
        _Window_Message_processNormalCharacter.call(this, textState);
        
        if (_TextSFX_name === '' || this._showFast || this._lineShowFast) return;

        var lastChar = textState.text[textState.index - 1];

        if (lastChar && lastChar.trim() !== '') {
            _charCount++;
            // Dźwięk co 2 znaki dla lepszego rytmu
            if (_charCount % 2 === 0) {
                AudioManager.playStaticSe({
                    name: _TextSFX_name,
                    pan: 0,
                    pitch: 100,
                    volume: 90
                });
            }
        }
    };

    var _Window_Message_startMessage = Window_Message.prototype.startMessage;
    Window_Message.prototype.startMessage = function() {
        _charCount = 0;
        _Window_Message_startMessage.call(this);
    };
})();