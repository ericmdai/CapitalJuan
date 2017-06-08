var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('sky', 'assets/game/sky.png');
    game.load.image('ground', 'assets/game/platform.png');
    game.load.image('silverNugget', 'assets/game/silver_nug.png');
    game.load.image('goldNugget', 'assets/game/gold_nug.png');
    game.load.image('diamond', 'assets/game/diamond.png');
    game.load.image('singleSpike', 'assets/game/spikes1.png');
    game.load.image('doubleSpikes', 'assets/game/spikes2.png');
    game.load.image('tripleSpikes', 'assets/game/spikes3.png');
    game.load.image('quadSpikes', 'assets/game/spikes4.png');

    game.load.spritesheet('dude', 'assets/game/slj_head_bob_sprite.png', 32, 58);

}

var player;
var horizon;
var platforms;
var gems;
var spikes;
var spacebar;

var playerJumped = false;
var globalGravity = 1500;

var score = 0;
var scoreText;
var gameOverText;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');
    scoreText = game.add.text(640, 16, 'Score: 0', { fontSize: '30px', fill: '#000' });
    horizon = game.add.group();
    platforms = game.add.group();
    gems = game.add.group();
    spikes = game.add.group();

    horizon.enableBody = true;
    platforms.enableBody = true;
    gems.enableBody = true;
    spikes.enableBody = true;

    var ground = horizon.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    var ledge = platforms.create(game.world.width - 1, 400, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(2, 0.5);

    var silverNug = gems.create(game.world.width - 190, 370, 'silverNugget');
    var goldNug = gems.create(game.world.width - 120, 370, 'goldNugget');
    var diamond = gems.create(game.world.width - 50, 370, 'diamond');
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

    player = game.add.sprite(32, ground.y - ground.height + 10, 'dude');
    game.physics.arcade.enable(player);

    player.body.gravity.y = 900;
    player.body.collideWorldBounds = true;

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
    game.physics.arcade.overlap(player, gems, collectGem, null, this);
    game.physics.arcade.overlap(player, spikes, handleDeath, null, this);




    gems.forEach(function(gem) {
        gem.body.x -= 5;
        if (gem.body.x <= -gem.body.width) {
            gem.body.x = game.world.width;
        }
    });


    // Move scene to the left
    platforms.forEach(function(platform) {
        platform.body.x -= 5;
        if (platform.body.x <= -platform.body.width) {
            platform.body.x = game.world.width;
        }
    });

    spikes.forEach(function(spike) {
        spike.body.x -= 5;
        if (spike.body.x <= -spike.body.width) {
            spike.body.x = game.world.width;
        }
    });

    //  Reset the players velocity (movement)
    // player.body.velocity.x = 0;
    player.animations.play('right');


    //  Allow the player to jump if they are touching the ground.
    if (spacebar.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -450;
        playerJumped = true;
    } else if (spacebar.isDown && playerJumped) {
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
    } else if (gem.key === "goldNugget") {
        score += 3;
    } else {
        score += 5;
    }

    scoreText.text = 'Score: ' + score;
    gem.kill();

}

function handleDeath (player, spike) {

    game.add.text(310, 180, 'Game Over', { fontSize: '30px', fill: '#000' });
    game.add.text(75, 240, 'Press the Space Key to return to your session:', { fontSize: '30px', fill: '#000' });
    game.paused = true;
    spacebar.onDown.add(() => {
        //window.location.replace('https://www.capitalone.com/')    
    }, this);
}
