let currentPage = 0;
let input1, input2, nextButton, startButton, closeButton, testButton;
let boatX, boatY, boatImg;
let endImg;
let friends = [];
let friendImgs = [];
let currentMessageIndex = -1;
let friendSize = 50;
let friendPositions = [
    { x: 200, y: 50 },
    { x: 800, y: 500 },
    { x: 1200, y: 200 }
];

let friendMessages = ["1. He was the one. \n\n2. When love knocks, you open the door.  \n\n3. Her eyes are beautiful.  \n\n4. I found that eating alone by the window in a quiet restaurant is one of life’s greatest secret pleasures. \n--《City of Girls》\n\n5. The ghostly winter silence had given way to the great spring murmur of awakening life.\n This murmur arose from all the land, fraught with the joy of living.\n--《The Call of the Wild》",                   "1. Siri, delete Mom from my contact.\n\n2. Finally spoke to him. Left flowers.\n\n3. Today I washed my mother’s hair for the first time. \n\n4. Do you want to visit grandma?\n\n5. Why do people have to be this lonely? What’s the point of it all? \nMillions of people in this world, all of them yearning, looking to others to satisfy them, \nyet isolating themselves. Why? \nWas the earth put here just to nourish human loneliness?\n--《Sputnik Sweetheart》",                                          "1. She looked at the blue sweater her master's daughters wore for the birthday party. \nHer master's daughter looked at the freedom her servant's daughter had. \n\n2. Three friends met after six years only to know how much wealth they acquired. \nTwo compared the cars and houses, but had no children; \nthird brought homemade cake baked by his daughter. \n\n 3. He saw a man walking free on the road from the prison ground. \nThe man on road wondered if he could go to jail to survive another homeless winter. \n\n4. 'What! My little book I was so fond of, and worked over, and meant to finish before Father got home? \nHave you really burned it?' said Jo, turning very pale, while her eyes kindled and her hands clutched Amy nervously. \n--《Little Women》"];


function preload() {
    boatImg = loadImage('pic/boat.png');
    friendImgs.push(loadImage('pic/friend1.png'));
    friendImgs.push(loadImage('pic/friend2.png'));
    friendImgs.push(loadImage('pic/friend3.png'));
    endImg = loadImage('pic/over.png'); // Load the end image
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    input1 = createInput();
    input2 = createInput();
    nextButton = createButton('Next');
    startButton = createButton('Start');
    closeButton = createButton('Close');
    testButton = createButton('Test'); // Create the Test button

    resetGame();
    
    showMainPage();
}

function draw() {
    background(255);
    if (currentPage === 0) {
        drawMainPage();
    } else if (currentPage === 1) {
        drawInputPage();
    } else if (currentPage === 2) {
        drawGamePage();
    } else if (currentPage === 3) {
        drawFriendMessage();
    } else if (currentPage === 4) {
        drawEndPage(); // Draw the end page
    }
}

function showMainPage() {
    input1.hide();
    input2.hide();
    startButton.hide();
    closeButton.hide();
    testButton.hide(); // Hide Test button on main page
    nextButton.position(width / 2 - 30, height - 100);
    nextButton.show();
    nextButton.mousePressed(() => {
        currentPage = 1;
        showInputPage();
    });
}

function drawMainPage() {
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Now we just need to gather your friends to start the party🎉!\n\nUse the arrow keys to move the boat.\n\nFriends' icons will appear along the path.\n\nTry to reach the destination!", width / 2, height / 2);
}

function showInputPage() {
    nextButton.hide();
    input1.position(width / 2 - 100, 250);
    input2.position(width / 2 - 100, 370);
    startButton.position(width / 2 - 30, height - 50);
    input1.show();
    input2.show();
    startButton.show();
    startButton.mousePressed(() => {
        currentPage = 2;
        resetGame();
        hideInputsAndButtons();
    });
}

function drawInputPage() {
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Your friend is preparing a gift for you.\n\nPlease type one sentence to answer the following questions:", width / 2, 100);
    text("1. What's been bothering you lately?", width / 2 - 100, 200);
    text("2. What's made you happy recently?", width / 2 - 100, 320);
}

function resetGame() {
    boatX = 0;
    boatY = 130; 
    friends = [
        { x: friendPositions[0].x, y: friendPositions[0].y, collected: false, img: friendImgs[0], message: friendMessages[0], size: { width: 35, height: 70 } }, // First friend with different size
        { x: friendPositions[1].x, y: friendPositions[1].y, collected: false, img: friendImgs[1], message: friendMessages[1], size: { width: friendSize, height: friendSize } },
        { x: friendPositions[2].x, y: friendPositions[2].y, collected: false, img: friendImgs[2], message: friendMessages[2], size: { width: friendSize, height: friendSize } }
    ];
}

