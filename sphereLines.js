/*
 Copyright 2011 (C) by Guido D'Albore (guido@bitstorm.it)

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

var sphere = new Sphere3D();
var html5logo = new Image();
var html5radius = 50;
var html5direction = 0.5;
var rotation = 0;
var distance = 0;

var renderCount = 0;
var renderStop = -1;


// Point3D constructor
function Point3D() {
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

// Sphere3D constructor. It builds a 3D sphere from scratch.
function Sphere3D(radius) {

    this.point = new Array();
    this.color = "rgb(100,0,255)"
    this.radius = (typeof(radius) == "undefined") ? 20.0 : radius;
    this.radius = (typeof(radius) != "number") ? 20.0 : radius;
    this.numberOfVertexes = 0;

    var vertexStep = (3.14159265359 * 2) / 24;
    //var vertexStep = 0.1745329;

    //circle on X
    // It builds the middle circle on the XZ plane. Loop of 2*pi with a step of 0.17 radians.
    for(alpha = 0; alpha <= (3.14159265359 * 2); alpha += vertexStep) {
        p = this.point[this.numberOfVertexes] = new Point3D();

        p.x = Math.cos(alpha) * this.radius;
        p.y = 0;
        p.z = Math.sin(alpha) * this.radius;

        this.numberOfVertexes++;
    }


    //circle on Z
    for(alpha = 0; alpha <= (3.14159265359 * 2); alpha += vertexStep) {
        p = this.point[this.numberOfVertexes] = new Point3D();

        p.x = Math.cos(alpha) * this.radius;
        p.y = Math.sin(alpha) * this.radius;
        p.z = 0;

        this.numberOfVertexes++;
    }


    //circle on Y
    for(alpha = 0; alpha <= (3.14159265359 * 2); alpha += vertexStep) {
        p = this.point[this.numberOfVertexes] = new Point3D();

        p.x = 0;
        p.y = Math.cos(alpha) * this.radius;
        p.z = Math.sin(alpha) * this.radius;;

        this.numberOfVertexes++;
    }


    // It builds two hemispheres:
    //  - First hemisphere: loop of pi/2 with step of 0.17 (direction = 1)
    //  - Second hemisphere: loop of pi/2 with step of 0.17 (direction = -1)

    //for(var direction = -1; direction >= -1; direction -= 2) {
    //    for(var beta = 0.17; beta < 1.445; beta += 0.17) {
    //        var radius = Math.cos(beta) * this.radius;
    //        var fixedY = Math.sin(beta) * this.radius * direction;
    //
    //        for(var alpha = 0; alpha < 6.28; alpha += 0.17) {
    //
    //            console.log("vtxs mode 2" + this.numberOfVertexes % 2);
    //
    //            if (this.numberOfVertexes % 2 ) break;
    //
    //
    //            p = this.point[this.numberOfVertexes] = new Point3D();
    //
    //            p.x = Math.cos(alpha) * radius;
    //            p.y = fixedY;
    //            p.z = Math.sin(alpha) * radius;
    //
    //            this.numberOfVertexes++;
    //            console.log("hemi: " + direction + " numVxs:" + this.numberOfVertexes);
    //
    //            //if (this.numberOfVertexes >= 300) break;
    //        }
    //    }
    //}

}

// Utility method to rotate point by X in a 3D space
function rotateX(point, radians) {
    var y = point.y;
    point.y = (y * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
    point.z = (y * Math.sin(radians)) + (point.z * Math.cos(radians));
}

// Utility method to rotate point by Y in a 3D space
function rotateY(point, radians) {
    var x = point.x;
    point.x = (x * Math.cos(radians)) + (point.z * Math.sin(radians) * -1.0);
    point.z = (x * Math.sin(radians)) + (point.z * Math.cos(radians));
}

// Utility method to rotate point by Z in a 3D space
function rotateZ(point, radians) {
    var x = point.x;
    point.x = (x * Math.cos(radians)) + (point.y * Math.sin(radians) * -1.0);
    point.y = (x * Math.sin(radians)) + (point.y * Math.cos(radians));
}

// Utility method to project a 3D point on a 2D surface
function projection(xy, z, xyOffset, zOffset, distance) {
    return ((distance * xy) / (z - zOffset)) + xyOffset;
}

// Main render function. This method is called for each frame (see init() method for initialization).
function render() {

    if (renderStop < 0 || renderCount < renderStop) {
        renderCount++;

        var canvas = document.getElementById("sphere3d");
        var width = canvas.getAttribute("width");
        var height = canvas.getAttribute("height");
        var ctx = canvas.getContext('2d');
        var x, y, x2, y2;

        var p = new Point3D();

        ctx.save();
        ctx.clearRect(0, 0, width, height);

        ctx.globalCompositeOperation = "lighter";


        for (i = 0; i < sphere.numberOfVertexes; i++) {

            p.x = sphere.point[i].x;
            p.y = sphere.point[i].y;
            p.z = sphere.point[i].z;

            rotateX(p, rotation);
            rotateY(p, rotation);
            rotateZ(p, rotation);

            x = projection(p.x, p.z, width / 2.0, 100.0, distance);
            y = projection(p.y, p.z, height / 2.0, 100.0, distance);


            //draw RED X axis line
            if (i == 12) {
                //Create a second point half way around circle to draw a line between
                p.x = sphere.point[i + 12].x;
                p.y = sphere.point[i + 12].y;
                p.z = sphere.point[i + 12].z;

                rotateX(p, rotation);
                rotateY(p, rotation);
                rotateZ(p, rotation);

                x2 = projection(p.x, p.z, width / 2.0, 100.0, distance);
                y2 = projection(p.y, p.z, height / 2.0, 100.0, distance);

                drawLine(ctx, x, y, x2, y2, 6, "rgba(255,0,0,0.6)");

            }


            //draw green axis line
            if (i == 6 ) {
                //Create a second point half way around circle to draw a line between
                p.x = sphere.point[i + 12].x;
                p.y = sphere.point[i + 12].y;
                p.z = sphere.point[i + 12].z;

                rotateX(p, rotation);
                rotateY(p, rotation);
                rotateZ(p, rotation);

                x2 = projection(p.x, p.z, width / 2.0, 100.0, distance);
                y2 = projection(p.y, p.z, height / 2.0, 100.0, distance);

                drawLine(ctx, x, y, x2, y2, 6, "rgba(0,0,255,0.6)");

            }

            //Draw blue line
            if (i == 30 ) {
                //Create a second point half way around circle to draw a line between
                p.x = sphere.point[i + 12].x;
                p.y = sphere.point[i + 12].y;
                p.z = sphere.point[i + 12].z;

                rotateX(p, rotation);
                rotateY(p, rotation);
                rotateZ(p, rotation);

                x2 = projection(p.x, p.z, width / 2.0, 100.0, distance);
                y2 = projection(p.y, p.z, height / 2.0, 100.0, distance);

                drawLine(ctx, x, y, x2, y2, 6, "rgba(0,255,0,0.6)");

            }

            if ((x >= 0) && (x < width)) {
                if ((y >= 0) && (y < height)) {

                    //if you want the back half to render as dots instead of globes

                    //if(p.z < 0) {
                    //    drawPoint(ctx, x, y, 4, "rgba(200,200,200,0.6)");
                    //} else {
                    //    drawPointWithGradient(ctx, x, y, 10, "rgb(0,200,0)", 0.8);
                    //}


                    //drawPoint(ctx, x, y, 4, "rgba(200,200,200,.6)");


                    //Draw the points on the axis intersections as different colors
                    if (i == 0)
                    {
                        drawPoint(ctx, x, y, 20, "rgb(255,0,0)", 0.8);
                    }
                    if (i == 12)
                    {
                        drawPoint(ctx, x, y, 20, "rgb(255,0,0)", 0.8);
                    }
                    if (i == 6)
                    {
                        drawPoint(ctx, x, y, 20, "rgb(0,0,255)", 0.8);
                    }
                    if (i == 18)
                    {
                        drawPoint(ctx, x, y, 20, "rgb(0,0,255)", 0.8);
                    }
                    if (i == 30)
                    {
                        drawPoint(ctx, x, y, 20, "rgb(0,255,0)", 0.8);
                    }
                    if (i == 42)
                    {
                        drawPoint(ctx, x, y, 20, "rgb(0,255,0)", 0.8);
                    }
                    else {
                        drawPointWithGradient(ctx, x, y, 10, "rgb(0,200,0)", 0.8);
                    }
                }
            }
        }


        ctx.restore();
        ctx.fillStyle = "rgb(150,150,150)";
        ctx.fillText("G-Force control", width - 90, height - 5);
        rotation += Math.PI / 90.0;

        if (distance < 1000) {
            distance += 20;
        }
    }
}

// This method draws a single point (a vertex of 3D sphere) in the canvas
function drawPoint(ctx, x, y, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, size, 0, 2*Math.PI, true);
    ctx.fill();
    ctx.restore();
}


function drawLine(ctx, x, y, x2, y2, size, color) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x2,y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.stroke();
}

// This method draws a single point with gradient (a vertex of 3D sphere) in the canvas
function drawPointWithGradient(ctx, x, y, size, color, gradient) {
    var reflection;

    reflection = size / 4;

    ctx.save();
    ctx.translate(x, y);
    var radgrad = ctx.createRadialGradient(-reflection,-reflection,reflection,0,0,size);

    radgrad.addColorStop(0, '#FFFFFF');
    radgrad.addColorStop(gradient, color);
    radgrad.addColorStop(1, 'rgba(1,159,98,0)');

    ctx.fillStyle = radgrad;
    ctx.fillRect(-size,-size,size*2,size*2);
    ctx.restore();
}

// This method draws the HTML5 logo
function drawHtml5Logo(ctx, x, y) {

    html5radius += html5direction;

    if((html5radius < 40) || (html5radius >= 60)) {
        html5direction *= -1;
    }

    ctx.save();
    //ctx.scale(0.8,0.8);
    drawHalo(ctx, x + (html5logo.width/2), y + (html5logo.height/2), html5radius, "rgb(255,255,255)", 0.1);
    ctx.drawImage(html5logo, x, y);
    ctx.restore();
}

// This method draws a pulsing halo around the HTML5 logo
function drawHalo(ctx, x, y, size, color, gradient) {
    var reflection;

    reflection = size / 4;

    ctx.save();
    ctx.translate(x, y);
    var radgrad = ctx.createRadialGradient(0, 0, reflection, 0, 0, size);

    radgrad.addColorStop(0, '#FFFFFF');
    radgrad.addColorStop(gradient, color);
    radgrad.addColorStop(1, 'rgba(1,159,98,0)');

    ctx.fillStyle = radgrad;
    ctx.fillRect(-size,-size,size*2,size*2);
    ctx.restore();
}

function init(){

    // Set frame-rate to 30 fps
    setInterval(render, 1000/30);

    html5logo.src = "html5-badge-h-solo.png";
}
