const startscreen=document.querySelector('.StartScreen'); // constant for starting game
const gamearea=document.querySelector('.GameArea'); // constant to add cars and street to the game
let player={ speed:5,score:0}; // initial user's speed and score 
let updateScore = document.querySelector(".score span");  // constant to store and return user's score
let updateHighScore = document.querySelector(".highscore span");  // constant to store and return user's high score
const userList = document.getElementById('users');
let highest=0; // high score

// Get username and room from URL
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

// Join room
socket.emit('joinRoom', { username });

// Get room and users
socket.on('roomUsers', ({ users }) => {
  outputUsers(users);
});
startscreen.addEventListener('click',start); // start game when clicked
let keys={ArrowUp: false, ArrowDown: false, ArrowRight: false, ArrowLeft: false}; // keyboard arrows variables

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
function keyDown(e){ // enable keyDown to let keyboard arrows pressed continuously  
    e.preventDefault();
    keys[e.key]=true;
}
function keyUp(e){ // disable keyUp
    e.preventDefault();
    keys[e.key]=false;
}
function gamePlay(){

    let car=document.querySelector('.car'); //get car's class in variable
    let road=gamearea.getBoundingClientRect(); //get game's sizes

    if(player.start){

        moveLines();
        moveLines2();
        moveLines3();
        moveCar(car);
        if(keys.ArrowUp && player.y>(road.top+70)){ //condition on car's position
            player.y-=player.speed; // decrease car's top position
        }
        if(keys.ArrowDown && player.y<(road.bottom-70)){
            player.y+=player.speed;// increase car's top position
        }
        if(keys.ArrowLeft && player.x>0){
            player.x-=player.speed; // decrease car's left position
        }
        if(keys.ArrowRight && player.x<(road.width-50)){
            player.x+=player.speed; // increase car's left position
        }

        car.style.top=player.y + 'px'; // changing car's css style 
        car.style.left=player.x + 'px';

        window.requestAnimationFrame(gamePlay); //recursion
        player.score++; //incrementing score
        if(player.score>=highest) // Update high score span 
            {
                highest=player.score;
                updateHighScore.innerHTML = highest;
            }
        updateScore.innerHTML= player.score; // span showing score
    }
    
}
function moveLines(){
    let lines=document.querySelectorAll('.lines');
    lines.forEach(function(item){ // assign spacings between road white lines
        if(item.y>=700){
            item.y-=750;
        }
        item.y+=player.speed; // increase lines when speed is increased
        item.style.top=item.y+'px'; // change lines css style

    })
}
function moveLines2(){
    let lines=document.querySelectorAll('.lines2');
    lines.forEach(function(item){
        if(item.y>=700){
            item.y-=750;
        }
        item.y+=player.speed;
        item.style.top=item.y+'px';

    })
}
function moveLines3(){
    let lines=document.querySelectorAll('.lines3');
    lines.forEach(function(item){
        if(item.y>=700){
            item.y-=750;
        }
        item.y+=player.speed;
        item.style.top=item.y+'px';

    })
}

// function for when player is colliding to an other car by their dimensions
function isCollide(a,b){
    a = a.getBoundingClientRect();
    b = b.getBoundingClientRect();
    if (a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y) 
    return true;
}
function endGame(){ //when user loses shows game over div
    player.start=false; 
    $('#overModal').toggle(); 
    document.getElementById("gameoverscore").innerText= Number(updateScore.innerHTML) + 1;
}
// starts screen would show when 'replay' is clicked
function replay(){
    startscreen.classList.remove('hide');
    $('#overModal').toggle('hide'); 
}

function moveCar(car){
    let other_cars=document.querySelectorAll('.other_cars'); 
    other_cars.forEach(function(item){ 
        if(isCollide(car,item)){ //if car collides with other car game is ended
            console.log('Game Over');
            endGame();
        }
        if(item.y>=750){ // randomly put other cars in game
            item.y=-400;
            item.style.left=Math.floor(Math.random()*350) + 'px';
        }
        item.y+=player.speed; //increase other cars when speed is increased 
        item.style.top=item.y+'px';

    })
}

function start(){
    startscreen.classList.add('hide'); // when game starts label hides
    gamearea.innerHTML="";
    player.start=true;
    player.score=0;
    window.requestAnimationFrame(gamePlay);

    

   for(x=0;x<5;x++){ // printing street's lines
        let roadline=document.createElement('div');
        roadline.setAttribute('class','lines');
        roadline.y=(x*150);
        roadline.style.top=roadline.y+'px';
        gamearea.appendChild(roadline);
    }

    for(x=0;x<5;x++){
        let roadline=document.createElement('div');
        roadline.setAttribute('class','lines2');
        roadline.y=(x*150);
        roadline.style.top=roadline.y+'px';
        gamearea.appendChild(roadline);
    }

    for(x=0;x<5;x++){
        let roadline=document.createElement('div');
        roadline.setAttribute('class','lines3');
        roadline.y=(x*150);
        roadline.style.top=roadline.y+'px';
        gamearea.appendChild(roadline);
    }
    
    let car=document.createElement('div');
    car.setAttribute('class','car');
    gamearea.appendChild(car);// returns car to the game
    player.x=car.offsetLeft; // getting the car's left style position
    player.y=car.offsetTop; // getting the car's top style position

    for(x=0;x<9;x++){ // returning random other cars to the game
        let othercar=document.createElement('div');
        othercar.setAttribute('class','other_cars');
        othercar.y=((x+1)*700)* -1;
        othercar.style.top=othercar.y+'px';
        othercar.style.left=Math.floor(Math.random()*700) + 'px';
        gamearea.appendChild(othercar);
    }


}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach(user=>{
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
 }