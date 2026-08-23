Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(symbol);
    if (this.isVolumeSymbol(symbol)) {
        return value + '%';
    } else {
        return value ? 'Wł.' : 'Wył.';
    }
};