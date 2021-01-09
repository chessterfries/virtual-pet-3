var dogImg, happyDogImg, dog, sadDog, database, foodS, foodStock;
var foodStock, lastFed, fedTime;
var feed, addFood;
var foodObj, foodImg, food;
var changeState, readState;
var bedroom, garden, washroom;
var gameState, currentTime;

function preload()
{
  dogImg = loadImage("Dog.png");
  happyDogImg = loadImage("happy dog.png");
  foodImg = loadImage("Milk.png");
  sadDog = loadImage("deadDog.png");

  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
}

function setup() {
  createCanvas(900, 500);
  database = firebase.database();

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  dog = createSprite(740,300);
  dog.addImage(dogImg);
  dog.scale = 0.2;

  food = createSprite(550,350);
  food.addImage(foodImg);
  food.scale = 0.07;

  feed = createButton("Feed the Dog");
  feed.position(700,63);
  feed.mousePressed(feedDog);
  feed.style("cursor:pointer;");

  addFood = createButton("Add Food");
  addFood.position(800,63);
  addFood.mousePressed(addFoods);
  addFood.style("cursor:pointer;");
  
  readState = database.ref("gameState");
  readState.on("value", function(data){
    gameState = data.val();
  });
}


function draw() {  
  background(46,139,87);

  if(foodS < 0){
    foodS = 0;
  }

  if(foodS === 0){
    food.visible = false;
  }
  else{
    food.visible = true;
  }

  if(gameState !== "Hungry"){
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else{
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  fedTime = database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>12){
    text("Last Feed : "+ lastFed%12 + " PM", 220,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",220,30);
   }
   else if(lastFed==12){
     text("Last Feed : 12 PM",220,30);
   }
   else{
     text("Last Feed : "+ lastFed + " AM", 220,30);
   }

   text("Food Remaining : " + foodS, 50,30);

   currentTime = 1;
   if(currentTime === (lastFed+1)){
     update("Playing");
     foodObj.garden();
   }
   else if(currentTime === (lastFed + 2)){
     update("Sleeping");
     foodObj.bedroom();
   }
   else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
     update("Bathing");
     foodObj.washroom();
   }
   else{
     update("Hungry");
     foodObj.display();
   }

  drawSprites();

  //foodObj.display();
}

//Function to read values from DB
function readStock(data){
  foodS = data.val();
}

//Function to write values in DB
function writeStock(x){
  if(x < 0){
    x = 0;
  }
  else{
    x = x - 1;
  }
  database.ref('/').update({
    Food:x
  })
}

// Function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDogImg);

  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  dog.addImage(dogImg);

  foodS++;
  foodObj.updateFoodStock(foodObj.getFoodStock() + 1);
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
  database.ref('/').update({
    gameState:state
  });
}