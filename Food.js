class Food{
    constructor(){
        this.foodStock = 20;
        this.lastFed;
        this.image = loadImage("Milk.png");
    }

    getFoodStock(){
        return this.foodStock;
    }

    updateFoodStock(foodStock){
        this.foodStock = foodStock;
    }

    deductFood(){
        if(this.foodStock > 0){
            this.foodStock--;
        }
    }

    getFedTime(lastFed){
        this.lastFed = lastFed;
    }

    bedroom(){
        background(bedroom, 550,500);
    }

    garden(){
        background(garden, 550,500);
    }

    washroom(){
        background(washroom, 550,500);
    }

    display(){
        var x = 80, y = 100;

        imageMode(CENTER);
        image(this.image,720,720,70,70);

        if(this.foodStock!=0){
            for(var i = 0; i < this.foodStock; i++){
                if(i%10==0){
                    x=80;
                    y+=50;
                }
                image(this.image,x,y,50,50);
                x+=30;
            }
        }
    }
}