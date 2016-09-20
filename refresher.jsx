/*
	Refresher
	Refresh ScriptUIs in a panel, without closing it.

	To use: Place this file in the ScriptUI folder.
	Press the "..." button to select a script file to run.
	Press the "R" button to refresh the scriptFile

	Made by Rune Gangsø
	Email: runegan@gmail.com
	Github: github.com/runegan/refresher
*/

( function( thisObj ) {
if ( !( thisObj instanceof Panel ) ) {
	alert( "Must be run from ScriptUI folder", "Error", true );
	return;
}

// Create Refresher UI
var refreshGroup = thisObj.add(
  "group { alignment: ['fill', 'top'], alignChildren: 'fill', spacing: 0, margins: 0}"
);
var refreshButton = refreshGroup.add( "button { text: 'r', maximumSize: [20, 20] }" );
var changeButton = refreshGroup.add( "button { text: '...', maximumSize: [20, 20] }" );
var theScriptFile;

refreshButton.onClick = refreshCall;
changeButton.onClick = change;

// =========================================== Functions ===========================================

// Change script file
function change() {
	var file = File.openDialog( "Open jsx file" );

	// Make sure user did not cancel
	if ( file ) {
		theScriptFile = file;

		// Save script file location in a setting
		app.settings.saveSetting( "refresher", "scriptFilePath", theScriptFile.fsName );
		refreshCall();
	}
}

function refreshCall() {
	refresh.call( thisObj );
}

function refresh() {

	// Remove everything except RefreshGroup from the panel
	for ( var i = thisObj.children.length - 1; i >= 0; i-- ) {
		if ( thisObj.children[ i ] !== refreshGroup ) {
			thisObj.remove( thisObj.children[ i ] );
		}
	}

	// Run the scriptFile
	try {
		$.evalFile( theScriptFile );

	// Alert any errors
	} catch ( err ) {
		alert( err.fileName + "\n" + err.message + " on line " + err.line );
	}

	// Recalculate UI
	thisObj.layout.layout( true );
}

// Check if a script file is stored in the settings
if ( app.settings.haveSetting( "refresher", "scriptFilePath" ) ) {
	theScriptFile = new File( app.settings.getSetting( "refresher", "scriptFilePath" ) );
	if ( !theScriptFile.exists ) {
		theScriptFile = null;
	}
}

// Prompt user for a script file if none was found
if ( !theScriptFile ) {
	change();
}

thisObj.layout.layout( true );

}( this ) );
