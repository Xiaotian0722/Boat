let currentPage = 0;
let input1, input2, nextButton, startButton, closeButton, testButton, continueButton;
let boatX, boatY, boatImg;
let endImg;
let friends = [];
let friendImgs = [];
let friendMessageImgs = [];
let currentMessageIndex = -1;
let friendSize = 100;
let friendPositions = [
    { x: 200, y: 50 },
    { x: 800, y: 480 },
    { x: 1200, y: 200 }
];

function preload() {
    boatImg = loadImage('pic/boat.png');
    friendImgs.push(loadImage('pic/friend1.png'));
    friendImgs.push(loadImage('pic/friend2.png'));
    friendImgs.push(loadImage('pic/friend3.png'));
    endImg = loadImage('pic/over.png'); // Load the end image

    
    friendMessageImgs.push(loadImage('pic/m1.png'));
    friendMessageImgs.push(loadImage('pic/m2.png'));
    friendMessageImgs.push(loadImage('pic/m3.png'));
}

function setup() {
    createCanvas(windowWidth, windowHeight);

    input1 = createInput();
    input2 = createInput();
    nextButton = createButton('Next');
    startButton = createButton('Start');
    closeButton = createButton('Close');
    testButton = createButton('Next');
    continueButton = createButton('Continue');

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
    } else if (currentPage === 5) {
        drawThankYouPage(); // Draw the thank you page
    }
}

function showMainPage() {
    input1.hide();
    input2.hide();
    startButton.hide();
    closeButton.hide();
    testButton.hide(); // Hide Test button on main page
    continueButton.hide(); // Hide continue button on main page
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
    text("Now we just need to gather your friends to start the party🎉!\n\nUse the arrow keys to move the boat.\n\nFriends will give you gifts when reaching them.\n\nTry to reach the destination!", width / 2, height / 2);
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
        { x: friendPositions[0].x, y: friendPositions[0].y, collected: false, img: friendImgs[0], size: { width: friendSize, height: friendSize } },
        { x: friendPositions[1].x, y: friendPositions[1].y, collected: false, img: friendImgs[1], size: { width: friendSize, height: friendSize } },
        { x: friendPositions[2].x, y: friendPositions[2].y, collected: false, img: friendImgs[2], size: { width: friendSize, height: friendSize } }
    ];
}

function drawGamePage() {
    drawRiver();
    textSize(32);
    // fill(255);
    // stroke(208, 16, 76);
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
    imageMode(CENTER);
    let img = friendMessageImgs[currentMessageIndex];
    
    image(img, width / 2, height / 2, 1120, 630);

    closeButton.position(width - 70, 20);
    closeButton.show();
}

function hideInputsAndButtons() {
    input1.hide();
    input2.hide();
    startButton.hide();
    nextButton.hide();
    closeButton.hide();
    testButton.hide(); // Hide Test button
    continueButton.hide(); // Hide Continue button
}

function drawEndPage() {
    background(255);
    imageMode(CENTER);
    image(endImg, width / 2, height / 2, 1080, 1080); // Draw the end image
    
    testButton.hide(); // Hide the Test button
    closeButton.hide();

    continueButton.position(width / 2 - 50, height - 100); // Position the continue button
    continueButton.show();
    continueButton.mousePressed(() => {
        currentPage = 5; // Switch to the new page
        showNewPage();
    });
}

function showNewPage() {
    continueButton.hide();
    closeButton.hide();
    testButton.position(width / 2 - 50, height / 2 + 50); // Position the Next button at the center of new page
    testButton.show();
}

function drawThankYouPage() {
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Thanks for playing the whole game. Now please click Next to conduct the second test.", width / 2, height / 2 - 50);
}

function drawRiver() {
    fill(135, 206, 235);
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
