var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var horizon;
var scenes;
var curr_scene;
var player;

var game_config = {
    speed: 5,
    server_url: 'http://127.0.0.1:8001/test/',
};

var gems;
var spikes;

var playerJumped = false;
var globalGravity = 1500;

var score = 0;
var scoreText;
var gameOverText;

var sceneIdx = 0;

var data = {
    'silver': 0,
    'gold': 0,
    'diamond': 0,
    'jumps': 0
}
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
    game.load.image('money1', 'assets/game/money1.png');
    game.load.image('money2', 'assets/game/money2.png');
    game.load.spritesheet('dude', 'assets/game/slj_head_bob_sprite.png', 32, 58);
}

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.add.sprite(0, 0, 'sky');
    var logo = game.add.sprite(10, 10, 'logo');
    scoreText = game.add.text(640, 16, 'Score: 0', { fontSize: '30px', fill: '#000' });

    horizon = game.add.group();

    horizon.enableBody = true;

    var ground = horizon.create(0, game.world.height - 32, 'ground');
    ground.scale.setTo(2, 1);
    ground.body.immovable = true;

    scenes = [];

    // Scene 0
    scenes.push(addScene());
    curr_scene = scenes[0];

    createMoney(3, 200, 375 - 95, 1, 0.5, 'money1');
    createMoney(4, 0, 475 - 50, 1, 0.5, 'money1');

    curr_scene.platforms.enableBody = true;

    var diamond = curr_scene.gems.create(550, game.world.height - 200, 'diamond');
    diamond.body.immovable = true;

    var silverNug = curr_scene.gems.create(310, game.world.height - 345, 'silverNugget');
    silverNug.body.immovable = true;

    var goldNug = curr_scene.gems.create(400, game.world.height-100, 'goldNugget');
    goldNug.body.immovable = true;

    var single = curr_scene.spikes.create(0, game.world.height - 56, 'singleSpike');
    single.body.immovable = true;
    single.scale.setTo(0.5, 0.5);
    var double = curr_scene.spikes.create(100, game.world.height - 200, 'doubleSpikes');
    double.body.immovable = true;
    double.scale.setTo(0.5, 0.5);

    double = curr_scene.spikes.create(310, game.world.height - 260, 'doubleSpikes');
    double.body.immovable = true;
    double.scale.setTo(0.5, 0.5);
    double.rotation = 3.14;

    double = curr_scene.spikes.create(450, game.world.height - 200, 'doubleSpikes');
    double.body.immovable = true;
    double.scale.setTo(0.5, 0.5);

    curr_scene.width = [curr_scene.platforms.children, curr_scene.gems.children, curr_scene.spikes.children].reduce(function (a, b) {
        return a.concat( b );
    }, []).reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0);
    curr_scene.moveRight();


    // Scene 1

    scenes.push(addScene());
    curr_scene = scenes[1];

    var ledge1 = curr_scene.platforms.create(0, 475, 'ground');
    ledge1.scale.setTo(1, 0.5);
    ledge1.body.immovable = true;

    //createMoney(3, 0, 475, 0.5, 1, 'money1');

    ledge2 = curr_scene.platforms.create(ledge1.body.x + ledge1.body.width + 50, 475, 'ground');
    ledge2.scale.setTo(1, 0.5);
    ledge2.body.immovable = true;

    ledge3 = curr_scene.platforms.create(ledge1.body.x + 3/4*ledge1.body.width, 375, 'ground');
    ledge3.scale.setTo(1, 0.25)
    ledge3.body.immovable = true;
    curr_scene.platforms.enableBody = true;

    // curr_scene.platforms.width = curr_scene.platforms.children.reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0) ;



    // var silverNug = gems.create(game.world.width, 370, 'silverNugget');
    // var goldNug = gems.create(game.world.width, 370, 'goldNugget');
    var diamond = curr_scene.gems.create(ledge3.body.x + 3/4*ledge3.body.width, ledge3.body.y - 40, 'diamond');
    diamond.body.immovable = true;

    var silverNug = curr_scene.gems.create(ledge1.body.x + ledge1.body.width/2, ledge1.body.y - 20, 'silverNugget');
    silverNug.body.immovable = true;



 

    var single = curr_scene.spikes.create(0, game.world.height - 56, 'singleSpike');
    single.body.immovable = true;
    single.scale.setTo(0.5, 0.5);

    curr_scene.width = [curr_scene.platforms.children, curr_scene.gems.children, curr_scene.spikes.children].reduce(function (a, b) {
        return a.concat( b );
    }, []).reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0);
    curr_scene.moveRight();


    // First scene to be shown
    curr_scene = scenes[0];
    curr_scene.moveRight();


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
    game.physics.arcade.collide(player, curr_scene.platforms);
    game.physics.arcade.overlap(player, curr_scene.gems, collectGem, null, this);
    game.physics.arcade.overlap(player, curr_scene.spikes, handleDeath, null, this);

    // player.body.x = 50;

    player.animations.play('right');
    curr_scene.moveLeft();

    // Check if scene is over
    curr_scene.checkOver();


    // Allow the player to jump if they are touching the ground.
    if (keys.spacebar.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -530;
        playerJumped = true;
        data.jumps += 1;
    } else if (keys.spacebar.isDown && playerJumped) {
        player.body.gravity.y = globalGravity - 700;
    } else {
        playerJumped = false;
        player.body.gravity.y = globalGravity;
    }
}

