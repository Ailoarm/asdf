//canvas set up
var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

//game variabel
var keys = [];
var bullets = [];
var enemies = [],
    eDelay = 0;

var score = 0;
var high_score = 0;
var main_menu = true;
var game_over = false;


//player class
class Player{
    constructor() {
        this.color = 'red';
        this.hp = 200;
        this.hit_delay = 0;
        this.x = 100;
        this.y = 200;
        this.height = 30;
        this.width = 30;
        this.vely = 0;
        this.velx = 0;
        this.speed = 1;
        this.friction = 0.98;
        this.image = new Image();
        this.image.src = 'assets/plane.png';
        this.delay = 0;
    }
    relocate() {
        this.x = 100;
        this.y = 200;
        this.velx = 0;
        this.vely = 0;
    }

    gethp() {
        return this.hp = 200;
    }

    update() {
        // console.log(this.delay);
        if (this.delay > 0) {
            this.delay--;
        }
        this.draw();
        this.movement();

        if (this.hit_delay > 0) {
            this.hit_delay--;
        }
        // console.log(this.x);
    }
    
    draw() {
        ctx.drawImage(this.image,this.x,this.y,30,30)
        // ctx.fillStyle = this.color;
        // ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    
    //movement
    movement() {
        if (keys["w"]) {
            if (this.vely > -this.speed){
                this.vely--;
            }
        }
        if (keys["s"]) {
            if (this.vely < this.speed) {
                this.vely++;
            }
        }
        if (keys["a"]) {
            if (this.velx > -this.speed) {
                this.velx--;
            }
        }
        if (keys["d"]) {
            if (this.velx < this.speed) {
                this.velx++; 
            }
        }
        
        //apply some friction to vely
        this.vely *= this.friction;
        this.y += this.vely;
        
        //apply some friction to velx
        this.velx *= this.friction;
        this.x += this.velx;
    }

    shoot() {
        if (this.delay === 0){ 
            bullets.push(new Bullet({
                x: this.x + 45,
                y: this.y + 20,
                vel: 1.5
            }));
            this.delay = 50;
        }
    }

    getHit(sumber) {
        this.hp -= sumber;
        this.hit_delay = 100;
    }
}

//bullet class
class Bullet{
    constructor(bullet) {
        this.color = 'red';
        this.x = bullet.x;
        this.y = bullet.y;
        this.width = 10;
        this.height = 5;
        this.vel = bullet.vel;
        this.active = true;
    }
    
    update() {
        this.draw();
        // console.log(this.x);
        this.x += this.vel;
    }

    draw() {
        if (this.active == true) {        
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x,this.y,this.width,this.height);
        }
    }
    die() {
        this.active = false;
    }
}

//enemy class
class Enemy{
    constructor(){
        this.x = canvas.width;
        this.y = (canvas.height - 20) * Math.random();
        this.width = 30;
        this.height = 30;
        this.damage = 50;
        this.color = "white";
        this.speed = 1;
        this.active = true;
        this.images = [
            'assets/ePlane1.png',
            'assets/ePlane2.png',
            'assets/ePlane3.png'
          ];
        this.image = this.getRandomImage();
    }

    update() {
        this.draw();
        this.x -= this.speed;
    }

    draw() {
        if (this.active) {
            const imageObj = new Image();
            imageObj.src = this.image;
            ctx.drawImage(imageObj, this.x, this.y, this.width, this.height,);
        }
    }
    die() {
        this.active = false;
    }

    getRandomImage() {
        const randomIndex = Math.floor(Math.random() * this.images.length);
        return this.images[randomIndex];
    }

}

//collisioon check
function collisionCheck(a, b){
    return a.x + a.width > b.x &&
           a.x < b.x + b.width &&
           a.y < b.y + b.height&&
           a.y + a.height > b.y ;
}

function collisionOccurs(){
    enemies.forEach(function(enemy){
        if(collisionCheck(player,enemy)){
            if (player.hit_delay === 0) {
                player.getHit(enemy.damage);
                console.log(player.hp)
            }
        }
    }); 

    bullets.forEach(function(bullet){
        enemies.forEach(function(enemy){
            if (collisionCheck(bullet, enemy)) {
                bullet.die();
                enemy.die();
                bullet.x = canvas.width+ 10 ;
                enemy.x = -10;
                score += 1;
            }
        })
    })
}


//deklarasi class
const player = new Player();


//delete object
function removeBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
      if (bullets[i].x > canvas.width ) {
        bullets.splice(i, 1);
      }
  
    }
}
  function removeEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].x < -20 ) {
        enemies.splice(i, 1);
      }
    }
}

//main menu
function main() {
    ctx.font = "30pt Calibri";
    ctx.fillStyle = "white";
    ctx.fillText("Press Enter to Start", 47, 180);
    ctx.font = "20pt Calibri";
    ctx.fillText("WASD - move", 47, 210);
    ctx.fillText("Space - shoot", 47, 240);;
}

function resetGame() {
    
}

function gameOver() {
    ctx.font = "30pt Calibri";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER",170, 150);
    ctx.font = "15pt Calibri";
    ctx.fillText(("score: " + score),240,180)
    ctx.fillText(("best score: " + high_score),220,210)
    ctx.font = "15pt Calibri";
    ctx.fillText("press Enter to play again",175,250)

    if (keys["Enter"]) {
        game_over = false;    
        player.gethp();
        player.relocate();
        score = 0;
        bullets.splice(0,bullets.length);    
        enemies.splice(0,enemies.length);    
    }
}

//game menu
function game() {

    if (!game_over) {
        //hapus objek
        removeBullets();
        removeEnemies();
        
        //check collosion
        collisionOccurs();
        
        //score
        ctx.fillStyle = 'yellow';
        ctx.font = "10pt Calibri";
        ctx.fillText(score, 30, 20);

        if (score > high_score) {
            high_score = score;
        }
    
        //shoot
        if (keys[" "]) {
            player.shoot();        
        }
    
        //game over
        if (player.hp === 0) {
            game_over = true;
        }

        //update
        player.update();
    
        bullets.forEach(function(bullet) {
            bullet.update();
        })

        enemies.forEach(function(enemy) {
            enemy.update();
        })

        //enter the enemy
        if (eDelay === 0) {
            enemies.push(new Enemy());
            eDelay =200;
        }
        if (eDelay > 0) {
            eDelay--;
        }
    }else {
        gameOver();
    }

}
//game loop
function loop() {
    requestAnimationFrame(loop);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (keys["Enter"]) {
        main_menu = false;
    }

    if (main_menu) {
        main();
    } else {
        game();
    }
    
    // console.log(enemies);
}

loop();

// key events
document.body.addEventListener("keydown", function (e) {
    keys[e.key] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.key] = false;
});