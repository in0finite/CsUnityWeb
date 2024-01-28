
import { dotnet } from './../framework/dotnet.js'

const { setModuleImports, getAssemblyExports, getConfig } = 
    await dotnet.create();

console.log("dotnet runtime created");

// obtain exported C# objects
const config = getConfig();
const exportedObjects = await getAssemblyExports(config.mainAssemblyName);

window.DotNetExports = exportedObjects;
window.DotNetSetModuleImports = setModuleImports;

console.log("dotnet setup completed");