function collectGem(player, gem) {

    if (gem.visible) {
        if (gem.key === "silverNugget") {
            gem.visible = false;
            score += 1;
            data.silver += 1;
        } else if (gem.key === "goldNugget") {
            gem.visible = false;
            score += 3;
            data.gold += 1;

        } else {
            gem.visible = false;
            score += 5;
            data.diamond += 1;
        }
        scoreText.text = 'Score: ' + score;

    }


}

function handleDeath (player, spike) {

    console.log('num jumps: ' + data.jumps + '\n num silver: ' + data.silver + '\n num gold: ' + data.gold + '\n num diamond: ' + data.diamond);

    game.add.text(310, 180, 'Game Over', { fontSize: '30px', fill: '#000' });
    game.add.text(75, 240, 'Press the Space Key to return to your session:', { fontSize: '30px', fill: '#000' });
    game.paused = true;
    keys.spacebar.onDown.add(() => {
        //  window.location.replace('https://www.capitalone.com/')
        window.location.replace('http://localhost:8000')
    }, this);

    post_data();
}

function addScene() {
    scene = new Object();
    scene.platforms = game.add.group();
    scene.platforms.enableBody = true;
    scene.gems = game.add.group();
    scene.gems.enableBody = true;
    scene.spikes = game.add.group();
    scene.spikes.enableBody = true;

    scene.moveRight = function() {
        this.platforms.forEach((platform) => platform.reset(platform.x + game.world.width, platform.y));
        this.gems.forEach((gem) => gem.reset(gem.x + game.world.width, gem.y));
        this.spikes.forEach((spike) => spike.reset(spike.x + game.world.width, spike.y));
    };

    scene.moveLeft = function() {
        this.platforms.forEach((platform) => platform.body.x -= game_config.speed);
        this.gems.forEach((gem) => gem.body.x -= game_config.speed);
        this.spikes.forEach((spike) => spike.body.x -= game_config.speed);
    };

    scene.checkOver = function() {
        var min_pos_platform = this.platforms.children.reduce((acc, curr) => Math.min(acc, curr.x), game.world.width);
        var min_pos_gem = this.gems.children.reduce((acc, curr) => Math.min(acc, curr.x), game.world.width);
        var min_pos_spike = this.spikes.children.reduce((acc, curr) => Math.min(acc, curr.x), game.world.width);
        var min_pos = Math.min(min_pos_platform, Math.min(min_pos_gem, min_pos_spike));

        if (min_pos <= -scene.width) {
            checkOverEach(min_pos, this.platforms, this);
            checkOverEach(min_pos, this.gems, this);
            checkOverEach(min_pos, this.spikes, this);

            sceneIdx += 1;
            console.log(sceneIdx);
            sceneIdx %= scenes.length;
            console.log(sceneIdx);

            curr_scene = scenes[sceneIdx];

            post_data();
        }

        
    };

    return scene;
}

function checkOverEach(min_pos, scene_component, scene){
    if (min_pos <= -scene.width) {
        // console.log("asdfasdfasdf");
        // Reset current scene
        scene_component.forEach((scene_object) => scene_object.x -= min_pos);
        // console.log(min_pos);
        // TODO: Respawn coins and shit
        scene_component.forEach((scene_object) => scene_object.reset(scene_object.x + game.world.width, scene_object.y));

        // var blah = Math.floor(Math.random() * scenes.legnth);
        // console.log(blah);
        
    }
}

function post_data() {
    // Send post request to remote server
    var xhr = new XMLHttpRequest();
    xhr.open("POST", game_config.server_url);
    xhr.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(data));
}

function createMoney(length, x, y, widthMod, heightMod, type) {
    for(var i = 0; i < length; i++) {
        ledge = curr_scene.platforms.create(x + (127 * i * widthMod), y, type);
        ledge.scale.setTo(widthMod, heightMod);
        ledge.body.immovable = true;
    }
}

function createGem(x, y, type) {
    gem = curr_scene.gems.create(x + widthMod, y, type);
    gem.body.immovable = true;
}

function createSpike(x, y, widthMod, heightMod, type) {
    gem = curr_scene.spikes.create(x + widthMod, y, type);
    spikes.scale.setTo(widthMod, heightMod);
    spikes.body.immovable = true;
}