function drawGamePage() {
    drawRiver();
    textSize(32);
    fill(255);
    stroke(208, 16, 76);
    strokeWeight(4);
    text('End', width - 50, 200);
    image(boatImg, boatX, boatY, 40, 30);
    for (let i = 0; i < friends.length; i++) {
        let friend = friends[i];
        let displayWidth = friend.size.width;
        let displayHeight = friend.size.height;

        if (!friend.collected) {
            image(friend.img, friend.x, friend.y, displayWidth, displayHeight);
            if (dist(boatX + 25, boatY + 15, friend.x + displayWidth / 2, friend.y + displayHeight / 2) < 30) {
                currentMessageIndex = i;
                friend.collected = true;
                currentPage = 3;
                showFriendMessage();
            }
        }
    }
    if (allFriendsCollected() && currentMessageIndex === -1) {
        currentPage = 4; // Switch to the new end page
    } else {
        moveBoat();
    }
}

function moveBoat() {
    let newX = boatX;
    let newY = boatY;
    const boatWidth = 40;
    const boatHeight = 30;

    if (keyIsDown(LEFT_ARROW)) {
        newX -= 2;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        newX += 2;
    }
    if (keyIsDown(UP_ARROW)) {
        newY -= 2;
    }
    if (keyIsDown(DOWN_ARROW)) {
        newY += 2;
    }

    if (isBoatInRiver(newX, newY, boatWidth, boatHeight)) {
        boatX = newX;
        boatY = newY;
    }

    boatX = constrain(boatX, 0, width - boatWidth);
    boatY = constrain(boatY, 0, height - boatHeight);
}

function isBoatInRiver(x, y, boatWidth, boatHeight) {
    let riverVertices = [
        { x: 0, y: 120 },
        { x: 150, y: 20 },
        { x: 770, y: 480 },
        { x: 1180, y: 180 },
        { x: width, y: 240 },
        { x: width, y: 320 },
        { x: 1180, y: 260 },
        { x: 770, y: 600 },
        { x: 150, y: 100 },
        { x: 0, y: 200 }
    ];

    let boatCorners = [
        { x: x, y: y },
        { x: x + boatWidth, y: y },
        { x: x + boatWidth, y: y + boatHeight },
        { x: x, y: y + boatHeight }
    ];

    for (let corner of boatCorners) {
        if (!pointInPolygon(corner.x, corner.y, riverVertices)) {
            return false;
        }
    }
    return true;
}

function pointInPolygon(px, py, polygon) {
    let inside = false;
    let n = polygon.length;
    let xi, yi, xj, yj;
    
    for (let i = 0, j = n - 1; i < n; j = i++) {
        xi = polygon[i].x;
        yi = polygon[i].y;
        xj = polygon[j].x;
        yj = polygon[j].y;
        let intersect = ((yi > py) != (yj > py)) &&
                        (px < (xj - xi) * (py - yi) / (yj - yi) + xi);
        if (intersect) {
            inside = !inside;
        }
    }
    return inside;
}

function allFriendsCollected() {
    for (let friend of friends) {
        if (!friend.collected) {
            return false;
        }
    }
    return true;
}

function showFriendMessage() {
    closeButton.position(width - 70, 20);
    closeButton.show();
    closeButton.mousePressed(() => {
        if (allFriendsCollected()) {
            currentPage = 4; // Switch to the new end page
        } else {
            currentPage = 2;
            closeButton.hide();
            currentMessageIndex = -1;
        }
    });
}

function drawFriendMessage() {
    background(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    strokeWeight(0);
    
    if (currentMessageIndex === 0) {
        fill(231, 148, 96);
    } else if (currentMessageIndex === 1) {
        fill(0, 92, 175);
    } else if (currentMessageIndex === 2) {
        fill(0, 170, 144);
    }

    text(friends[currentMessageIndex].message, width / 2, height / 2);
}


function hideInputsAndButtons() {
    input1.hide();
    input2.hide();
    startButton.hide();
}

function drawEndPage() {
    background(255);
    imageMode(CENTER);
    image(endImg, width / 2, height / 2); // Draw the end image
    closeButton.hide(); // Hide the Close button
    testButton.position(10, 10); // Position the Test button at the top left
    testButton.show();
    testButton.mousePressed(() => {
        window.location.href ='https://xiaotian0722.github.io/ANT-end/'; // Open the test
    });
}

function drawRiver() {
    noStroke();
    fill(88, 178, 220);
    beginShape();
    vertex(0, 120);
    vertex(150, 20);
    vertex(770, 480);
    vertex(1180, 180);
    vertex(width, 240);
    vertex(width, 320);
    vertex(1180, 260);
    vertex(770, 600);
    vertex(150, 100);
    vertex(0, 200);
    endShape(CLOSE);
}
