var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/game/sky.png');
    game.load.image('ground', 'assets/game/platform.png');
    game.load.image('star', 'assets/game/star.png');
    game.load.spritesheet('dude', 'assets/game/slj_head_bob_sprite.png', 32, 58);

}

var player;
var horizon;
var platforms;
var spacebar;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple backhorizon for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    horizon = game.add.group()
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    horizon.enableBody = true;
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = horizon.create(0, game.world.height - 64, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(2, 2);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    //  Now let's create two ledges
    var ledge = platforms.create(game.world.width - 1, 400, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(2, 0.5);

    // ledge = platforms.create(-150, 250, 'ground');
    // ledge.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 900;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

}

var jumping = false;

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, horizon);
    game.physics.arcade.collide(player, platforms);

    // Move scene to the left
    platforms.forEach(function(platform) {
        platform.body.x -= 5;
        if (platform.body.x <= -platform.body.width) {
            platform.body.x = game.world.width;
        }
    });

    //  Reset the players velocity (movement)
    // player.body.velocity.x = 0;
    player.animations.play('right');

    //  Allow the player to jump if they are touching the ground.
    if (spacebar.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -550;
    }

}
