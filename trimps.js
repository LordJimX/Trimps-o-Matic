// MODULES
var moduleJob = false;
var moduleUpgrade = false;
var moduleEquipment = false;
var moduleStorage = true;
var moduleStructure = false;
var moduleMapForEquipment = false;

// STORAGE SETTINGS
var buyStorageThreshold = 0.9;

// STRUCTURE SETTINGS
var gymBuyThreshold = 0.05; // cost of gym / owned wood
var tributeBuyThreshold = 0.1; // cost of tribute / owned food

// JOB SETTINGS
var trainerBuyThreshold = 0.2; // cost of trainer / owned food
var explorerBuyThreshold = 0.2; // cost of explorer / owned food
var lumberRatio = 1; // for 1 farmer
var minerRatio = 1.3; // for 1 farmer
var scientistRatio = 0.7; // for 1 farmer
var maxScientist = 200; // max scientist to buy
var baseJobThreshold = 0.01; // workers kept unumployed for high level jobs. Rate of total umployed
var minBaseJobThreshold = 3; // workers kept unumployed for high level jobs at minimum (if above lower)

// UPGRADE SETTINGS
var buyShieldblock = false;

// EQUPMENT SETTINGS
var buySupershield = false;

debug("Trimp-o-matic loaded");

var runInterval = 1000; //main loop interval
var ToMactivated = false;
var ToMsettingsOpened = false;
var ToMinterval;

