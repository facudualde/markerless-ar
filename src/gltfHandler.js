export default class Gltf
{
    static gltfObjects = [];
    static i = 0;
    constructor(id, aframePosX, aframePosY, aframePosZ, src)
    {
        const assets = document.getElementById("assets");
        
        this.assetItem = document.createElement("a-asset-item");
        this.assetItem.setAttribute("id", id + "_" + Gltf.i);
        this.assetItem.setAttribute("src", src);
        assets.appendChild(this.assetItem);

        this.element = document.createElement("a-entity");
        this.element.setAttribute("gltf-model", "#" + id + "_" + Gltf.i);
        this.element.setAttribute("position", String(aframePosX) + ' ' + String(aframePosY) + ' ' + String(aframePosZ));
        document.getElementById("scene").appendChild(this.element); 

        this.arrayX = [0,0,0];
        this.arrayY = [0,0,0];
        this.arrayZ = [0,0,0];
        
        this.aframePos = null;
        this.currentVector = [0, 0, 0];
        this.startingVector = [0, 0, 0];
        this.box3 = new THREE.Box3();
        this.go = false

        Gltf.gltfObjects[Gltf.i] = this;
        Gltf.i++;
    }

    static _q1 = new THREE.Quaternion();
    static rotateOnWorldAxis(object_, axis, angle)
    {
        // rotate object on axis in world space
        // axis is assumed to be normalized
        // method assumes no rotated parent
        this._q1.setFromAxisAngle( axis, angle );
        object_.quaternion.premultiply( this._q1 );
        return object_;
    }

    // Conversion from handsfree coordinates to aframe coordinates
    static conversion(handsfreePosX, handsfreePosY, handsfreePosZ)
    {
        let aframePosZ = 1/handsfreePosZ;
        let aframePosX = -( aframePosZ/2 + (-aframePosZ) * handsfreePosX );
        let aframePosY = (-aframePosZ/2 + -aframePosZ * -handsfreePosY);
        return [aframePosX, aframePosY, aframePosZ];
    }

    // This function calculates the average position of the pinched object
    // in order to smooth it
    static average_position(vectorX, vectorY, vectorZ, pos)
    {
        vectorX[0] = vectorX[1];
        vectorX[1] = vectorX[2];
        vectorX[2] = pos[0];

        vectorY[0] = vectorY[1];
        vectorY[1] = vectorY[2];
        vectorY[2] = pos[1];

        vectorZ[0] = vectorZ[1];
        vectorZ[1] = vectorZ[2];
        vectorZ[2] = pos[2];

        let p = [(vectorX[0] + vectorX[1] + vectorX[2]) / 3,
        (vectorY[0] + vectorY[1] + vectorY[2]) / 3,
        (vectorZ[0] + vectorZ[1] + vectorZ[2]) / 3];
        
        return p;
    }

    delete()
    {
        this.assetItem.remove();
        this.element.remove();
    }

};