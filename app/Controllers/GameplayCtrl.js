angular.module("Ikaruga-like")
    .controller('GameplayCtrl', function($scope, firebaseURL, AuthFactory){
        var game = new Phaser.Game(1200, 800, Phaser.AUTO, 'Ikaruga-like', { preload: preload, create: create, update: update });  

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
        var livingEnemies = [];
        var stateText;
        var bulletCount = 0;
        var enemies_killed = 0;
        var lives_lost = 0;

        function preload() {
          game.load.image('deep-space', 'assets/deep-space.jpg');
          game.load.spritesheet('player', 'spaceArt/png/player.png');
          game.load.spritesheet('bullet', 'spaceArt/png/laserGreen.png');
          game.load.spritesheet('enemyBullet', 'spaceArt/png/laserRed.png');
          game.load.image('ship', 'spaceArt/png/life.png');
          game.load.spritesheet('explosions', 'https://github.com/photonstorm/phaser-examples/blob/master/examples/assets/sprites/explosion.png');
          game.load.spritesheet('enemyShip', 'spaceArt/png/enemyShip.png');
        }
    

    function create() {
        cursors = game.input.keyboard.createCursorKeys();

        //  We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        //  A simple background for our game
        starField = game.add.tileSprite(0, 0, 1200, 800, 'deep-space');

        //Bullet group
        bullets = game.add.group();
        bullets.enableBody = true;
        bullets.physicsBodyType = Phaser.Physics.ARCADE;
        bullets.createMultiple(30, 'bullet');
        bullets.setAll('anchor.x', 0.5);
        bullets.setAll('anchor.y', 1);
        bullets.setAll('outOfBoundsKill', true);
        bullets.setAll('checkWorldBounds', true);

        // The enemy's bullets
        enemyBullets = game.add.group();
        enemyBullets.enableBody = true;
        enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        enemyBullets.createMultiple(30, 'enemyBullet');
        enemyBullets.setAll('anchor.x', 0.5);
        enemyBullets.setAll('anchor.y', 1);
        enemyBullets.setAll('outOfBoundsKill', true);
        enemyBullets.setAll('checkWorldBounds', true);

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
        scoreText = game.add.text(16, 16, 'scoreString + score', { fontSize: '32px', fill: '#2AE605' });
        

        //  Lives
        lives = game.add.group();
        game.add.text(game.world.width - 100, 10, 'Lives : ', { fontSize: '32px', fill: '#2AE605' });

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
        explosions = game.add.group();
        explosions.createMultiple(30, 'explosions');
        explosions.forEach(setupInvader, this);

        //  And some controls to play the game with
        cursors = game.input.keyboard.createCursorKeys();
        fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        switchShield = game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);

    } //ends create function

    function createAliens () {

        for (var y = 0; y < 1; y++)
        {
            for (var x = 0; x < 10; x++)
            {
                var alien = aliens.create(x * 100, y * 50, 'enemyShip');
                alien.anchor.setTo(0.5, 0.5);
                alien.enableBody = true;
                //alien.animations.add('fly', null, 60, true);
                //alien.play('fly', 5, true);
                alien.body.moves = false;
            }
        }

        aliens.x = 100;
        aliens.y = 50;
    }

    function setupInvader (aliens) {

        aliens.anchor.x = 0.5;
        aliens.anchor.y = 0.5;
        aliens.animations.add('explosions');

    }


    function update() {

        //scrolling background
        starField.tilePosition.y += 2;

        if(player.alive)
        {
            //Reset the players velocity (movement)
            player.body.velocity.setTo = [0, 0];
            

            if (cursors.left.isDown)
            {
                //  Move to the left
                player.body.velocity.x = -250;

                 //player.animations.play('left');
            }
            else if (cursors.right.isDown)
            {
                //  Move to the right
                player.body.velocity.x = 250;

                 //player.animations.play('right');
            }
            else if (cursors.up.isDown)
            {
                // Move up/forward
                player.body.velocity.y = -250;
            }
            else if (cursors.down.isDown)
            {
                // Move down/back
                player.body.velocity.y = 250;
            }
            else 
            {
                player.body.velocity.y = 0;
                player.body.velocity.x = 0;
            }
            if (fireButton.isDown)
            {
                //firing?
                fireBullet();
                
            }
            //if (switchShield.)
            // else (player.alive)
            // {
            //     player.body.velocity.x = 0;
            //     player.body.velocity.y = 0;
            // }
            if (game.time.now > firingTimer)
            {
                //firing?
                enemyFires();
            }
        
            //Collision
            game.physics.arcade.overlap(bullets, aliens, collisionHandler, null, this);
            game.physics.arcade.overlap(enemyBullets, player, enemyHitsPlayer, null, this);
            }
    }

    function collisionHandler (bullet, alien) {

        //  When a bullet hits an alien we kill them both
        bullet.kill();
        alien.kill();
        enemies_killed++
        console.log(enemies_killed);

        //  Increase the score
        score += 20;
        scoreText.text = scoreString + score;

        // //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(alien.body.x, alien.body.y);
        explosion.play('explosions', 30, false, true);

        if (aliens.countLiving() === 0)
        {
            score += 1000;
            scoreText.text = scoreString + score;

            enemyBullets.callAll('kill',this);
            stateText.text = " You Won, \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart,this);
        }

    }

    function enemyHitsPlayer (player,bullet) {
            
        bullet.kill();

        live = lives.getFirstAlive();

        if (live)
        {
            live.kill();
            lives_lost++
            console.log(lives_lost);
        }

        //  And create an explosion :)
        var explosion = explosions.getFirstExists(false);
        explosion.reset(player.body.x, player.body.y);
        explosion.play('explosions', 30, false, true);

        // When the player dies
        if (lives.countLiving() < 1)
        {
            saveScore();
            player.kill();
            enemyBullets.callAll('kill');

            stateText.text=" GAME OVER \n Click to restart";
            stateText.visible = true;

            //the "click to restart" handler
            game.input.onTap.addOnce(restart,this);
        }

    }

    function enemyFires () {

         //  Grab the first bullet we can from the pool
         enemyBullet = enemyBullets.getFirstExists(false);

         livingEnemies.length=0;

         aliens.forEachAlive(function(alien){

        // put every living enemy in an array
        livingEnemies.push(alien);
         });


        if (enemyBullet && livingEnemies.length > 0)
        {
            
            var random=game.rnd.integerInRange(0,livingEnemies.length-1);

            // randomly select one of them
            var shooter=livingEnemies[random];
            // And fire the bullet from this enemy
            enemyBullet.reset(shooter.body.x, shooter.body.y);

            game.physics.arcade.moveToObject(enemyBullet,player,120);
            firingTimer = game.time.now + 2000;
        }

    }
    

    function fireBullet () {
            
            //  To avoid them being allowed to fire too fast we set a time limit
            if (game.time.now > bulletTime)
            {
                //  Grab the first bullet we can from the pool
                bullet = bullets.getFirstExists(false);

                if (bullet)
                {
                    bulletCount++
                    console.log(bulletCount);
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
    function saveScore() {
        var ref = new Firebase(firebaseURL);
        var user = AuthFactory.getUser();
        var uid = user.uid;
        var saveGame = {};
        saveGame[uid]= {
            score: score,
            shots_fired: bulletCount,
            enemies_killed: enemies_killed,
            lives_lost: lives_lost
          };
        console.log(saveGame)
        var usersRef = ref.child("users");
        usersRef.set(saveGame);
    }
});

          
    