var ToMbutton, testButton;
var foodOwned, woodOwned, metalOwned, fragmentsOwned, gemsOwned, scienceOwned, heliumOwned;
var foodMax, woodMax, metalMax;
var hut, house, mansion, hotel, resort, gym, tribute, nursery;
var getGym, getTribute, getNursery;
var notfiringMode;
var unumployed, trainer, explorer, farmer, lumber, miner, scientist, maxEmployed;
var getTrainer, getExplorer;
var equipment, upgrade;
var upgradeList = ['Miners', 'Scientists', 'Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Speedexplorer', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm', 'Gigastation', 'Potency', 'Magmamancers', 'Gymystic'];
if (buyShieldblock)
    upgradeList.push('Shieldblock');
var equipmentList = ['Dagadder', 'Megamace', 'Polierarm', 'Axeidic', 'Greatersword', 'Bootboost', 'Hellishmet', 'Pantastic', 'Smoldershoulder', 'Bestplate', 'Harmbalest', 'GambesOP'];
if (buySupershield)
    equipmentList.push('Supershield');
var battleLocation, equipmentUpgradeAvailable;

// Create UI
createUI();

function activateToM() {

    if (!ToMactivated && !ToMsettingsOpened){
        $("#ToMsettings").dialog("open");
        ToMsettingsOpened = true;
    }
    else if (!ToMactivated && ToMsettingsOpened){
        $("#ToMsettings").dialog("close");
        ToMsettingsOpened = false;
        moduleJob = document.getElementById('jobsCheck').checked;
        moduleUpgrade = document.getElementById('upgradesCheck').checked;
        moduleEquipment = document.getElementById('equipmentsCheck').checked;
        moduleStorage = document.getElementById('storagesCheck').checked;
        moduleStructure = document.getElementById('structuresCheck').checked;
        moduleMapForEquipment = document.getElementById('mapForEquipmentCheck').checked;
        debug("ToM activated");
        if (moduleJob)
            debug('--> Module jobs activated');
        if (moduleUpgrade)
            debug('--> Module upgrades activated');
        if (moduleEquipment)
            debug('--> Module equipments activated');
        if (moduleStorage)
            debug('--> Module storages activated');
        if (moduleStructure)
            debug('--> Module structures activated');
        if (moduleMapForEquipment)
            debug('--> Module mapForEquipment activated');
        ToMinterval = setInterval(mainLoop, runInterval);
        ToMactivated = true;
        ToMbutton.setAttribute("style", "font-size: 12px; font-weight: normal; position: relative; float:left; top: 0px; left: 0px; background-color: #00ee00");
    }
    else
    {
        debug("ToM unactivated");
        clearInterval(ToMinterval);
        ToMactivated = false;
        ToMbutton.setAttribute("style", "font-size: 12px; font-weight: normal; position: relative; float:left; top: 0px; left: 0px; background-color: #ee0000");
    }
}

function mainLoop() {
    
    // STORAGES
    getRessources();
    if (foodOwned / foodMax > buyStorageThreshold && moduleStorage){
        debug('Buy Barn');
        buyBuilding('Barn', true, true);
    }
    if (woodOwned / woodMax > buyStorageThreshold && moduleStorage){
        debug('Buy Shed');
        buyBuilding('Shed', true, true);
    }
    if (metalOwned / metalMax > buyStorageThreshold && moduleStorage){
        debug('Buy Forge');
        buyBuilding('Forge', true, true);
    }

    // STRUCTURES
    if (moduleStructure){
        getRessources();
        getStructures();
        
        getGym = !!document.getElementById("Gym") && (400 * Math.pow(1.185, gym) < gymBuyThreshold * woodOwned);
        if (getGym){
            debug('Buy Gym structure');
            buyBuilding('Gym', true, true);
        }

        getTribute = !!document.getElementById("Tribute") && (10000 * Math.pow(1.05, tribute) < tributeBuyThreshold * foodOwned);
        if (getTribute){
            debug('Buy Tribute structure');
            buyBuilding('Tribute', true, true);
        }

        if (!!document.getElementById("Hotel") && moduleStructure){
            
        }
        else if (!!document.getElementById("Mansion" && moduleStructure)){
            
        }
        else if (!!document.getElementById("House" && moduleStructure)){
            
        }
        else {
            
        }
    }

    // JOBS
    getRessources();
    getJobs();
    notfiringMode = document.getElementById("fireBtn").classList.contains("fireBtnNotFiring");
    
    if (moduleJob && notfiringMode && unumployed)
    {
        getTrainer = !!document.getElementById("Trainer");
        getTrainer = getTrainer && (750 * Math.pow(1.1, trainer) < trainerBuyThreshold * foodOwned);
        getExplorer = !!document.getElementById("Explorer");
        getExplorer = getExplorer && (15000 * Math.pow(1.1, explorer) < explorerBuyThreshold * foodOwned);
        if (getTrainer) {
            buyJob("Trainer", true, true);
            debug("Buy Trainer job");
        }
        else if (getExplorer) {
            buyJob("Explorer", true, true);
            debug("Buy Explorer job");
        }
        else if (unumployed > Math.max(baseJobThreshold * maxEmployed, minBaseJobThreshold)){
            if (scientist / farmer < scientistRatio && scientist < maxScientist){
                buyJob("Scientist", true, true);
                debug("Buy Scientist job");
            }
            else if (miner / farmer < minerRatio){
                buyJob("Miner", true, true);
                debug("Buy Miner job");
            }
            else if (lumber / farmer < lumberRatio){
                buyJob("Lumberjack", true, true);
                debug("Buy Lumberjack job");
            }
            else{
                buyJob("Farmer", true, true);
                debug("Buy Farmer job");
            }
        }
    }
  
    // UPGRADES
    if (moduleUpgrade){
        for (var upgrade in upgradeList) {
            upgrade = upgradeList[upgrade];
            if (!!document.getElementById(upgrade) && document.getElementById(upgrade).classList.contains('thingColorCanAfford')){
                debug("Buy " + upgrade + " upgrade");
                buyUpgrade(upgrade, true, true);
            }
        }
    }

    // EQUIPMENTS
    if (moduleEquipment){
        for (var equipment in equipmentList) {
            equipment = equipmentList[equipment];
            if (!!document.getElementById(equipment) && document.getElementById(equipment).classList.contains('thingColorCanAfford')){
                debug("Buy " + equipment + " equipement");
                buyUpgrade(equipment, true, true);
            }
        }
    }

    // MAP FOR EQUIPMENT
    if (moduleMapForEquipment){
        getRessources();
        //get physical battle location: World or Maps
        if (document.getElementById('worldName').textContent.includes('Zone'))
            battleLocation = 'World';
        else
            battleLocation = 'Maps';

        // run top level map to get upgades if no maps bonus
        if (battleLocation == 'World' && document.getElementById('mapBonus').textContent.trim() == ''){
            debug('Create Map to get equipment upgrades');
            //createAndRunMap(9, 9, 9, 'Moutain', 0, 'Repeat for Items');
        }

        // detect if in world and upgrades are available. Then run -2 level map to farm for.
        equipmentUpgradeAvailable = false;
        for (var equipment in equipmentList) {
            equipment = equipmentList[equipment];
            if (!!document.getElementById(equipment)){
                equipmentUpgradeAvailable = true;
            }
        }
        if (battleLocation == 'World' && equipmentUpgradeAvailable){
            debug('Equipment upgrade available, create a map to farm');
            //createAndRunMap(9, 9, 9, 'Moutain', -3, 'Repeat Forever');
        }

        // detect all upgrades purchase and return to world
        if (battleLocation == 'Maps' && !equipmentUpgradeAvailable){
            debug('No more equipment upgrade available, go back to world');
            //repeatClicked();
        }
    }
}

function createAndRunMap(loot, size, diff, biome, level, repeatUntil){
    // document.getElementById('mapsBtnText').innerHTML; // Maps / World
    // mapsClicked(); // go to maps/world
    // document.getElementById('repeatBtn').classList.contains('btn-success'); // Repeat Map status true/false
    // repeatClicked(); // click on Repeat Map
    // repeatUntil : "Repeat Forever", "Repeat to 10", "Repeat for Any", "Repeat for Items"
    // toggleSetting('repeatUntil'); // change repeat option
    // document.getElementById('toggleexitTo').classList.contains('settingBtn0'); // 0 to Maps, 1 to World
    // toggleSetting('exitTo'); // change exit to option
    // buyMap(), runMap(), recycleMap(), incrementMapLevel(-1), incrementMapLevel(1)

    debug('Run ' + loot + '-' + size + '-' + diff + ' ' + biome + ' map with ' + repeatUntil);

    // Go to maps menu
    mapsClicked();

    // Set repeat map On
    if (!document.getElementById('repeatBtn').classList.contains('btn-success'))
        repeatClicked();

    // Create and run map to get equipement upgrades
    // Set map slider to max value and biome to Moutnain, buy Map, run Map
    document.getElementById('lootAdvMapsRange').value = loot; // 0-9
    document.getElementById('sizeAdvMapsRange').value = size; // 0-9
    document.getElementById('difficultyAdvMapsRange').value = diff; // 0-9
    document.getElementById('biomeAdvMapsSelect').value = biome; // Random, Moutain, Forest, Sea, Depth
    incrementMapLevel(level); // -N level from top level
    recycleMap();
    buyMap();
    runMap();

    // set repeat Item
    if (!(document.getElementById('togglerepeatUntil').innerHTML == repeatUntil))
        toggleSetting('repeatUntil');
    if (!(document.getElementById('togglerepeatUntil').innerHTML == repeatUntil))
        toggleSetting('repeatUntil');
    if (!(document.getElementById('togglerepeatUntil').innerHTML == repeatUntil))
        toggleSetting('repeatUntil');

    //set Exit to World
    if (document.getElementById('toggleexitTo').classList.contains('settingBtn0'))
        toggleSetting('exitTo');
}

function getRessources(){
    foodOwned = !!document.getElementById('foodOwned') ? parseFloat(document.getElementById('foodOwned').innerHTML) : 0;
    foodMax = !!document.getElementById('foodMax') ? parseFloat(document.getElementById('foodMax').innerHTML) : 1;
    woodOwned = !!document.getElementById('woodOwned') ? parseFloat(document.getElementById('woodOwned').innerHTML) : 0;
    woodMax = !!document.getElementById('woodMax') ? parseFloat(document.getElementById('woodMax').innerHTML) : 1;
    metalOwned = !!document.getElementById('metalOwned') ? parseFloat(document.getElementById('metalOwned').innerHTML) : 0;
    metalMax = !!document.getElementById('metalMax') ? parseFloat(document.getElementById('metalMax').innerHTML) : 1;
    scienceOwned = !!document.getElementById('scienceOwned') ? parseFloat(document.getElementById('scienceOwned').innerHTML) : 0;
    fragmentsOwned = !!document.getElementById('scienceOwned') ? parseFloat(document.getElementById('fragmentsOwned').innerHTML) : 0;
    gemsOwned = !!document.getElementById('gemsOwned') ? parseFloat(document.getElementById('gemsOwned').innerHTML) : 0;
    heliumOwned = !!document.getElementById('heliumOwned') ? parseFloat(document.getElementById('heliumOwned').innerHTML) : 0;
}

function getStructures(){
    hut = !!document.getElementById('HutOwned') ? parseInt(document.getElementById('HutOwned').innerHTML) : 0;
    house = !!document.getElementById('HouseOwned') ? parseInt(document.getElementById('HouseOwned').innerHTML) : 0;
    mansion = !!document.getElementById('MansionOwned') ? parseInt(document.getElementById('MansionOwned').innerHTML) : 0;
    hotel = !!document.getElementById('HotelOwned') ? parseInt(document.getElementById('HotelOwned').innerHTML) : 0;
    resort = !!document.getElementById('ResortOwned') ? parseInt(document.getElementById('ResortOwned').innerHTML) : 0;
    gateway = !!document.getElementById('GatewayOwned') ? parseInt(document.getElementById('GatewayOwned').innerHTML) : 0;
    gym = !!document.getElementById('GymOwned') ? parseInt(document.getElementById('GymOwned').innerHTML) : 0;
    tribute = !!document.getElementById('TributeOwned') ? parseInt(document.getElementById('TributeOwned').innerHTML) : 0;
    nursery = !!document.getElementById('NurseryOwned') ? parseInt(document.getElementById('NurseryOwned').innerHTML) : 0;
}

function getJobs(){
    unumployed = !!document.getElementById("jobsTitleUnemployed") ? parseInt(document.getElementById("jobsTitleUnemployed").innerHTML) : 0;
    trainer = !!document.getElementById("TrainerOwned") ? parseInt(document.getElementById("TrainerOwned").innerHTML) : 0;
    explorer = !!document.getElementById("ExplorerOwned") ? parseInt(document.getElementById("ExplorerOwned").innerHTML) : 0;
    farmer = !!document.getElementById("FarmerOwned") ? parseInt(document.getElementById("FarmerOwned").innerHTML) : 0;
    lumber = !!document.getElementById("LumberjackOwned") ? parseInt(document.getElementById("LumberjackOwned").innerHTML) : 0;
    miner = !!document.getElementById("MinerOwned") ? parseInt(document.getElementById("MinerOwned").innerHTML) : 0;
    scientist = !!document.getElementById("ScientistOwned") ? parseInt(document.getElementById("ScientistOwned").innerHTML) : 0;
    maxEmployed = !!document.getElementById("maxEmployed") ? parseInt(document.getElementById("maxEmployed").innerHTML) : 0;
}

function createUI(){
    // Create Trimp-o-Matic button
    ToMbutton = document.createElement("input");
    ToMbutton.type = "button";
    ToMbutton.value = "ToM";
    ToMbutton.onclick = activateToM;
    ToMbutton.setAttribute("style", "font-size: 12px; font-weight: normal; position: relative; float:left; top: 0px; left: 0px; background-color: #ee0000");
    document.getElementById("food").insertBefore(ToMbutton, document.getElementById("food").firstChild);

    // Create Test button
    testButton = document.createElement("input");
    testButton.type = "button";
    testButton.value = "Test";
    testButton.onclick = test;
    testButton.setAttribute("style", "font-size: 12px; font-weight: normal; position: relative; float:left; top: 0px; left: 0px; background-color: #0000ee");
    document.getElementById("food").insertBefore(testButton, document.getElementById("food").firstChild);

    // Dialog box for ToM settings
    $("head").append("<link href = 'https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css' rel = 'stylesheet'>");
    $("body").append($("<div/>", {"id": "ToMsettings", "title": "ToM settings", "style": "font: 12pt Courier New"}).append([
        $("<input>", {"type": "checkbox", "id": "storagesCheck", "checked": moduleStorage}), $("<label/>", {"for": "storagesCheck"}).append(" storage "), $("<br>"),
        $("<input>", {"type": "checkbox", "id": "structuresCheck", "checked": moduleStructure}), $("<label/>", {"for": "structuresCheck"}).append(" structures "), $("<br>"),
        $("<input>", {"type": "checkbox", "id": "jobsCheck", "checked": moduleJob}), $("<label/>", {"for": "jobsCheck"}).append(" jobs "), $("<br>"),
        $("<input>", {"type": "checkbox", "id": "equipmentsCheck", "checked": moduleEquipment}), $("<label/>", {"for": "equipmentsCheck"}).append(" equipments "), $("<br>"),
        $("<input>", {"type": "checkbox", "id": "upgradesCheck", "checked": moduleUpgrade}), $("<label/>", {"for": "upgradesCheck"}).append(" upgrades "), $("<br>"),
        $("<input>", {"type": "checkbox", "id": "mapForEquipmentCheck", "checked": moduleMapForEquipment}), $("<label/>", {"for": "mapForEquipmentCheck"}).append(" map for equipment "), $("<br>")
    ]));

    $(function() {
        $("#ToMsettings").dialog({
            autoOpen: false, 
            buttons: {'Ok': activateToM,
                'Cancel': function(event){$("#ToMsettings").dialog("close"); ToMsettingsOpened = false;}},
            width: 300
        });
    });
}

function debug(text){
    console.log(text);
}

// TEST UI
$("head").append("<link href = 'https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css' rel = 'stylesheet'>");
$("body").append(
    $("<div/>", {"id": "ToMsettingsTest", "title": "ToM settings", "style": "font: 12pt Courier New"}).append([
        $("<table/>").append([
            $("<td/>").append([
                $("<input>", {"type": "checkbox", "id": "storagesCheckTest", "checked": moduleStorage}),
                $("<label/>", {"for": "storagesCheckTest"}).append(" storage "),
                $("<br>"),
                $("<input>", {"type": "checkbox", "id": "structuresCheckTest", "checked": moduleStructure}),
                $("<label/>", {"for": "structuresCheckTest"}).append(" structures "),
                $("<br>"),
                $("<input>", {"type": "checkbox", "id": "jobsCheckTest", "checked": moduleJob}),
                $("<label/>", {"for": "jobsCheckTest"}).append(" jobs "),
                $("<br>"),
                $("<input>", {"type": "checkbox", "id": "equipmentsCheckTest", "checked": moduleEquipment}),
                $("<label/>", {"for": "equipmentsCheckTest"}).append(" equipments "),
                $("<br>"),
                $("<input>", {"type": "checkbox", "id": "upgradesCheckTest", "checked": moduleUpgrade}),
                $("<label/>", {"for": "upgradesCheckTest"}).append(" upgrades "),
                $("<br>"),
                $("<input>", {"type": "checkbox", "id": "mapForEquipmentCheckTest", "checked": moduleMapForEquipment}),
                $("<label/>", {"for": "mapForEquipmentCheckTest"}).append(" map for equipment "),
                $("<br>")
            ]),
            $("<td/>").append([
                $("<label/>").append("Lumber"),
                $("<input>", {"id": "lumberInput", "width": "20"}),
                $("<br>")
            ]),
        ])
    ])
);
$(function() {
    $("#ToMsettingsTest").dialog({
        autoOpen: false, 
        buttons: {'Ok': function(event){$("#ToMsettingsTest").dialog("close"); ToMsettingsOpened = false;},
            'Cancel': function(event){$("#ToMsettingsTest").dialog("close"); ToMsettingsOpened = false;}},
        width: 500
    });
});

function test(){
    debug('Test');
    $("#ToMsettingsTest").dialog("open");
}
