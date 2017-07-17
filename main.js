
/*
	Entry point of the application: load everything up when DOM is ready
*/

if(typeof WebAssembly != "object") {
    alert("ERROR: This game requires a browser capable of running WebAssembly.");
} else {

    console.log("Loading game binary...");
    console.time("load time");

    let gameMemory;

    const loadOptions = {
        imports: {
            alert: function(stringPtr) {
                let string = gameMemory.getString(stringPtr);
                alert(string);
            }
        }
    };

    load("bin/game.wasm", loadOptions).then(module => {
        gameMemory = module.memory;

        console.timeEnd("load time");
        //console.log("1 + 2 = " + module.exports.add(1, 2));
    });
}


/*
$(() => {

    if(!WebAssembly) {
        alert("ERROR: This game requires a browser capable of running WebAssembly.");
        return;
    }

    // Define WebAssembly imports:
    var importObj = {
        global: {

        }
    };

    console.log("Loading WebAssembly binaries...");

    // Load the main game binary:
    fetch('./bin/game.wasm').then(response =>
        response.arrayBuffer() // convert the WASM file into an ArrayBuffer
    ).then(bytes =>
        WebAssembly.instantiate(bytes, {}) // load the ArrayBuffer and supply importObj
    ).then(result => {

        // Game binary has been loaded:
        window.exports = result.instance.exports;
        window.memory = exports.memory;
        window.data = new DataView(memory.buffer);
        //window.array = new UInt8Array(memory.buffer);
        //window.f32 = new Float32Array(memory.buffer);

        console.log(window.exports.add(5, 10));

        console.log("WebAssembly binaries have been successfully loaded!");

    })
});
*/