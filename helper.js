
function styleColorToRgb(color){
    if(color.indexOf('rgb(')===0){
        return color;
    }else if(color.indexOf('#')===0){
        let t = hexToRgb(color);
        return t?`rgb(${t.r},${t.g},${t.b})`:null;
    }
    return null
}
function styleColorToHex(color){
    if(color.indexOf('rgb(')===0){
        let t = color.trim().replace(/^rgb\(/,'').replace(/[^,0-9A-Fa-f]/g,'')
        let rgb = t.split(',')
        // console.log(rgb);
        return rgbToHex(...rgb.map((v)=>{return parseInt(v,10)}));
    }else if(color.indexOf('#')===0){
        return color;
    }
    return null
}

// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if(!result){
        result = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
    }
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }