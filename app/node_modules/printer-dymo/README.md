# Printer Dymo

An Electron Node.js module for interacting with Dymo LabelWriter printers using the [DLS SDK](http://developers.dymo.com/). This library is built and maintained by [Paul Prins](https://github.com/paulprins/) of [Fresh Vine](https://freshvine.co/) for their [Event Kiosk](https://freshvine.co/Event-Kiosk/).

The documentation for the SDK is located in the [SDK sample file](http://developers.dymo.com/2016/11/29/sample-samples-samples/) from DYMO. You can [download it from here](http://www.labelwriter.com/software/dls/sdk/samples/SDKSamples.zip).

## Installation

You will need the latest [Dymo LabelWriter software](http://download.dymo.com/dymo/Software/Win/DLS8Setup.8.5.1.exe) installed first.  This provides all of the dependent Dymo libraries.

``` bash
$ npm install printer-dymo --save
```

## Use

This impementation is still very young but is production ready.

```
var printerDymo = require('printer-dymo'),
	fs = require('fs');

// It takes a second or two for initialization to complete.
setTimeout(function(){

	// Gets an array of IPrinter objects (Dymo printers on the current system)
	printerDymo.getPrintersAsync(null, function(err, printers){
		if (err) throw err;
		console.log(printers);
	});

	// A print object;
	var printArgs = {
		printer: 'DYMO LabelWriter 450',	//name of printer
		jobTitle: 'My Sweet Labels',
		labels:[{
			filename: 'test.label',		//path to label
			fields: {
				name: 'Timmy',
				barcode: '100360931'
			},
			images: {
				photo: fs.readFileSync('face.png')
			}
		}]
	};

	printerDymo.print(printArgs, function(err, res){
		if (err) throw err;
		console.log("Finished Printing.");
	});

}, 2000);

```

### getPrinter

### getPrinters();

### getPrintersSync();

## TODO

- [x] Test coverage  
- [x] Build instructions  
- [ ] Make use of EventEmitter and fire Ready event after initialization  
- [ ] Improve API  
- [ ] Travis CI  

## Building

Prerequisits:

Install [Node.js](https://nodejs.org/en/download/).  Then install gyp:

``` bash
$ npm install -g node-gyp
```

For gyp you will also need:

* On Windows:
  * [Python 2.7.x](https://www.python.org/getit/windows)
  * Microsoft Visual Studio C++ 2015/7
  * [Windows 64-bit SDK](https://msdn.microsoft.com/en-us/windows/desktop/bg162891.aspx)
  * [Dymo LabelWriter v8.7.2](http://download.dymo.com/dymo/Software/Win/DLS8Setup.8.5.1.exe)

### Updating Dymo included DLLs

To get the DLLs to include in the project you need to install the DLS software from DYMO. The 32 bit versions are placed into the base install directory (c:\Program Files (x86)\DYMO\DYMO Label Software), and the 64 bit versions are in the x64 folder off that base directory. Beyond that there is a `DYMO.Label.Framework.dll` file located in the 'Framework' directory.

Whenever there is an update to the DYMO DLS we should update these libraries if there are any differences.

### Including .NetFramework for Windows Deployments with Electron.json

In order for the **electron-edge-js** library to work correctly the client computer must have the .NetFramwork 4.5 installed. So you can either require them to install this (which will likely just lead to higher support volume to explain this), or you can include the needed library items in your build.  

To include the required DLLs you should download them from microsoft - [download .NetFramework 4.5](https://www.microsoft.com/en-us/download/details.aspx?id=30653). You need 4 of these libraries (concrt140.dll, msvcp140.dll, vccorlib140.dll, vcruntime140.dll). Electron Builder makes it easy to use architecture in their `extraFiles` ([docs](https://www.electron.build/configuration/contents)). The code below will grab every file in the `extraLib/dotNetFramework/x64/` directory for an x64 build on windows, and place it in the application root directory. Using the dependency walker we were able to verify that the application utilized these files, instead of those on (or missing from) the client system.


```json
{
	...
	"build": {
		...

		"files": [
			"!**/extraLib/**/*"
		],
		"win": {
			"extraFiles": [
				{
					"from": "extraLib/dotNetFramework/${arch}/",
					"to": "",
					"filter": "**/*"
				}
			]
		}
		...
	}
	...
}
```

We deploy to both x64 and ia32. Make sure the correctly build libraries are in the correct locations. Our paths look like:  

	extraLib/dotNetFramework/ia32/concrt140.dll
	extraLib/dotNetFramework/ia32/msvcp140.dll
	extraLib/dotNetFramework/ia32/vccorlib140.dll
	extraLib/dotNetFramework/ia32/vcruntime140.dll
	extraLib/dotNetFramework/x64/concrt140.dll
	extraLib/dotNetFramework/x64/msvcp140.dll
	extraLib/dotNetFramework/x64/vccorlib140.dll
	extraLib/dotNetFramework/x64/vcruntime140.dll

These files are not included here to allow for flexibility in use. Also you may have other libraries that make use of this framework, and including it multiple times would add overhead to your project.

## Publishing

``` bash
npm pack
npm publish
```

## Contributing

Fork, add unit tests for any new or changed functionality.

Lint and test your code.

## Release History

* 1.0.3 Update the DYMO DLLs to fix the printing delay introduced in April 2018, add new print parameter for quality level. Fixed the printing copies parameter (had a type conversion exception thrown).
* 1.0.2 Update readme with better implementation instructions.
* 1.0.1 Changed to `electron-edge-js` from `electron-edge` as it has wider support.
* 1.0.0 Rebuilt the C# library as a shared library resource and not have Synchronous & Asynchronous functions.  
	Now includes 2 missing DYMO libraries (`DYMOPrinting.dll` & `PrintingSupportLibrary.dll`) that caused errors when deployed. These are included with both x86 & x64 flavors.
* 0.4.0 Refactored C# `dymo.cs` to use dynamic variables in place of object variables.  
* 0.1.0 Fix: Had default print copies set to 3 for testing that was committed.  
* 0.0.3 Printing multiple labels in a single print job.  
* 0.0.1 Initial release; Module boilerplate.  
