//Game Engine Objects Variables
var scene;
var timerForTankSpawn;
var gameTimer;
//Objects Instantiated Variables
var tank;
var enemyTank;
var missile;
//Sound Variables
var shootSound;
var scoreUpSound;
var gameOverSound;
//Custom Values
var score = parseInt("0");
var timeDuration = parseInt("99");

function Tank(){
    tTank = new Sprite(scene, "img/blueTank.png", 55,50);
    tTank.setAngle(135);
    
    tTank.checkKeys = function(){
        this.setSpeed(0);
        var accel= keysDown[K_UP] || keysDown[K_W];
        var retar= keysDown[K_DOWN] || keysDown[K_S];
        //This way of input makes sure that the tank moves only when
        //there is a forward or reverse acceleration and not turns
        //when standing still
        if(Boolean(accel)){
            this.setSpeed(4);
        }
        if(Boolean(retar)){
            this.setSpeed(-4);
        }
        if (keysDown[K_LEFT] || keysDown[K_A] && (Boolean(accel) || Boolean(retar))){
            this.turnBy(-5);
        }
        if (keysDown[K_RIGHT] || keysDown[K_D] &&(Boolean(accel) || Boolean(retar))){
            this.turnBy(5);
        }
        if (keysDown[K_SPACE]){
            shootSound.play();
            missile.fire();
        }
    } 
    
    return tTank;
} 

function EnemyTank(){
    tEnemyTank = new Sprite(scene,"img/goldTank.png",55,50);

    tEnemyTank.spawnRandom = function(){

        let angleFactor = 200;

        this.setSpeed(0);
        this.setX(Math.random() * scene.width);
        this.setY(Math.random() * scene.height);
        this.setAngle(Math.random() * angleFactor);
        timerForTankSpawn.reset();//reset timerForTankSpawn to prevent continuous spawn of tanks
    }

    //Disspawn Enemy Tank after some time
    timerForTankSpawn.SpawnEnemyTank = function(){
        if(this.getElapsedTime() > 5){
            //enemyTank.hide();
            tEnemyTank.spawnRandom();
        }
    }


    tEnemyTank.spawnRandom();

    return tEnemyTank;
}

function Missile(){
    tMissile = new Sprite(scene, "img/tankMissile.png", 30, 20);
    tMissile.destroy = function(){
        this.hide();
    }
    tMissile.destroy();

    tMissile.fire = function(){
        this.show();
        this.setSpeed(15);
        this.setBoundAction(DIE);
        this.setPosition(tank.x, tank.y);
        this.setAngle(tank.getImgAngle());
        this.setSpeed(15);
    }
    return tMissile;
}

function init(){
    scene = new Scene();
    timerForTankSpawn = new Timer();
    gameTimer = new Timer();

    scene.setPos(350,30)

    //BUG : Only one sound is played at one time
    shootSound = new Sound("sounds/shootSound.wav");
    gameOverSound = new Sound("sounds/gameOverSound.wav");
    scoreUpSound = new Sound("sound/scoreUpSound.wav");

    tank = new Tank();
    missile = new Missile();
    enemyTank = new EnemyTank();

    
    gameClock = function(){
        var time = timeDuration - parseInt(gameTimer.getElapsedTime());
        return time;
    }

    gameOverCheck = function(){
        if(gameClock() < 0){
            document.getElementById("time").innerHTML = "Game Over";
            tank.hide();
            missile.hide();
            enemyTank.hide();
            gameOverSound.play();
        }
    }
    
    checkCollisions = function(){
        if(missile.collidesWith(enemyTank)){
            scoreUpSound.play();
            score = score + parseInt("1");
            enemyTank.spawnRandom();
            missile.destroy();
        }
    }

    printToUser = function(){
        document.getElementById("score").innerHTML = score;
        document.getElementById("time").innerHTML = gameClock();
    }

    scene.start();
} // end init

function update(){
    scene.clear();

    checkCollisions();
    printToUser();
    gameOverCheck();
    
    timerForTankSpawn.SpawnEnemyTank();
    
    tank.checkKeys();

    tank.update();
    enemyTank.update();
    missile.update();
} // end update
