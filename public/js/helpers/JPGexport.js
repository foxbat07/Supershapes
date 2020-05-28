// set time and clocks
var date = new Date();
var currentTime = date.getTime();

function saveAsImage() {
    var imgData;
    try {
        var strMime = "image/jpeg";
        var strDownloadMime = "image/octet-stream";
        imgData = renderer.domElement.toDataURL(strMime);
        var fileName = 'supershape-image-' + currentTime+ '.jpg';
        saveFile(imgData.replace(strMime, strDownloadMime), fileName);
    } catch (e) {
        console.log(e);
        return;
    }
}

var saveFile = function (strData, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); //Firefox requires the link to be in the body
        link.download = filename;
        link.href = strData;
        link.click();
        document.body.removeChild(link); //remove the link when done
    } else {
        location.replace(uri);
    }
}