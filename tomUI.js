$("head").append("<link href = 'https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css' rel = 'stylesheet'>");
$("body").append(
    $("<div/>", {"id": "ToMsettingsTest", "title": "ToM settings", "style": "font: 12pt Courier New"}).append([
        $("<table/>").append([
            $("<tr/>").append([
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
            $("<tr/>").append([
                $("<input>", {"id": "lumberInput"}),
                $("<label/>", {"for": "lumberInput"}).append("Lumber"),
                $("<br>")
            ]),
        ])
    ])
);
