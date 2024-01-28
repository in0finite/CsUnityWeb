
// setup html elements

var unityContainerElement = document.getElementById('unity-container');

unityContainerElement.addEventListener('dragover', function (event) {
    event.preventDefault();
});

unityContainerElement.addEventListener('drop', window.LocalFileSystem_HandleDropEvent);


function LocalFileSystem_ReadFileBlockingUsingXHR(fileIndex, streamPosition, countToRead) {

    var fileEntry = window.unityFileSystemEntries[fileIndex];

    if (!fileEntry.openedFile)
        return;

    LocalFileSystem_ReadFileBlockingUsingXHRInternal(fileEntry.openedFile, streamPosition, countToRead);
}

function LocalFileSystem_ReadIndividualFileBlockingUsingXHR(fileId, streamPosition, countToRead) {

    var fileEntry = window.unityIndividualFileEntries.get(fileId);

    if (!fileEntry.openedFile)
        return;

    LocalFileSystem_ReadFileBlockingUsingXHRInternal(fileEntry.openedFile, streamPosition, countToRead);
}

// this function doesn't work as part of jslib, so we keep it here
function LocalFileSystem_ReadFileBlockingUsingXHRInternal(file, streamPosition, countToRead) {
    
    var slicedBlob = file.slice(streamPosition, streamPosition + countToRead);

    var url = URL.createObjectURL(slicedBlob);

    var xhr = new XMLHttpRequest();

    xhr.open('GET', url, false);

    // xhr.responseType = "arraybuffer";
    //xhr.setRequestHeader("Content-Type", "text/plain;charset=x-user-defined");
    xhr.overrideMimeType("text/plain; charset=x-user-defined");

    xhr.send(null);

    if (xhr.status != 200)
        return;

    var arr = window.LocalFileSystem_IntArrayFromString(xhr.responseText);

    window.unitySendByteArray(arr, 0);

    URL.revokeObjectURL(url);
};


console.log("Script loaded");
