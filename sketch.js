var PLAY = 1;
var END = 0;
var gameState = PLAY;      

var player, player_running, player_collided;
var ground, invisibleGround, groundImage;

var butterflyGroup, butterflyImage,i;
var obstaclesGroup, obstacle, obstacle1, obstacle2, obstacle3;

var bkSound,jumpSound;

var score=0;

var gameOver, restart;

var candy, candyGroup, candy1,candy2,candy3,candySound;

var red_monsterImage, netImage;

var monsterGroup, monster, netGroup, net;

var ringImage;

function preload(){

  player_running =   loadAnimation("sonic1.png","sonic2.png","sonic3.png","sonic4.png","sonic5.png","sonic6.png");
  player_collided = loadAnimation("playerfreeze.png");
  
 groundImage = loadImage("sonibg.png");
  
 butterflyImage = loadAnimation("butterfly1.png", "butterfly2.png");
  
   ringImage = loadAnimation("ring1.png", "ring2.png","ring3.png");
  
  
  obstacle1 = loadImage("building.png");
  //obstacle2 = loadImage("bot3.png");
 // obstacle3 = loadImage("bug3.png");
  
 /* candy1 = loadImage("bug1.png");
  candy2 = loadImage("bot3.png");
  candy3 = loadImage("candy3.png");*/
  candySound=loadSound("candy.wav")
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound=loadSound("jump.wav");
  
  bkSound=loadSound("bk.mp3");
  
  red_monsterImage = loadImage("bug1.png");
  netImage = loadImage("net.png");
}

function setup() {

  createCanvas(600, 300);
  
  ground = createSprite(200,10,400,20);
 
  ground.addImage("ground",groundImage);
  ground.scale=2;
   console.log(ground.width)
  ground.x = ground.width /2;
  ground.velocityX = -(4);
  
  
  player = createSprite(50,170,20,50);
  
  player.addAnimation("running", player_running);

  player.addAnimation("collided", player_collided);
  player.scale = 0.37;
  //player.debug = true;
  
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200,280,400,10);
  invisibleGround.visible = false;
  
  butterflyGroup = new Group();
  obstaclesGroup = new Group();
  candyGroup = new Group(); 
  monsterGroup = new Group();
  netGroup = new Group();
  
 //   bkSound.play();
  bkSound.loop=true; 
  score = 0;
}

function draw() {
  
  //player.debug = true;
  background(255);
 
  console.log(frameCount);
  
  if (gameState===PLAY){
    
    
    ground.velocityX = -3; 
   
    
    if(keyDown("space") && player.y >= 159) {
      player.velocityY = -20;
      jumpSound.play();
    }
  //             player.velocityY = player.velocityY+0.5;
    if(keyDown("t")) {
      throwNet();  
    }
    
    if(netGroup.isTouching(monsterGroup)) {
      score = score + 1;
        player.scale = 0.40;
      monsterGroup.destroyEach();
    }
    
    player.velocityY = player.velocityY + 0.8;
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    player.setCollider("circle",0,0,40);
    player.collide(invisibleGround);
    spawnButterfly();
    spawnObstacles();
    spawnCandies();
    spawnMonsters();
  
    if(monsterGroup.isTouching(player)){
      gameState = END;
     }
      if(obstaclesGroup.isTouching(player)){
      //score++;
      player.scale = 0.20;
      //candySound.play();
      obstaclesGroup.destroyEach();
   }
    
    if(candyGroup.isTouching(player)){
      score++;
      player.scale = 0.40;
      candySound.play();
      //candyGroup.destroyEach();
      for (i=0; i < candyGroup.length;i++){
        if (candyGroup.get(i).isTouching(player)){
          candyGroup.get(i).remove();
        }
      }
   }
  }
  
   else if (gameState === END) {
     
    gameOver.visible = true;
    restart.visible = true;
    
    player.changeAnimation("collided",player_collided);
     player.scale =0.40;
    ground.velocityX = 0;
    player.velocityY = 0;
     
    obstaclesGroup.setLifetimeEach(-1);
    candyGroup.setLifetimeEach(-1);
    monsterGroup.setLifetimeEach(-1);
    butterflyGroup.setLifetimeEach(-1);
     
    obstaclesGroup.setVelocityXEach(0);
    candyGroup.setVelocityXEach(0);
    monsterGroup.setVelocityXEach(0);
    butterflyGroup.setVelocityXEach(0);
  }
  
  drawSprites();
  strokeWeight(2);
  fill(255);
   text("Score: "+ score, 500,50);
}

function spawnButterfly() {
  
  if (frameCount % 60 === 0) {
    var butterfly = createSprite(600,120,40,10);
    butterfly.y = Math.round(random(80,210));
    butterfly.addAnimation("butterfly",butterflyImage);
    butterfly.scale = 0.2;
    
    if(butterfly.y>150){
      butterfly.y=150;
      butterfly.velocityX = -3;
      butterfly.velocityY = -1;
    }
    else {
      butterfly.velocityX = -3;
      butterfly.velocityY = 1;
    }
     //assign lifetime to the variable
    butterfly.lifetime = 200;
    
    //adjust the depth
    butterfly.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each butterfly to the group
    butterflyGroup.add(butterfly);
  }
  
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  butterflyGroup.destroyEach();
  score = 0;
  
  ground.velocityX = 0;
  player.velocityY = 0;
      
}

function spawnCandies() {
  
  if(frameCount % 80 === 0) {
      candy = createSprite(600,280,10,40);
      candy.scale = 0.2;
    candy.addAnimation("ring1.png","ring2.png","ring3.png");
    candy.setCollider("circle",0,0,70);
    candy.debug=true;
    candy.velocityX = -(3);
    candyGroup.add(candy);
  }
}
  /*  candy.y=Math.round(random(100,200));
       
    var c=Math.round(random(1,3));
    if (c===1)
      candy.addImage(candy1);
    else if (c===2)
      {
      candy.addImage(candy2);
    candy.scale=0.05;}
     else if (c===3)
      {
      candy.addImage(candy3);
    candy.scale=0.05;}*/
  function spawnObstacles()
  {
   if(frameCount % 200 === 0) {
    
    obstacle = createSprite(600,250,10,40);
     
      obstacle.addImage(obstacle1);
      //obstacle.scale = 3;
     obstacle.velocityX=-3;
     /* var rand = Math.round(random(1,2));
      
      switch(rand) {
        case 1: 
                obstacle.addImage(obstacle1);
                obstacle.velocityY=3;
                break;
        case 2:
                obstacle.addImage(obstacle2);
                 obstacle.velocityY=3 ;
                break;
        
        default: break;
      }*/
    //  if(rand <=2)
      //{
        //obstacle.velocityX = -(3);//+ 3*score/100);
        obstacle.scale = 0.75;
        obstacle.lifetime = 300;
        obstaclesGroup.add(obstacle);
     // }
      //candy.debug = true;
     
    }
  
}

function spawnMonsters() {
  
  if (frameCount % 500 === 0) {
    monster = createSprite(600,285,10,40);
    monster.addImage(red_monsterImage);
    monster.scale = 0.5;
    monster.velocityX = -3;
   //assign lifetime to the variable
    monster.lifetime = 200;
    
    //adjust the depth
    monster.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each monster to the group
    monsterGroup.add(monster);
  }

}

function throwNet() {
  net = createSprite(70,240,10,40);
  net.addImage(netImage);
  net.rotation = -30;
  net.scale = 0.5;
  net.velocityY = 2;
  net.velocityX = 4;
  net.lifetime = 50;
  netGroup.add(net);
}