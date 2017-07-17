#include <webassembly.h>

#include "gamemanager.h"
#include "uimanager.h"
 
int main() {
    console_log("Successfully entered main()!");

    initGameManager();
    initUIManager();


    return 0;
}

/**
    IMPORTED functions from the browser
*/

/* Display a window.alert message on the browser */
import void alert(char *message);

/**
    EXPORTED functions to the browser
*/