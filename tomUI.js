$("head").append("<link href = 'https://code.jquery.com/ui/1.12.1/themes/ui-lightness/jquery-ui.css' rel = 'stylesheet'>");
$("body").append(
    $("<div/>", {"id": "ToMsettingsTest", "title": "ToM settings", "style": "font: 12pt Courier New"}).append([
        $("<table/>").append([
            $("<tr/>", {"width": "150"}).append([
                $("<td/>").append([
                    $("<input>", {"type": "checkbox", "id": "storagesCheckTest", "checked": moduleStorage}),
                    $("<label/>", {"for": "storagesCheckTest"}).append(" storage ")
                ]),
                $("<td/>").append([
                    $("<label/>").append("rate to buy "),
                    $("<input>", {"id": "storageRateInput", "width": "40", "value": buyStorageThreshold})
                ])
            ]),
            $("<tr/>").append([
                $("<td/>").append([
                    $("<input>", {"type": "checkbox", "id": "structuresCheckTest", "checked": moduleStructure}),
                    $("<label/>", {"for": "structuresCheckTest"}).append(" structures "),
                ]),
                $("<td/>").append([
                    $("<label/>").append("F / L / M / S "),
                    $("<input>", {"id": "farmInput", "width": "40", "value": "1"}),
                    $("<input>", {"id": "lumberInput", "width": "40", "value": lumberRatio}),
                    $("<input>", {"id": "minerInput", "width": "40", "value": minerRatio}),
                    $("<input>", {"id": "scientistInput", "width": "40", "value": scientistRatio})
                    $("<label/>").append("Max S"),
                    $("<input>", {"id": "maxScientistInput", "width": "40", "value": maxScientist}),
                    $("<br>"),
                    $("<label/>").append("Trainer thld"),
                    $("<input>", {"id": "trainerThresholdInput", "width": "40", "value": trainerBuyThreshold}),
                    $("<label/>").append("Explorer thld"),
                    $("<input>", {"id": "explorerThresholdInput", "width": "40", "value": explorerBuyThreshold})
                ])
            ]),
            $("<tr/>").append([
                $("<td/>").append([
                    $("<input>", {"type": "checkbox", "id": "jobsCheckTest", "checked": moduleJob}),
                    $("<label/>", {"for": "jobsCheckTest"}).append(" jobs "),
                ]),
                $("<td/>").append([

                ])
            ]),
            $("<tr/>").append([
                $("<td/>").append([
                    $("<input>", {"type": "checkbox", "id": "equipmentsCheckTest", "checked": moduleEquipment}),
                    $("<label/>", {"for": "equipmentsCheckTest"}).append(" equipments "),
                ]),
                $("<td/>").append([

                ])
            ]),
            $("<tr/>").append([
                $("<td/>").append([
                    $("<input>", {"type": "checkbox", "id": "upgradesCheckTest", "checked": moduleUpgrade}),
                    $("<label/>", {"for": "upgradesCheckTest"}).append(" upgrades "),
                ]),
                $("<td/>").append([

                ])
            ]),
            $("<tr/>").append([
                $("<td/>").append([
                    $("<input>", {"type": "checkbox", "id": "mapForEquipmentCheckTest", "checked": moduleMapForEquipment}),
                    $("<label/>", {"for": "mapForEquipmentCheckTest"}).append(" map 4 eqpt "),
                ]),
                $("<td/>").append([

                ])
            ])
        ]) // table append
    ]) // div append
); // body append