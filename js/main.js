var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var horizon;
var scenes;
var curr_scene;
var player;

var game_config = {
    speed: 5,
};

var gems;
var spikes;

var playerJumped = false;
var globalGravity = 1500;

var score = 0;
var scoreText;
var gameOverText;

var collected = {
    'silver': 0,
    'gold': 0,
    'diamond': 0
}

var numJumps = 0;

var keys = {};

function preload() {
    // Preload assets
    game.load.image('sky', 'assets/game/sky.png');
    game.load.image('ground', 'assets/game/platform.png');
    game.load.image('logo', 'assets/branding/logo2.png');
    game.load.image('silverNugget', 'assets/game/silver_nug.png');
    game.load.image('goldNugget', 'assets/game/gold_nug.png');
    game.load.image('diamond', 'assets/game/diamond.png');
    game.load.image('singleSpike', 'assets/game/spikes1.png');
    game.load.image('doubleSpikes', 'assets/game/spikes2.png');
    game.load.image('tripleSpikes', 'assets/game/spikes3.png');
    game.load.image('quadSpikes', 'assets/game/spikes4.png');
    game.load.spritesheet('dude', 'assets/game/slj_head_bob_sprite.png', 32, 58);
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');
    var logo = game.add.sprite(10, 10, 'logo');
    scoreText = game.add.text(640, 16, 'Score: 0', { fontSize: '30px', fill: '#000' });

    horizon = game.add.group();
    platforms = game.add.group();
    gems = game.add.group();
    spikes = game.add.group();

    horizon.enableBody = true;
    platforms.enableBody = true;
    gems.enableBody = true;
    spikes.enableBody = true;

    var ground = horizon.create(0, game.world.height - 32, 'ground');
    ground.scale.setTo(2, 1);
    ground.body.immovable = true;

    scenes = [];
    var scene1 = game.add.group();

    scene1 = game.add.group();
    scene1.enableBody = true;
    var ledge = scene1.create(0, 475, 'ground');
    ledge.scale.setTo(1, 0.5);
    ledge.body.immovable = true;
    ledge = scene1.create(200, 375, 'ground');
    ledge.scale.setTo(1, 0.5);
    ledge.body.immovable = true;
    scene1.width = scene1.children.reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0) ;
    scenes.push(scene1);
    curr_scene = scenes[0];

    curr_scene.forEach((scene_object) => scene_object.reset(scene_object.x + game.world.width, scene_object.y));


    // var silverNug = gems.create(game.world.width, 370, 'silverNugget');
    // var goldNug = gems.create(game.world.width, 370, 'goldNugget');
    var diamond = gems.create(game.world.width + 50, 370, 'diamond');
    gems.forEach((gem) => scene1.add(gem));

    diamond.body.immovable = true;

    var single = spikes.create(game.world.width - 200, game.world.height - 90, 'singleSpike');
    var double = spikes.create(game.world.width - 170, game.world.height - 90, 'doubleSpikes');
    var triple = spikes.create(game.world.width - 120, game.world.height - 90, 'tripleSpikes');
    var quad = spikes.create(game.world.width - 60, game.world.height - 90, 'quadSpikes');

    single.body.immovable = true;
    single.scale.setTo(0.5, 0.5);
    double.body.immovable = true;
    double.scale.setTo(0.5, 0.5);
    triple.body.immovable = true;
    triple.scale.setTo(0.5, 0.5);
    quad.body.immovable = true;
    quad.scale.setTo(0.5, 0.5);

    player = game.add.sprite(100, ground.y - ground.height - 25, 'dude');
    game.physics.arcade.enable(player);

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
    game.physics.arcade.overlap(player, gems, collectGem, null, this);
    game.physics.arcade.overlap(player, spikes, handleDeath, null, this);

    // player.body.x = 50;

    // Move scene to the left
    curr_scene.forEach((scene_object) => scene_object.body.x -= game_config.speed);

    // Check if scene is over
    var min_pos = curr_scene.children.reduce((acc, curr) => Math.min(acc, curr.x), game.world.width);
    if (min_pos <= -curr_scene.width) {
        // Reset current scene
        curr_scene.forEach((scene_object) => scene_object.x -= min_pos);
        // TODO: Respawn coins and shit

        curr_scene = scenes[0]; // TODO: Pick a random scene
        curr_scene.forEach((scene_object) => scene_object.reset(scene_object.x + game.world.width, scene_object.y));
    }

    // Reset the players velocity (movement)
    player.animations.play('right');

    // Allow the player to jump if they are touching the ground.
    if (keys.spacebar.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -450;
        playerJumped = true;
        numJumps += 1;
    } else if (keys.spacebar.isDown && playerJumped) {
        player.body.gravity.y = globalGravity - 700;
    } else {
        playerJumped = false;
        player.body.gravity.y = globalGravity;
    }
}

function collectGem(player, gem) {

    console.log(gem);

    if (gem.key === "silverNugget") {
        score += 1;
        collected.silver += 1;
    } else if (gem.key === "goldNugget") {
        score += 3;
        collected.gold += 1;

    } else {
        score += 5;
        collected.diamond += 1;

    }

    scoreText.text = 'Score: ' + score;
    gem.kill();

}

function handleDeath (player, spike) {

    console.log('num jumps: ' + numJumps + '\n num silver: ' + collected.silver + '\n num gold: ' + collected.gold + '\n num diamond: ' + collected.diamond);

    game.add.text(310, 180, 'Game Over', { fontSize: '30px', fill: '#000' });
    game.add.text(75, 240, 'Press the Space Key to return to your session:', { fontSize: '30px', fill: '#000' });
    game.paused = true;
    keys.spacebar.onDown.add(() => {
        //window.location.replace('https://www.capitalone.com/')
    }, this);
}
