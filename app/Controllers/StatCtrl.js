"use strict"
angular.module("Ikaruga-like")
    .controller('StatCtrl', function($scope){

        var Phaser = Phaser || {};
        var Signal = Signal || {};
         
        Signal.GameStats = function (game, parent) {
            Phaser.Plugin.call(this, game, parent);
        };
         
        Signal.GameStats.prototype = Object.create(Phaser.Plugin.prototype);
        Signal.GameStats.prototype.constructor = Signal.GameStats;
         
        Signal.GameStats.prototype.init = function (game_state, game_stats_data) {
            // save properties
            this.game_state = game_state;
            this.game_stats = game_stats_data.game_stats;
            this.listeners = game_stats_data.listeners;
        };
         
        Signal.GameStats.prototype.listen_to_events = function () {
            this.listeners.forEach(function (listener) {
                // iterate through the group that should be listened        
                this.game_state.groups[listener.aliens].forEach(function (alien) {
                    // add a listener for each sprite in the group
                    alien.events[listener.signal].add(this.save_stat, this, 0, listener.enemies_killed, listener.value);
                }, this);
            }, this);
        };
         
        Signal.GameStats.prototype.save_stat = function (sprite, stat_name, value) {
            // increase the corresponding game stat
            this.game_stats[stat_name].value += value;
        };
    
)};