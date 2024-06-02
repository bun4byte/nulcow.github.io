/* === IMPORTS === */

import * as THREE from 'three';

/* === UI STRING UTIL === */

const strings = {
	editor_skinTone: "Skin Tone",
	editor_eyes: "Eyes",
	editor_mouth: "Mouth",
	editor_hair: "Hair Style",
	editor_animation: "Animation",
	item_neutral: "Neutral",
	item_cheerful: "Cheerful",
	item_squinted: "Squinted",
	item_smug: "Smug",
	item_kitty_lips: "Kitty Lips",
	item_medium_straight: "Medium Straight",
	anim_idle: "Idle",
	anim_walk: "Walk",
	anim_run: "Run",
	anim_fly: "Fly"
};

function getDisplayString(key) {
	return strings[key];
}

/* === PREVIEW HANDLER === */

const previewCanvas = document.getElementById("previewImage")

const previewAnimations = {
	idle: new skinview3d.IdleAnimation(),
	walk: new skinview3d.WalkingAnimation(),
	run: new skinview3d.RunningAnimation(),
	fly: new skinview3d.FlyingAnimation()
};

const previewAnimationsArray = [
	previewAnimations.idle,
	previewAnimations.walk,
	previewAnimations.run,
	previewAnimations.fly
];

const previewAnimationNames = [
	"anim_idle",
	"anim_walk",
	"anim_run",
	"anim_fly"
];

// Set up SkinView3D
let skinViewer = new skinview3d.SkinViewer({
		canvas: previewCanvas,
		width: previewCanvas.width,
		height: previewCanvas.height,
		skin: "img/char.png"
	});

// Set the background color
skinViewer.background = 0x808080;

// Set the background to a normal image
//skinViewer.loadBackground("img/background.png");

// Set the background to a panoramic image
skinViewer.loadPanorama("img/panorama_image.png");

// Change camera FOV
skinViewer.fov = 15;

// Zoom out
skinViewer.zoom = 0.75;

// Rotate the player
skinViewer.autoRotate = false;

/* === EDITOR TAB NAVIGATION === */

const tabNav = document.getElementById("editorNav");
const tabPageContainer = document.getElementById("editorOptionsContainer");
const tabPages = document.getElementsByClassName("tab-page");
const tabs = document.getElementsByClassName("editor-tab");

var currentTab = window.location.hash.substring(1);
if (currentTab == "" || currentTab == undefined)
	currentTab = "editBody";

for (var i = 0; i < tabs.length; i++) {
	const tab = tabs[i];

	var tabOnClick = () => {
		currentTab = tab.id.substring(1);
		updateTabPage();
	};

	tab.onclick = tabOnClick;
}

function updateTabPage() {
	console.log("Tab changed to " + currentTab);

	for (var i = 0; i < tabPages.length; i++) {
		const tabPage = tabPages[i];

		if (tabPage.id != currentTab) {
			tabPage.style = "display:none;";
		} else {
			tabPage.style = "display:block;";
		}
	}
}

updateTabPage();

/* === CHARACTER & ITEM DATA === */

const itemType = {
	eyes: "eyes",
	mouth: "mouth",
	hair: "hair",
	top: "top",
	bottoms: "bottoms",
	outerwear: "outerwear",
	graphic: "graphic"
};

class Item {
	type;
	name;
	colour = 0xFFFFFF;
	recolourable = false;

	constructor(name, type) {
		this.name = name;
		this.type = type;
	}
}

const neutralEyes = new Item("neutral", itemType.eyes);
neutralEyes.recolourable = true;
const cheerfulEyes = new Item("cheerful", itemType.eyes);
cheerfulEyes.recolourable = true;
const squintedEyes = new Item("squinted", itemType.eyes);
squintedEyes.recolourable = true;

const neutralMouth = new Item("neutral", itemType.mouth);
const cheerfulMouth = new Item("cheerful", itemType.mouth);
const smugMouth = new Item("smug", itemType.mouth)
const kittyLipsMouth = new Item("kitty_lips", itemType.mouth);

const mediumStraightHair = new Item("medium_straight", itemType.hair);
mediumStraightHair.recolourable = true;

const tShirtTop = new Item("t_shirt", itemType.top);
tShirtTop.recolourable = true;

const jeanBottoms = new Item("jeans", itemType.bottoms);

class Character {
	clothing = [
		tShirtTop,
		jeanBottoms
	];

	body = {
		skinTone: 0xA07860,
	};

	face = {
		eyes: neutralEyes,
		mouth: neutralMouth
	};

	hair = mediumStraightHair;
}

var character = new Character();
character.hair.colour = 0x4A382E;
character.face.eyes.colour = 0x4A382E;

/* === EDITOR CONTROL BUILDER === */

const bodyEditorPage = document.getElementById("editBody");
const faceEditorPage = document.getElementById("editFace");
const hairEditorPage = document.getElementById("editHair");
const previewControls = document.getElementById("previewControls");

function numberToHexColour(number) {
	var hexString = number.toString(16);
	var hexCode = "#" + hexString;

	return hexCode;
}

function createColourPicker(property, labelText) {
	var container = document.createElement("div");
	container.classList.add("editor-control-wrapper")

	var colourPicker = document.createElement("input");
	colourPicker.type = "color";
	colourPicker.setAttribute("value", numberToHexColour(property));

	var label = document.createElement("span");
	label.innerText = getDisplayString(labelText) + ": ";

	container.appendChild(label);
	container.appendChild(colourPicker);

	return container;
}

function createTilePicker(selection, objects, labelText, objectNames) {
	var container = document.createElement("div");
	container.classList.add("editor-control-wrapper-block");

	var tileList = document.createElement("div");
	tileList.classList.add("editor-tile-picker");

	var tiles = [];

	objects.forEach((object) => {
		var tile = document.createElement("div");
		tile.classList.add("editor-option-tile");
		if (objectNames) {
			tile.innerText = getDisplayString(objectNames[objects.indexOf(object)])
		} else {
			tile.innerText = getDisplayString("item_" + object.name);
		}

		if (object == selection) {
			tile.setAttribute("data-selected", true);
		}

		tile.onclick = () => {
			tile.setAttribute("data-selected", true);

			tiles.forEach((otherTile) => {
				if (tile != otherTile) {
					tile.setAttribute("data-selected", false);
				}
			});
		};

		tileList.appendChild(tile);
		tiles[tiles.length] = tile;
	});

	console.log(tiles);

	var label = document.createElement("span");
	label.innerText = getDisplayString(labelText) + ": ";

	container.appendChild(label);
	container.appendChild(tileList);

	return container;
}

var skinTonePicker = createColourPicker(character.body.skinTone, "editor_skinTone");
bodyEditorPage.appendChild(skinTonePicker);

var eyeTypePicker = createTilePicker(character.face.eyes, [neutralEyes, cheerfulEyes, squintedEyes], "editor_eyes");
faceEditorPage.appendChild(eyeTypePicker);

var mouthTypePicker = createTilePicker(character.face.mouth, [neutralMouth, cheerfulMouth, smugMouth, kittyLipsMouth], "editor_mouth");
faceEditorPage.appendChild(mouthTypePicker);

var hairStylePicker = createTilePicker(character.hair, [mediumStraightHair], "editor_hair");
hairEditorPage.appendChild(hairStylePicker);

var previewAnimationPicker = createTilePicker(undefined, previewAnimationsArray, "editor_animation", previewAnimationNames);
previewControls.appendChild(previewAnimationPicker);