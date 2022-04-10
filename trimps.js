// MODULES
var moduleJob = true;
var moduleUpgrade = true;
var moduleEquipment = true;
var moduleStorage = true;
var moduleHouse = true;

// STORAGE SETTINGS
var buyStorageThreshold = 0.9;

// JOB SETTINGS
var lumberRatio = 1; // for 1 farmer
var minerRatio = 1; // for 1 farmer
var scientistRatio = 0; // for 1 farmer
var baseJobThreshold = 2; // workers lept unumployed for high level jobs (trainer...)

// UPGRADE SETTINGS
var buyShieldblock = true;

// EQUPMENT SETTINGS
var buySupershield = false;

debug("Trimp-o-matic started");

var runInterval = 1000;      //How often to loop through logic
var ToMactivated = false;
var ToMinterval;

var foodOwned, foodMax, woodOwned, woodMax, metalOwned, metalMax;
var notfiringMode, unumployed, farmer, lumber, miner, scientist;
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
    debug("Start main loop");
    
    // Storages
    foodOwned = document.getElementById('foodOwned');
    foodMax = document.getElementById('foodMax');
    woodOwned = document.getElementById('woodOwned');
    woodMax = document.getElementById('woodMax');
    metalOwned = document.getElementById('metalOwned');
    metalMax = document.getElementById('metalMax');
    if (foodOwned / foodMax > buyStorageThreshold){
        debug('Buy Barn');
        document.getElementById('barn').click()
    }
    if (woodOwned / woodMax > buyStorageThreshold){
        debug('Buy Shed');
        document.getElementById('shed').click()
    }
    if (metalOwned / metalMax > buyStorageThreshold){
        debug('Buy Forge');
        document.getElementById('forge').click()
    }

    // Jobs
    notfiringMode = document.getElementById("fireBtn").classList.contains("fireBtnNotFiring")
    unumployed = parseInt(document.getElementById("jobsTitleUnemployed").innerHTML);
    if (moduleJob && notfiringMode && unumployed)
    {
        if (!!document.getElementById("Trainer") && document.getElementById("Trainer").classList.contains('thingColorCanAfford'))
        {
            document.getElementById("Trainer").click();
            debug("Buy Trainer job");
        }
        else if (unumployed > baseJobThreshold){
            farmer = parseInt(document.getElementById("FarmerOwned").innerHTML);
            lumber = parseInt(document.getElementById("LumberjackOwned").innerHTML);
            miner = parseInt(document.getElementById("MinerOwned").innerHTML);
            scientist = parseInt(document.getElementById("ScientistOwned").innerHTML);
            if (scientist / farmer < scientistRatio){
                document.getElementById("Scientific").click();
                debug("Buy Scientific job");
            }
            else if (lumber / farmer < lumberRatio){
                document.getElementById("Lumberjack").click();
                debug("Buy Lumberjack job");
            }
            else if (miner / farmer < minerRatio){
                document.getElementById("Miner").click();
                debug("Buy Miner job");
            }
            else{
                document.getElementById("Farmer").click();
                debug("Buy Farmer job");
            }
        }
    }
  
    // Upgrades
    if (moduleUpgrade){
        for (var upgrade in upgradeList) {
            upgrade = upgradeList[upgrade];
            if (!!document.getElementById(upgrade) && document.getElementById(upgrade).classList.contains('thingColorCanAfford')){
                debug("Buy " + upgrade + " upgrade");
                document.getElementById(upgrade).click();
            }
        }
    }

    // Equipments
    if (moduleEquipment){
        for (var equipment in equipmentList) {
            equipment = equipmentList[equipment];
            if (!!document.getElementById(equipment) && document.getElementById(equipment).classList.contains('thingColorCanAfford')){
                debug("Buy " + equipment + " equipement");
                document.getElementById(equipment).click();
            }
        }
    }
}

function debug(text){
    console.log(text);
}