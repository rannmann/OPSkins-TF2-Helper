// ==UserScript==
// @name         OPSkins TF2 Helper
// @version      0.2
// @description  Adds "usable by" class name to some TF2 items.  TF:GO-style items are essentially ignored.
// @author       Jake "rannmann" Forrester
// @match        https://opskins.com/*440_2*
// @match        https://opskins.com/*shop_view_item*
// @resource     tf2schema https://raw.githubusercontent.com/SteamDatabase/SteamTracking/master/ItemSchema/TeamFortress2.json
// @grant        GM_getResourceText
// ==/UserScript==

(function() {
    'use strict';
    var tf2Schema = {};
    var wearables = {};

    // Do we have a cache of our map?
    if (localStorage.hasOwnProperty('tf2CosmeticMap')) {
        console.log("Found cached TF2 cosmetic map");
        wearables = JSON.parse(localStorage.tf2CosmeticMap);
        // if the cache is older than a day
        if (wearables.hasOwnProperty('lastUpdatedTimestamp') && wearables.lastUpdatedTimestamp + 86400 * 1000 < Date.now()) {
            // reload it bruh.
            wearables = {};
            console.log("TF2 cosmetic map is too old, so we'll rebuild it.");
        }
    }

    // Do we have a /valid/ & up-to-date cache of our map?
    if (!wearables.hasOwnProperty('lastUpdatedTimestamp')) {
        wearables.lastUpdatedTimestamp = Date.now();
        tf2Schema = JSON.parse(GM_getResourceText('tf2schema'));

        // Filter the schema down to just wearable items
        tf2Schema.result.items.forEach(function (item, index) {
            //if (item.item_class === "tf_wearable") {
                if (item.hasOwnProperty('used_by_classes')) {
                    wearables[item.item_name] = item.used_by_classes;
                } else {
                    wearables[item.item_name] = -1;
                }
            //}
        });

        // Save in local storage
        localStorage.tf2CosmeticMap = JSON.stringify(wearables);
        console.log("Saved TF2 cosmetic map");
    }

    function applyToPage() {
        // For every item on the page that we haven't already seen
        $('.app_440_2 .market-link:not(.tf2ized)').each(function() {
            // We'll loop over each of these until there are no more results, because TF2 has such prefixes as:
            // "Strange Unusual Festive Professional Killstreak Brick House Minigun"
            var badPrefixes = [
                'The',
                'Vintage',
                'Strange',
                'Unusual',
                'Genuine',
                'Haunted',
                'Collector\'s',
                'Killstreak',
                'Specialized Killstreak',
                'Professional Killstreak',
                'Festive' // Not really a prefix in some cases (only festivized weapons use it as a prefix), but "Festive Shotgun" will have the same restrictions as "Shotgun"
            ];

            // Mark it as scanned
            $(this).addClass('tf2ized');

            // Trim down all the items on the page to just their market names.
            var mn = $(this).contents().filter(function(){
                return this.nodeType == 3;
            })[0].textContent.trim();

            // Remove all prefixes so we can find it in the schema
            var found = true;
            while(found) {
                found = false;
                var i = 0;
                while (i < badPrefixes.length) {
                    var re = new RegExp("^" + badPrefixes[i] + " ");
                    if (re.test(mn)) {
                        // Valve decided to put "Vintage" in the actual name of an item, not as a quality... smart thinking.
                        if (mn == "Vintage Merryweather") {
                            i++;
                            continue;
                        }
                        // A match was found.  Remove the string, remove the test case, and start over to look for other prefixes.
                        console.log("Replacing " + badPrefixes[i] + " with '' in " + mn);
                        mn = mn.replace(re, "");
                        found = true;
                        badPrefixes.splice(i, 1);
                        break;
                    } else {
                        i++;
                    }
                }
            }

            if (wearables.hasOwnProperty(mn)) {
                // Append classes to item
                var str = '';
                if (wearables[mn] === -1) {
                    str = 'All';
                } else {
                    str = wearables[mn].join(', ');
                }
                $(this).parent().find('small.item-warning').append(' ' + str);
            }
        });
    }

    // Initial load
    applyToPage();

    // Anytime we scroll
    $('#scroll').bind("DOMSubtreeModified", function() {
        // Wait 100ms otherwise javascript goes nuts and and renders as the divs load, repeating itself and resulting in: "PyroPyroPyroPyro"
        setTimeout(applyToPage, 100);
    });

})();
