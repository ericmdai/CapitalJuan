var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
    // Preload assets
    game.load.image('sky', 'assets/game/sky.png');
    game.load.image('ground', 'assets/game/platform.png');
    game.load.image('star', 'assets/game/star.png');
    game.load.image('logo', 'assets/branding/logo2.png');
    game.load.spritesheet('dude', 'assets/game/slj_head_bob_sprite.png', 32, 58);
}

var player;
var horizon;
var platforms;
var spacebar;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');
    var logo = game.add.sprite(10, 10, 'logo');

    horizon = game.add.group()
    horizon.enableBody = true;
    var ground = horizon.create(0, game.world.height - 32, 'ground');
    ground.scale.setTo(2, 1);
    ground.body.immovable = true;

    platforms = game.add.group();
    platforms.enableBody = true;
    var ledge = platforms.create(game.world.width - 1, 425, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(2, 0.5);
    // ledge = platforms.create(-150, 250, 'ground');
    // ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 900;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
}

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
