import Object from './Object.js';

const handsfree = new Handsfree({hands: {
    enabled: true,
    maxNumHands: 2,
}, showDebug: false});

handsfree.on('handsModelReady', (event) => {
    document.getElementById("loader-wrapper").classList.add("hidden");
});

handsfree.start();

let rightHandObj = null;
let leftHandObj = null;

function start(palmZ, palmX, palmY, indiceZ, indiceX, indiceY, data, hand)
{
    let flag = false;
    for(let k = 0; k < Object.set.length && flag === false; k++)
    {
        const obj = Object.set[k];
        obj.box3.setFromObject(obj.element.object3D);
        let zet = 1/obj.element.getAttribute('position').z;
        let pos = Object.conversion(data.curPinch.x, data.curPinch.y, zet);
        if( (pos[0] > obj.box3.min.x && pos[0] < obj.box3.max.x) && (pos[1] > obj.box3.min.y && pos[1] < obj.box3.max.y) && obj.go === false )
        {
            obj.first = [indiceX - palmX, indiceY - palmY, indiceZ - palmZ];
            obj.go = true;
            if(hand === "right")
                rightHandObj = obj;
            else if(hand === "left")
                leftHandObj = obj;
            flag = true;
        }  
    }
}

function held(palmZ, palmX, palmY, indiceZ, indiceX, indiceY, data, obj, landmark)
{
    if(obj !== null)
    {
        obj.pos = Object.conversion(data.curPinch.x, data.curPinch.y, landmark);
        
        if(obj.pos[2] < -15 || obj.pos[2] > 0)
        {
            obj.pos[2] = -13;
            obj.pos = Object.conversion(data.curPinch.x, data.curPinch.y, 1/obj.pos[2]);
        }

        let p = Object.promedio(obj.arrayX, obj.arrayY, obj.arrayZ, obj.pos);
        obj.element.setAttribute('position', String(p[0]) + " " + String(p[1]) + " " + String(p[2]) );
        obj.v = [indiceX - palmX, indiceY - palmY, indiceZ - palmZ];
        let firstVect = new THREE.Vector3(obj.first[0], obj.first[1], obj.first[2]);
        let actualVect = new THREE.Vector3(obj.v[0], obj.v[1], obj.v[2]);
        firstVect.normalize();
        actualVect.normalize();

        let angulo = firstVect.angleTo(actualVect);
        let recta = new THREE.Vector3();
        recta.crossVectors(firstVect, actualVect);
        recta.normalize();
        Object.rotateOnWorldAxis(obj.element.object3D, recta, angulo);
        obj.first[0] = obj.v[0];
        obj.first[1] = obj.v[1];
        obj.first[2] = obj.v[2];
    }
}

// Right hand
handsfree.on('finger-pinched-start-1-0', (data) => {
    let palmZ = handsfree.data.hands.landmarks[1][0].z; 
    let palmX = handsfree.data.hands.landmarks[1][0].x;
    let palmY = handsfree.data.hands.landmarks[1][0].y;
    let indiceZ = handsfree.data.hands.landmarks[1][4].z;
    let indiceX = handsfree.data.hands.landmarks[1][4].x;
    let indiceY = handsfree.data.hands.landmarks[1][4].y;
    start(palmZ, palmX, palmY, indiceZ, indiceX, indiceY, data, "right");
});

handsfree.on('finger-pinched-held-1-0', (data) => {
    let palmZ = handsfree.data.hands.landmarks[1][0].z; 
    let palmX = handsfree.data.hands.landmarks[1][0].x;
    let palmY = handsfree.data.hands.landmarks[1][0].y;
    let indiceZ = handsfree.data.hands.landmarks[1][4].z;
    let indiceX = handsfree.data.hands.landmarks[1][4].x;
    let indiceY = handsfree.data.hands.landmarks[1][4].y;
    held(palmZ, palmX, palmY, indiceZ, indiceX, indiceY, data, rightHandObj, handsfree.data.hands.landmarks[1][8].z);
});


handsfree.on('finger-pinched-released-1-0', (data) => {    
    if(rightHandObj != null && rightHandObj.go === true)
    {
        rightHandObj.go = false;
        
        rightHandObj = null;
    }
});

// Left hand
handsfree.on('finger-pinched-start-0-0', (data) => {
    let palmZ = handsfree.data.hands.landmarks[0][0].z; 
    let palmX = handsfree.data.hands.landmarks[0][0].x;
    let palmY = handsfree.data.hands.landmarks[0][0].y;
    let indiceZ = handsfree.data.hands.landmarks[0][4].z;
    let indiceX = handsfree.data.hands.landmarks[0][4].x;
    let indiceY = handsfree.data.hands.landmarks[0][4].y;
    start(palmZ, palmX, palmY, indiceZ, indiceX, indiceY, data, "left");
});

handsfree.on('finger-pinched-held-0-0', (data) => {
    let palmZ = handsfree.data.hands.landmarks[0][0].z; 
    let palmX = handsfree.data.hands.landmarks[0][0].x;
    let palmY = handsfree.data.hands.landmarks[0][0].y;
    let indiceZ = handsfree.data.hands.landmarks[0][4].z;
    let indiceX = handsfree.data.hands.landmarks[0][4].x;
    let indiceY = handsfree.data.hands.landmarks[0][4].y;
    held(palmZ, palmX, palmY, indiceZ, indiceX, indiceY, data, leftHandObj, handsfree.data.hands.landmarks[0][8].z);
});

handsfree.on('finger-pinched-released-0-0', (data) => {
    if(leftHandObj != null && leftHandObj.go === true)
    {
        leftHandObj.go = false;

        leftHandObj = null;
    }
});

function init()
{
    const head = document.getElementsByTagName('head')[0];

    // Flip video
    const style = document.createElement('style');
    style.textContent = "video {	-moz-transform: scale(-1, 1);	-webkit-transform: scale(-1, 1);	-o-transform: scale(-1, 1);	-ms-transform: scale(-1, 1);	transform: scale(-1, 1); }"
    head.appendChild(style);
}

init();
