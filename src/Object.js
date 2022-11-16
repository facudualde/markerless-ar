export default class Object
{
    static set = [];
    static i = 0;
    constructor(id, pX, pY, pZ, src)
    {
        this.assets = document.createElement("div");
        document.getElementById("scene").appendChild(this.assets);
        
        for(let i = 0; i < src.length; i++)
        {
            const assetItem = document.createElement("a-asset-item");
            assetItem.setAttribute("id", id + "_" + i);
            assetItem.setAttribute("src", src[i]);
            this.assets.appendChild(assetItem);
        }

        let position = String(pX) + ' ' + String(pY) + ' ' + String(pZ);
        this.element = document.createElement("a-entity");
        this.element.setAttribute("position", position);
        document.getElementById("scene").appendChild(this.element);
        for(let i = 0; i < src.length; i++)
        {
            const child = document.createElement("a-entity");
            child.setAttribute("gltf-model", "#" + id + "_" + i);
            this.element.appendChild(child); 
        }

        this.arrayX = [0,0,0];
        this.arrayY = [0,0,0];
        this.arrayZ = [0,0,0];
        
        this.ultimoX = pX;
        this.ultimoY = pY;
        this.ultimoZ = pZ;
        this.pos = null;
        this.v = [0, 0, 0];
        this.first = [0, 0, 0];
        this.box3 = new THREE.Box3();
        this.go = false

        Object.set[Object.i] = this;
        Object.i++;
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

    static conversion(x, y, z)
    {
        let posZ = 1/z;
        let posX = -( posZ/2 + (-posZ) * x );
        let posY = (-posZ/2 + -posZ * -y);
        return [posX, posY, posZ];
    }

    static promedio(vectorX, vectorY, vectorZ, pos)
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
        let c = this.assets.lastElementChild;
        while(c)
        {
            this.assets.removeChild(c);
            c = this.assets.lastElementChild;
        }
        this.assets.remove();

        c = this.element.lastElementChild;
        while(c)
        {
            this.element.removeChild(c);
            c = this.element.lastElementChild;
        }
        this.element.remove();
    }

};