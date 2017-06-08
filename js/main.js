var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var horizon;
var scenes;
var curr_scene;
var player;

var game_config = {
    speed: 7,
};

var keys = {};

function preload() {
    // Preload assets
    game.load.image('sky', 'assets/game/sky.png');
    game.load.image('ground', 'assets/game/platform.png');
    game.load.image('star', 'assets/game/star.png');
    game.load.image('logo', 'assets/branding/logo2.png');
    game.load.spritesheet('dude', 'assets/game/slj_head_bob_sprite.png', 32, 58);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');
    var logo = game.add.sprite(10, 10, 'logo');

    horizon = game.add.group();
    horizon.enableBody = true;
    var ground = horizon.create(0, game.world.height - 32, 'ground');
    ground.scale.setTo(2, 1);
    ground.body.immovable = true;

    scenes = [];
    var scene1 = game.add.group();

    scene1 = game.add.group();
    scene1.enableBody = true;
    var ledge = scene1.create(0, 425, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(2, 0.5);
    ledge = scene1.create(400, 300, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(2, 0.5);
    scene1.width = scene1.children.reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0) ;
    scenes.push(scene1);

    curr_scene = scenes[0];

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 900;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    keys.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
}

function update() {
    // Collide the player and the stars with the current scene
    game.physics.arcade.collide(player, horizon);
    game.physics.arcade.collide(player, curr_scene);

    player.body.x = 32;

    // Move scene to the left
    curr_scene.forEach((scene_object) => scene_object.body.x -= game_config.speed);

    // Check if scene is over
    var min_pos = curr_scene.children.reduce((acc, curr) => Math.min(acc, curr.x), game.world.width);
    console.log(min_pos);
    if (min_pos <= -curr_scene.width) {
        console.log('RESET');
        // Reset current scene
        curr_scene.forEach((scene_object) => scene_object.x -= min_pos);
        // TODO: Respawn coins and shit

        curr_scene = scenes[0]; // TODO: Pick a random scene
        curr_scene.forEach((scene_object) => scene_object.reset(scene_object.x + game.world.width, scene_object.y));
    }

    // Reset the players velocity (movement)
    // player.body.velocity.x = 0;
    player.animations.play('right');

    // Allow the player to jump if they are touching the ground.
    if (keys.spacebar.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -550;
    }
}
