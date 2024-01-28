
import './DotNetSetup.js'

window.DemoFileLoaded = true;
window.DemoFileReady = false;

console.log("DemoFile.js started");

// define JS exports (which can be imported into C#)
window.DotNetSetModuleImports("DemoFile.js", {
  cs_CopyInputData: cs_CopyInputData,
  cs_DataProcessed: cs_DataProcessed,
});

const demoFileProgram = window.DotNetExports.DemoFile.ExternalCommunication.Program;

// print string returned from C#
console.log(demoFileProgram.Greeting());

var demoFile_ArrayToCopy = null; // Uint8Array
var demoFile_ResultArray = null; // Uint8Array
var demoFile_Callback = null; // function(int)

window.DemoFileSendDataToLibrary = async function (arrayToSend, resultArray, callback)
{
    demoFile_ArrayToCopy = arrayToSend;
    demoFile_ResultArray = resultArray;
    demoFile_Callback = callback;

    await demoFileProgram.ProcessData();

    demoFile_ArrayToCopy = null;
    demoFile_ResultArray = null;
    demoFile_Callback = null;
}

// so it can be easily tested from Browser's console
window.DemoFileTestCommandProcessing = testCommandProcessing;

// test using "ping" command
await testCommandProcessing("ping\n", 32);

// test errors
await testCommandProcessing("open 0 non-existing-file\n", 1024);
await testCommandProcessing("openl 0 non-existing-link\n", 1024);
await testCommandProcessing("close bla\n", 1024);

window.DemoFileReady = true;
console.log("DemoFile.js ready");



function cs_CopyInputData(destinationMemoryView)
{
    // destinationMemoryView is IMemoryView
    // see: https://github.com/dotnet/runtime/blob/1631f312c6776c9e1d6aff0f13b3806f32bf250c/src/mono/wasm/runtime/dotnet.d.ts#L246-L264
    
    /**
     * copies elements from provided source to the wasm memory.
     * target has to have the elements of the same type as the underlying C# array.
     * same as TypedArray.set()
     */
    //set(source: TypedArray, targetOffset?: number): void;

    destinationMemoryView.set(demoFile_ArrayToCopy, 0);

    var length = demoFile_ArrayToCopy.length;

    demoFile_ArrayToCopy = null;

    return length;
}

function cs_DataProcessed(memoryView)
{
    // demoFile_ResultArray is Uint8Array

    var sourceArr = memoryView.slice(); // TypedArray
    demoFile_ResultArray.set(sourceArr, 0);

    if (demoFile_Callback)
        demoFile_Callback(sourceArr.length);
}

async function testCommandProcessing(command, bufferSize)
{
    var resultBuf = new Uint8Array(bufferSize);
    await window.DemoFileSendDataToLibrary(new TextEncoder('UTF-8').encode(command), resultBuf, null);
    var decodedString = new TextDecoder('UTF-8').decode(resultBuf);
    console.log("Command '" + command + "'" + " returned: " + decodedString);
}
