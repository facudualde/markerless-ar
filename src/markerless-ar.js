import Gltf from './gltfHandler.js';

const handsfree = new Handsfree({hands: {
    enabled: true,
    maxNumHands: 2,
}, showDebug: false});

handsfree.on('modelError', (event) => {
    alert("An error occurred while trying to load the model.");
});

handsfree.start();

let rightHandObj = null;
let leftHandObj = null;

const ROTATION_SPEED = 1; // Change this constant to increment the rotation speed

const pinch_start = (wristX, wristY, wristZ, thumbX, thumbY, thumbZ, data, hand) =>
{
    let flag = false;
    for(let k = 0; k < Gltf.gltfObjects.length && flag === false; k++)
    {
        const obj = Gltf.gltfObjects[k];
        obj.box3.setFromObject(obj.element.object3D);
        let handsfreePosZ = 1/obj.element.getAttribute('position').z;
        let aframePos = Gltf.conversion(data.curPinch.x, data.curPinch.y, handsfreePosZ);
        if( (aframePos[0] > obj.box3.min.x && aframePos[0] < obj.box3.max.x) && (aframePos[1] > obj.box3.min.y && aframePos[1] < obj.box3.max.y) && obj.go === false )
        {
            obj.startingVector = [thumbX - wristX, thumbY - wristY, thumbZ - wristZ];
            obj.go = true;
            if(hand === "right")
                rightHandObj = obj;
            else if(hand === "left")
                leftHandObj = obj;
            flag = true;
        }  
    }
}

const pinch_held = (wristX, wristY, wristZ, thumbX, thumbY, thumbZ, data, obj) =>
{
    if(obj !== null)
    {
        // --- Position ---
        // Conversion from handsfree coordinates to aframe coordinates
        obj.pos = Gltf.conversion(data.curPinch.x, data.curPinch.y, data.curPinch.z);
        
        // Check if Gltf's Z position is too far behind or too far ahead, if true then
        // sets it to -13 and recalculates the conversion
        if(obj.pos[2] < -15 || obj.pos[2] > 0)
        {
            obj.pos[2] = -13;
            obj.pos = Gltf.conversion(data.curPinch.x, data.curPinch.y, 1/obj.pos[2]);
        }

        // Used it to smooth the object's position when pinched
        let p = Gltf.average_position(obj.arrayX, obj.arrayY, obj.arrayZ, obj.pos);
        
        obj.element.setAttribute('position', String(p[0]) + " " + String(p[1]) + " " + String(p[2]));

        // --- Rotation ---
        obj.currentVector = [thumbX - wristX, thumbY - wristY, thumbZ - wristZ];
        let startingVector = new THREE.Vector3(obj.startingVector[0], obj.startingVector[1], obj.startingVector[2]);
        let currentVector = new THREE.Vector3(obj.currentVector[0], obj.currentVector[1], obj.currentVector[2]);
        startingVector.normalize();
        currentVector.normalize();

        let angle = startingVector.angleTo(currentVector);
        let line = new THREE.Vector3();
        line.crossVectors(startingVector, currentVector);
        line.normalize();
        Gltf.rotateOnWorldAxis(obj.element.object3D, line, ROTATION_SPEED * angle);
        obj.startingVector[0] = obj.currentVector[0];
        obj.startingVector[1] = obj.currentVector[1];
        obj.startingVector[2] = obj.currentVector[2];
    }
}

/**
 * handsfree.data.hands.landmarks[i][0] -> wrist
 * handsfree.data.hands.landmarks[i][1] -> thumb
 */

// Right hand
handsfree.on('finger-pinched-start-1-0', (data) => {
    let wristX = handsfree.data.hands.landmarks[1][0].x;
    let wristY = handsfree.data.hands.landmarks[1][0].y;
    let wristZ = handsfree.data.hands.landmarks[1][0].z;
    let thumbX = handsfree.data.hands.landmarks[1][4].x;
    let thumbY = handsfree.data.hands.landmarks[1][4].y;
    let thumbZ = handsfree.data.hands.landmarks[1][4].z;
    pinch_start(wristX, wristY, wristZ, thumbX, thumbY, thumbZ, data, "right");
});

handsfree.on('finger-pinched-held-1-0', (data) => {
    let wristX = handsfree.data.hands.landmarks[1][0].x;
    let wristY = handsfree.data.hands.landmarks[1][0].y;
    let wristZ = handsfree.data.hands.landmarks[1][0].z;
    let thumbX = handsfree.data.hands.landmarks[1][4].x; 
    let thumbY = handsfree.data.hands.landmarks[1][4].y;
    let thumbZ = handsfree.data.hands.landmarks[1][4].z;
    pinch_held(wristX, wristY, wristZ, thumbX, thumbY, thumbZ, data, rightHandObj);
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
    let wristX = handsfree.data.hands.landmarks[0][0].x;
    let wristY = handsfree.data.hands.landmarks[0][0].y;
    let wristZ = handsfree.data.hands.landmarks[0][0].z;
    let thumbX = handsfree.data.hands.landmarks[0][4].x;
    let thumbY = handsfree.data.hands.landmarks[0][4].y;
    let thumbZ = handsfree.data.hands.landmarks[0][4].z;
    pinch_start(wristX, wristY, wristZ, thumbX, thumbY, thumbZ, data, "left");
});

handsfree.on('finger-pinched-held-0-0', (data) => { 
    let wristX = handsfree.data.hands.landmarks[0][0].x;
    let wristY = handsfree.data.hands.landmarks[0][0].y;
    let wristZ = handsfree.data.hands.landmarks[0][0].z;
    let thumbX = handsfree.data.hands.landmarks[0][4].x;
    let thumbY = handsfree.data.hands.landmarks[0][4].y;
    let thumbZ = handsfree.data.hands.landmarks[0][4].z;
    pinch_held(wristX, wristY, wristZ, thumbX, thumbY, thumbZ, data, leftHandObj);
});

handsfree.on('finger-pinched-released-0-0', (data) => {
    if(leftHandObj != null && leftHandObj.go === true)
    {
        leftHandObj.go = false;

        leftHandObj = null;
    }
});

const main = () =>
{
    const head = document.getElementsByTagName('head')[0];

    // Flip video
    const style = document.createElement('style');
    style.textContent = "video {	-moz-transform: scale(-1, 1);	-webkit-transform: scale(-1, 1);	-o-transform: scale(-1, 1);	-ms-transform: scale(-1, 1);	transform: scale(-1, 1); }";
    head.appendChild(style);
}

main();