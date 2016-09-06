/*jshint esversion: 6 */

document.addEventListener("DOMContentLoaded", function() {

    let gradient = [' ', '.', ':', ';', 'o', '8','#'];
    // gradient = [' ', '.', 'o','#'];

    let width = 100,
        height = 100,
        narrow_lines = true;

    let img = new Image();
    img.src = 'pic.png';

    let ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    img.onload = function() {
        // drawing image to canvas and reading pixel data
        ctx.drawImage(img, 0, 0, width, height);
        imgData = ctx.getImageData(0, 0, width, height).data;
        let display = '';
        for (let i = 0; i < width*height; i++) {
            let base = i*4;
            // calculating average pixel darkness
            let avg = (imgData[base]+imgData[base+1]+imgData[base+2])/3;
            // accounting for pixel transparency (taking white as baseline)
            avg = (255 - avg)*imgData[base+3]/255;
            // adding the
            display += gradient[Math.round((avg/255)*(gradient.length-1))];
            if ((i+1)%width === 0) {
                display += '\n';
            }
        }
        // deleting even lines when line for regular width lines
        if (!narrow_lines) {
            display = display.split('\n').map(function(val, index) {
                if (index%2) {
                    return val + '\n';
                } else {
                    return '';
                }
            }).join('');
        }
        document.getElementById('container').innerHTML = display;
    };

    document.body.appendChild(ctx.canvas);

});
