var app = angular.module("Ikaruga-like", ["ngRoute"])
  .constant("firebaseURL","https://ikaruga-like.firebaseio.com/")
  // .controller('main.js', ['', function(){
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'Ikaruga-like', { preload: preload, create: create, update: update });  
  // }])

var background;
var player;
var score = 0;
var scoreString = '';
var laserRed;
var bulletTime = 0;
var explosions;
var fireButton;
var aliens;
var scoreText;
var lives;
var enemyBullet;
var firingTimer = 0;
var livingEnemies;
var stateText;

function preload() {
  game.load.image('deep-space', 'assets/deep-space.jpg');
  game.load.image('ship', 'spaceArt/png/player.png');
  game.load.image('player', 'spaceArt/png/playerRight.png');
  game.load.image('player', 'spaceArt/png/playerLeft.png');
  game.load.image('bullet', 'spaceArt/png/laserGreen.png');
  game.load.image('bullet-hit', 'spaceArt/png/laserGreenShot.png');
  game.load.image('enemyBullet', 'spaceArt/png/laserRed.png');
  game.load.image('enemyBullet-hit', 'spaceArt/png/laserRedShot.png');
  game.load.image('life', 'spaceArt/png/life.png');
  game.load.spritesheet('explosions', 'assets/Explosion_002_Tile_8x8_256x256.png');
  game.load.spritesheet('aliens', 'assets/ships_void.png', 50, 50, 80);
}

function create() {
cursors = game.input.keyboard.createCursorKeys();

   //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    starField = game.add.tileSprite(0, 0, 800, 600, 'deep-space');

    //Bullet group
    laserRed = game.add.group();
    laserRed.enableBody = true;
    laserRed.physicsBodyType = Phaser.Physics.ARCADE;
    laserRed.createMultiple(30, 'bullet');
    laserRed.setAll('anchor.x', 0.5);
    laserRed.setAll('anchor.y', 1);
    laserRed.setAll('outOfBoundsKill', true);
    laserRed.setAll('checkWorldBounds', true);

    // The enemy's bullets
    enemylaserGreen = game.add.group();
    enemylaserGreen.enableBody = true;
    enemylaserGreen.physicsBodyType = Phaser.Physics.ARCADE;
    enemylaserGreen.createMultiple(30, 'enemyBullet');
    enemylaserGreen.setAll('anchor.x', 0.5);
    enemylaserGreen.setAll('anchor.y', 1);
    enemylaserGreen.setAll('outOfBoundsKill', true);
    enemylaserGreen.setAll('checkWorldBounds', true);

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'player');
    player.anchor.setTo(0.5, 0.5);
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. 
    player.body.collideWorldBounds = true;

    //Bad guys/aliens
    aliens = game.add.group();
    aliens.enableBody = true;
    aliens.physicsBodyType = Phaser.Physics.ARCADE;

    createAliens();
    //score
    scoreString = 'Score: ';   
    scoreText = game.add.text(16, 16, 'scoreString + score', { fontSize: '32px', fill: '#000' });
    

//  Lives
    lives = game.add.group();
    game.add.text(game.world.width - 100, 10, 'Lives : ', { fontSize: '32px', fill: '#000' });

 //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false;

    for (var i = 0; i < 3; i++) 
    {
        var ship = lives.create(game.world.width - 100 + (30 * i), 60, 'ship');
        ship.anchor.setTo(0.5, 0.5);
        ship.angle = 90;
        ship.alpha = 0.4;
    }

    // //  An explosion pool
    // explosions = game.add.group();
    // explosions.createMultiple(30, 'kaboom');
    // explosions.forEach(setupInvader, this);

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    switchShield = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
}

function createAliens () {

    for (var y = 0; y < 4; y++)
    {
        for (var x = 0; x < 10; x++)
        {
            var alien = aliens.create(x * 48, y * 50, 'aliens');
            alien.anchor.setTo(0.5, 0.5);
            alien.animations.add('fly', [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ], 8, true);
            alien.play('fly');
            alien.body.moves = false;
        }
    }

    aliens.x = 100;
    aliens.y = 50;
}

function setupInvader (alien) {

    alien.anchor.x = 0.5;
    alien.anchor.y = 0.5;
    alien.animations.add('kaboom');

}

function update() {
    if(player.alive)
    {

    //  Reset the players velocity (movement)
    player.body.velocity.setTo = 0, 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        // player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        // player.animations.play('right');
    }
    else if (cursors.up.isDown)
        // Move up/forward
        player.body.velocity.y = -150;

    else if (cursors.down.isDown)
        // Move down/back
        player.body.velocity.y = 150;
    else
    {
        //  Stand still
        // player.animations.stop();

        player.frame = 4;
    }
    if (fireButton.isDown){
        //firing?
        fireBullet();
    }
    // if (game.time.now > firingTimer){
    //     //firing?
    //     enemyFires();
    // }
        //scrolling background
    starField.tilePosition.y += 2;

        //Collision
    game.physics.arcade.overlap(laserRed, aliens, collisionHandler, null, this);
    game.physics.arcade.overlap(enemylaserGreen, player, enemyHitsPlayer, null, this);
    }
}

function collisionHandler (laserRed, alien) {

    //  When a bullet hits an alien we kill them both
    laserRed.kill();
    alien.kill();

    //  Increase the score
    score += 20;
    scoreText.text = scoreString + score;

    // //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(alien.body.x, alien.body.y);
    explosion.play('explosions', 56, false, true);

    if (aliens.countLiving() == 0)
    {
        score += 1000;
        scoreText.text = scoreString + score;

        enemylaserGreen.callAll('kill',this);
        stateText.text = " You Won, \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

function enemyHitsPlayer (player,laserGreen) {
    
    laserGreen.kill();

    live = lives.getFirstAlive();

    if (live)
    {
        live.kill();
    }

    //  And create an explosion :)
    var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x, player.body.y);
    explosion.play('kaboom', 30, false, true);

    // When the player dies
    if (lives.countLiving() < 1)
    {
        player.kill();
        enemylaserGreen.callAll('kill');

        stateText.text=" GAME OVER \n Click to restart";
        stateText.visible = true;

        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }

}

// function enemyFires () {

//     //  Grab the first bullet we can from the pool
//     enemyBullet = enemylaserGreen.getFirstExists(false);

//     livingEnemies.length=0;

//     aliens.forEachAlive(function(alien){

//         // put every living enemy in an array
//         livingEnemies.push(alien);
//     });


//     if (enemyBullet && livingEnemies.length > 0)
//     {
        
//         var random=game.rnd.integerInRange(0,livingEnemies.length-1);

//         // randomly select one of them
//         var shooter=livingEnemies[random];
//         // And fire the bullet from this enemy
//         enemyBullet.reset(shooter.body.x, shooter.body.y);

//         game.physics.arcade.moveToObject(enemyBullet,player,120);
//         firingTimer = game.time.now + 2000;
//     }

// }

function fireBullet () {

    //  To avoid them being allowed to fire too fast we set a time limit
    if (game.time.now > bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = laserRed.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        }
    }

}

function resetBullet (bullet) {

    //  Called if the bullet goes out of the screen
    bullet.kill();

}

function restart () {

    //  A new level starts
    
    //resets the life count
    lives.callAll('revive');
    //  And brings the aliens back from the dead :)
    aliens.removeAll();
    createAliens();

    //revives the player
    player.revive();
    //hides the text
    stateText.visible = false;

}


