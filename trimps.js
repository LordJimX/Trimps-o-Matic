// MODULES
var moduleJob = false;
var moduleUpgrade = true;
var moduleEquipment = true;
var moduleStorage = true;
var moduleHouse = true;

// STORAGE SETTINGS
var buyStorageThreshold = 0.8;

// JOB SETTINGS
var trainerBuyThreshold = 0.1; // cost of trainer / owned food
var explorerBuyThreshold = 0.1; // cost of explorer / owned food
var lumberRatio = 1; // for 1 farmer
var minerRatio = 1.3; // for 1 farmer
var scientistRatio = 0; // for 1 farmer
var baseJobThreshold = 5; // workers lept unumployed for high level jobs (trainer...)

// UPGRADE SETTINGS
var buyShieldblock = true;

// EQUPMENT SETTINGS
var buySupershield = false;

debug("Trimp-o-matic started");

var runInterval = 1000; //main loop interval
var ToMactivated = false;
var ToMinterval;

var foodOwned, woodOwned, metalOwned;
var foodBar, woodBar, metalBar;
var hut, house, mansion, hotel;
var notfiringMode, unumployed, trainer, explorer, farmer, lumber, miner, scientist;
var getTrainer, getExplorer;
var equipment, upgrade;
var upgradeList = ['Miners', 'Scientists', 'Coordination', 'Speedminer', 'Speedlumber', 'Speedfarming', 'Speedscience', 'Speedexplorer', 'Megaminer', 'Megalumber', 'Megafarming', 'Megascience', 'Efficiency', 'TrainTacular', 'Trainers', 'Explorers', 'Blockmaster', 'Battle', 'Bloodlust', 'Bounty', 'Egg', 'Anger', 'Formations', 'Dominance', 'Barrier', 'UberHut', 'UberHouse', 'UberMansion', 'UberHotel', 'UberResort', 'Trapstorm', 'Gigastation', 'Potency', 'Magmamancers'];
if (buyShieldblock)
    upgradeList.push('Shieldblock');
var equipmentList = ['Dagadder', 'Megamace', 'Polierarm', 'Axeidic', 'Greatersword', 'Bootboost', 'Hellishmet', 'Pantastic', 'Smoldershoulder', 'Bestplate', 'Harmbalest', 'GambesOP', 'Gymystic'];
if (buySupershield)
    equipmentList.push('Supershield');

// Create Trimp-o-Matic
var ToMbutton = document.createElement("input");
ToMbutton.type = "button";
ToMbutton.value = "ToM";
ToMbutton.onclick = activateToM;
ToMbutton.setAttribute("style", "font-size: 12px; font-weight: normal; position: relative; float:left; top: 0px; left: 0px; background-color: #ee0000");
document.getElementById("food").insertBefore(ToMbutton, document.getElementById("food").firstChild);


function activateToM() {
    if (!ToMactivated){
        debug("ToM activated");
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

    // RESSOURCES
    foodOwned = parseFloat(document.getElementById('foodOwned').innerHTML);
    woodOwned = parseFloat(document.getElementById('woodOwned').innerHTML);
    metalOwned = parseFloat(document.getElementById('metalOwned').innerHTML);
    foodMax = parseFloat(document.getElementById('foodMax').innerHTML);
    woodMax = parseFloat(document.getElementById('woodMax').innerHTML);
    metalMax = parseFloat(document.getElementById('metalMax').innerHTML);
    
    // STORAGES
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

    // HOUSES
    hut = parseInt(document.getElementById('HutOwned').innerHTML);
    house = parseInt(document.getElementById('HouseOwned').innerHTML);
    mansion = parseInt(document.getElementById('MansionOwned').innerHTML);
    hotel = parseInt(document.getElementById('HotelOwned').innerHTML);

    if (!!document.getElementById("Hotel") && moduleHouse){
        
    }
    else if (!!document.getElementById("Mansion" && moduleHouse)){
        
    }
    else if (!!document.getElementById("House" && moduleHouse)){
        
    }
    else {
        
    }

    // JOBS
    notfiringMode = document.getElementById("fireBtn").classList.contains("fireBtnNotFiring");
    unumployed = parseInt(document.getElementById("jobsTitleUnemployed").innerHTML);
    trainer = parseInt(document.getElementById("TrainerOwned").innerHTML);
    farmer = parseInt(document.getElementById("FarmerOwned").innerHTML);
    lumber = parseInt(document.getElementById("LumberjackOwned").innerHTML);
    miner = parseInt(document.getElementById("MinerOwned").innerHTML);
    scientist = parseInt(document.getElementById("ScientistOwned").innerHTML);
    if (moduleJob && notfiringMode && unumployed)
    {
        getTrainer = !!document.getElementById("Trainer") && document.getElementById("Trainer").classList.contains('thingColorCanAfford');
        getTrainer = getTrainer && (750 * Math.pow(1.1, trainer) < trainerBuyThreshold * foodOwned);
        getExplorer = !!document.getElementById("Explorer") && document.getElementById("Explorer").classList.contains('thingColorCanAfford');
        getExplorer = getExplorer && (15000 * Math.pow(1.1, explorer) < explorerBuyThreshold * foodOwned);
        if (getTrainer) {
            buyJob("Trainer", true, true);
            debug("Buy Trainer job");
        }
        else if (getExplorer) {
            buyJob("Explorer", true, true);
            debug("Buy Explorer job");
        }
        else if (unumployed > baseJobThreshold){
            if (scientist / farmer < scientistRatio){
                buyJob("Scientific", true, true);
                debug("Buy Scientific job");
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
                //document.getElementById("Farmer").click();
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
}

function debug(text){
    console.log(text);
}