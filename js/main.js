var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var horizon;
var scenes;
var curr_scene;
var player;

var game_config = {
    speed: 5,
    // server_url: 'http://localhost:8001/test/',
    server_url: 'http://ec2-52-39-254-117.us-west-2.compute.amazonaws.com/test/',
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

// <<<<<<< HEAD
//     var ledge = curr_scene.platforms.create(0, 475 - 50, 'ground');
//     ledge.scale.setTo(1, 0.5);
//     ledge.body.immovable = true;
//     // ledge = curr_scene.platforms.create(200, 375 - 75, 'ground');
//     ledge.scale.setTo(1, 0.5);
//     ledge.body.immovable = true;
//     var ledge = curr_scene.platforms.create(0, 475 - 50, 'ground');
//     ledge.scale.setTo(2,0.5);
//     ledge.body.immovable = true;
//     curr_scene.platforms.enableBody = true;


// =======
// >>>>>>> eric2
    createMoney(3, 200, 375 - 95, 1, 0.5, 'money1');
    createMoney(5, 0, 475 - 50, 1, 0.5, 'money1');

    curr_scene.platforms.enableBody = true;

    // var diamond = curr_scene.gems.create(550, game.world.height - 200, 'diamond');
    // diamond.body.immovable = true;

    createGem(550, game.world.height - 200, 'diamond');
    createGem(310, game.world.height - 345, 'silverNugget');
    createGem(400, game.world.height-100, 'goldNugget');

    // createSpike(0, game.world.height - 56, 0.5, 0.5, 'singleSpike', 0);
    createSpike(100, game.world.height - 200, 0.5, 0.5, 'doubleSpikes', 0);
    createSpike(310, game.world.height - 260, 0.5, 0.5, 'doubleSpikes', 3.14);
    createSpike(450, game.world.height - 200, 0.5, 0.5, 'doubleSpikes', 0)
    createSpike(100,game.world.height - 58,0.5,0.5,'doubleSpikes');

    curr_scene.width = [curr_scene.platforms.children, curr_scene.gems.children, curr_scene.spikes.children].reduce(function (a, b) {
        return a.concat( b );
    }, []).reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0);
    curr_scene.moveRight();


    //START CUT
    // Scene 1
    scenes.push(addScene());
    scenes.push(addScene());

    curr_scene = scenes[2];
    var stepSize = 265/2;
    var start = 415;
    createMoney(3,0,start,1,0.5,'money1');
    createMoney(3, 300, start - stepSize, 1, 0.5, 'money1');
    createMoney(3,550,start - 2*stepSize - 25,1,0.5,'money1');

    curr_scene.platforms.enableBody = true;
    curr_scene.platforms.width = curr_scene.platforms.children.reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0) ;

    //0th level
    var double = curr_scene.spikes.create(0, game.world.height - 56, 'doubleSpikes');
    double.body.immovable = true;
    double.scale.setTo(0.5, 0.5);

    var single = curr_scene.spikes.create(150, game.world.height - 56 - stepSize/2 -5 , 'singleSpike');
    single.body.immovable = true;
    single.scale.setTo(0.5, 0.5);
    single.rotation = 3.14;

    var goldGem = curr_scene.gems.create(200, game.world.height - 56, 'goldNugget');

    var trips = curr_scene.spikes.create(240, game.world.height - 56, 'tripleSpikes');
    trips.body.immovable = true;
    trips.scale.setTo(0.5, 0.5);

    //1st level
    var triple= curr_scene.spikes.create(115, game.world.height - 56 - stepSize/2 - 88, 'tripleSpikes');
    triple.body.immovable = true;
    triple.scale.setTo(0.5, 0.5);

    var silverGem = curr_scene.gems.create(225, game.world.height - 56 - stepSize/2 - 87, 'silverNugget');

    //2nd Level
    var quads = curr_scene.spikes.create(400, game.world.height - 56 - 2*stepSize - 23, 'quadSpikes');
    quads.body.immovable = true;
    quads.scale.setTo(0.5, 0.5);

    var sings = curr_scene.spikes.create(625, game.world.height - 56 - 2*stepSize - 99, 'quadSpikes');
    sings.body.immovable = true;
    sings.scale.setTo(0.5, 0.4);
    sings.rotation = 3.14

    // var sings2 = curr_scene.spikes.create(555, game.world.height - 56 - 2*stepSize - 19, 'singleSpike');
    // sings.body.immovable = true;
    // sings2.scale.setTo(0.5, 0.4);

    var sings3 = curr_scene.spikes.create(706, game.world.height - 56 - 2*stepSize + 5, 'singleSpike');
    sings.body.immovable = true;
    sings3.scale.setTo(0.5, 0.5);
    sings3.rotation = 1.57;

    var diam = curr_scene.gems.create(625, game.world.height - 56 - 2*stepSize - 23, 'diamond');


    curr_scene.width = [curr_scene.platforms.children, curr_scene.gems.children, curr_scene.spikes.children].reduce(function (a, b) {
        return a.concat( b );
    }, []).reduce((acc, curr) => Math.max(acc, curr.x + curr.width), 0);
    curr_scene.moveRight();

//END CUT

    // Scene 2

    //scenes.push(addScene());
    curr_scene = scenes[1];

    // function createMoney(length, x, y, widthMod, heightMod, type)

    createMoney(10, game.world.length/4, 3/4*game.world.height, 0.5, 0.5, 'money1');
    createMoney(3, game.world.length/4 + 200, 3/4*game.world.height - 150, 0.5, 0.5, 'money1');
    createMoney(3, game.world.length*3/4 + 500, game.world.height/4, 0.5, 0.5, 'money1');


    createSpike(game.world.length/4 + 300, 3/4*game.world.height - 175, 0.5,0.5, 'tripleSpikes', 0);
    createSpike(game.world.length*3/4 + 575, game.world.height/4 - 25, 0.5,0.5, 'singleSpike', 0);

    createGem(game.world.length/4 + 425, 3/4*game.world.height - 200, 'goldNugget');
    createGem(game.world.length*3/4 + 650, game.world.height/4 - 50, 'diamond');

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

    xhr.onreadystatechange = function() { //Call a function when the state changes.
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            console.log(xhr.response);
        }
    }

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
    gem = curr_scene.gems.create(x + randomInt(-50, 50), y, type);
    gem.body.immovable = true;
}

function createSpike(x, y, widthMod, heightMod, type, rotateVal) {
    spike = curr_scene.spikes.create(x + randomInt(-50, 50) , y, type);
    spike.scale.setTo(widthMod, heightMod);
    spike.body.immovable = true;
    spike.rotation = rotateVal;
}

function randomInt(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
