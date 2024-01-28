
import './DotNetSetup.js'

console.log("Zstd.js started");

// define JS exports (which can be imported into C#)
window.DotNetSetModuleImports("Zstd.js", {
    cs_ZstdCopyCompressedData: cs_ZstdCopyCompressedData,
    cs_ZstdDataDecompressed: cs_ZstdDataDecompressed,
  });

const exportedCSObject = window.DotNetExports.DemoFile.ExternalCommunication.Program;

var zstd_compressedArray = null;
var zstd_decompressedArray = null;

window.ZstdDecompress = function(compressedUint8Array, destUint8Array)
{
    zstd_compressedArray = compressedUint8Array;
    zstd_decompressedArray = destUint8Array;

    console.log("js decompressing zstd, " + zstd_compressedArray.length + ", " + zstd_decompressedArray.length);

    exportedCSObject.ZstdDecompress(compressedUint8Array.length, destUint8Array.length);

    console.log("js decompressed zstd, " + zstd_compressedArray.length + ", " + zstd_decompressedArray.length);

    zstd_compressedArray = null;
    zstd_decompressedArray = null;
}

function cs_ZstdCopyCompressedData(destinationMemoryView)
{
    // destinationMemoryView is IMemoryView

    console.log("cs_ZstdCopyCompressedData, " + zstd_compressedArray.length);

    //set(source: TypedArray, targetOffset?: number): void;
    destinationMemoryView.set(zstd_compressedArray, 0);
}

function cs_ZstdDataDecompressed(decompressedMemoryView)
{
    var decompressedArray = decompressedMemoryView.slice(); // TypedArray

    console.log("cs_ZstdDataDecompressed, " + decompressedArray.length);

    zstd_decompressedArray.set(decompressedArray, 0);
}

console.log("Zstd.js finished");
