// ==UserScript==
// @name         OPSkins TF2 Helper
// @version      0.4
// @description  Adds "usable by" class name to some TF2 items, and informational hover text over effects.  TF:GO-style items are essentially ignored.
// @author       Jake "rannmann" Forrester
// @match        https://opskins.com/*440_2*
// @match        https://opskins.com/*shop_view_item*
// @resource     tf2schema https://raw.githubusercontent.com/SteamDatabase/SteamTracking/master/ItemSchema/TeamFortress2.json
// @grant        GM_getResourceText
// ==/UserScript==


/**
Effects Loader from: https://backpack.tf/effects
Paste the following into the dev console and replace the effects variable if you want to update it.

    var count = $('li.item').length;
    var effect = {};
    $('li.item').each(function(i) {
        effect[$(this).data('effect_name')] = {
            key_price: Math.round($(this).data('price') * Session.rawCurrency.value * 100) / 100,
            rank: i+1,
            rank_pct: Math.round( 1000*(i+1)/count ) / 10,
            exist:  $(this).data('exist')
        };
    });
    console.log( '    var effects = ' + JSON.stringify(effect) + ';' );
*/

(function() {
    'use strict';
    var tf2Schema = {};
    var wearables = {};

    // See commented script above as to where this comes from.
    var effects = {"Nebula":{"key_price":823.1,"rank":1,"rank_pct":1,"exist":238},"Burning Flames":{"key_price":650.91,"rank":2,"rank_pct":1.9,"exist":3431},"Scorching Flames":{"key_price":498.53,"rank":3,"rank_pct":2.9,"exist":3450},"It's A Secret To Everybody":{"key_price":478.03,"rank":4,"rank_pct":3.8,"exist":456},"Haunted Phantasm":{"key_price":449.21,"rank":5,"rank_pct":4.8,"exist":149},"Spellbound":{"key_price":437.18,"rank":6,"rank_pct":5.7,"exist":364},"Harvest Moon":{"key_price":431.39,"rank":7,"rank_pct":6.7,"exist":435},"Sunbeams":{"key_price":410.38,"rank":8,"rank_pct":7.6,"exist":3391},"Ghastly Ghosts":{"key_price":391.7,"rank":9,"rank_pct":8.6,"exist":170},"Abduction":{"key_price":390.01,"rank":10,"rank_pct":9.5,"exist":230},"Arcana":{"key_price":373.69,"rank":11,"rank_pct":10.5,"exist":341},"Cloudy Moon":{"key_price":346.56,"rank":12,"rank_pct":11.4,"exist":889},"Poisoned Shadows":{"key_price":323.13,"rank":13,"rank_pct":12.4,"exist":336},"Bonzo The All-Gnawing":{"key_price":317.48,"rank":14,"rank_pct":13.3,"exist":297},"Knifestorm":{"key_price":316.48,"rank":15,"rank_pct":14.3,"exist":448},"Stormy 13th Hour":{"key_price":313.62,"rank":16,"rank_pct":15.2,"exist":454},"Anti-Freeze":{"key_price":311.13,"rank":17,"rank_pct":16.2,"exist":619},"Darkblaze":{"key_price":310.53,"rank":18,"rank_pct":17.1,"exist":352},"Misty Skull":{"key_price":308.08,"rank":19,"rank_pct":18.1,"exist":450},"Hellfire":{"key_price":295.9,"rank":20,"rank_pct":19,"exist":348},"Chiroptera Venenata":{"key_price":287.44,"rank":21,"rank_pct":20,"exist":341},"Roboactive":{"key_price":286.79,"rank":22,"rank_pct":21,"exist":624},"Energy Orb":{"key_price":277.92,"rank":23,"rank_pct":21.9,"exist":974},"Demonflame":{"key_price":270.76,"rank":24,"rank_pct":22.9,"exist":385},"Atomic":{"key_price":258.75,"rank":25,"rank_pct":23.8,"exist":239},"Purple Energy":{"key_price":246.23,"rank":26,"rank_pct":24.8,"exist":3440},"Death by Disco":{"key_price":244.96,"rank":27,"rank_pct":25.7,"exist":158},"Ether Trail":{"key_price":238.17,"rank":28,"rank_pct":26.7,"exist":140},"Green Energy":{"key_price":232.27,"rank":29,"rank_pct":27.6,"exist":3312},"Something Burning This Way Comes":{"key_price":227.82,"rank":30,"rank_pct":28.6,"exist":348},"Holy Grail":{"key_price":221.58,"rank":31,"rank_pct":29.5,"exist":933},"Death at Dusk":{"key_price":216.65,"rank":32,"rank_pct":30.5,"exist":969},"Frostbite":{"key_price":211.94,"rank":33,"rank_pct":31.4,"exist":956},"Subatomic":{"key_price":210.8,"rank":34,"rank_pct":32.4,"exist":215},"Ancient Codex":{"key_price":208.37,"rank":35,"rank_pct":33.3,"exist":184},"Cool":{"key_price":200.92,"rank":36,"rank_pct":34.3,"exist":1793},"Nether Trail":{"key_price":196.66,"rank":37,"rank_pct":35.2,"exist":167},"Fountain of Delight":{"key_price":196.4,"rank":38,"rank_pct":36.2,"exist":986},"Morning Glory":{"key_price":195.77,"rank":39,"rank_pct":37.1,"exist":1027},"Screaming Tiger":{"key_price":194.24,"rank":40,"rank_pct":38.1,"exist":981},"Time Warp":{"key_price":190.73,"rank":41,"rank_pct":39,"exist":624},"Voltaic Hat Protector":{"key_price":184.14,"rank":42,"rank_pct":40,"exist":197},"Green Black Hole":{"key_price":182.4,"rank":43,"rank_pct":41,"exist":628},"Magnetic Hat Protector":{"key_price":181.64,"rank":44,"rank_pct":41.9,"exist":219},"Circling Heart":{"key_price":180.91,"rank":45,"rank_pct":42.9,"exist":3228},"Showstopper":{"key_price":180.21,"rank":46,"rank_pct":43.8,"exist":933},"Amaranthine":{"key_price":178.31,"rank":47,"rank_pct":44.8,"exist":274},"Ghastly Ghosts Jr":{"key_price":176.47,"rank":48,"rank_pct":45.7,"exist":273},"The Ooze":{"key_price":172.93,"rank":49,"rank_pct":46.7,"exist":316},"Electric Hat Protector":{"key_price":171.99,"rank":50,"rank_pct":47.6,"exist":204},"Haunted Ghosts":{"key_price":167.34,"rank":51,"rank_pct":48.6,"exist":3370},"Eldritch Flame":{"key_price":167.3,"rank":52,"rank_pct":49.5,"exist":143},"Sulphurous":{"key_price":167.05,"rank":53,"rank_pct":50.5,"exist":657},"Ancient Eldritch":{"key_price":166.83,"rank":54,"rank_pct":51.4,"exist":159},"Cauldron Bubbles":{"key_price":165.61,"rank":55,"rank_pct":52.4,"exist":804},"Stare From Beyond":{"key_price":160.84,"rank":56,"rank_pct":53.3,"exist":296},"It's a mystery to everyone":{"key_price":157.36,"rank":57,"rank_pct":54.3,"exist":141},"Haunted Phantasm Jr":{"key_price":156.99,"rank":58,"rank_pct":55.2,"exist":282},"Phosphorous":{"key_price":145.38,"rank":59,"rank_pct":56.2,"exist":662},"It's a puzzle to me":{"key_price":145.37,"rank":60,"rank_pct":57.1,"exist":142},"Isotope":{"key_price":143.63,"rank":61,"rank_pct":58.1,"exist":1847},"Flaming Lantern":{"key_price":136.96,"rank":62,"rank_pct":59,"exist":797},"Hot":{"key_price":131.55,"rank":63,"rank_pct":60,"exist":1813},"Vivid Plasma":{"key_price":128.22,"rank":64,"rank_pct":61,"exist":3317},"Tesla Coil":{"key_price":126.86,"rank":65,"rank_pct":61.9,"exist":1817},"'72":{"key_price":125.23,"rank":66,"rank_pct":62.9,"exist":892},"Molten Mallard":{"key_price":124.61,"rank":67,"rank_pct":63.8,"exist":940},"Galactic Codex":{"key_price":115.79,"rank":68,"rank_pct":64.8,"exist":185},"Mega Strike":{"key_price":113.51,"rank":69,"rank_pct":65.7,"exist":798},"Searing Plasma":{"key_price":109.49,"rank":70,"rank_pct":66.7,"exist":3215},"Eerie Orbiting Fire":{"key_price":109.17,"rank":71,"rank_pct":67.6,"exist":817},"Infernal Flames":{"key_price":105.39,"rank":72,"rank_pct":68.6,"exist":985},"Skill Gotten Gains":{"key_price":104.99,"rank":73,"rank_pct":69.5,"exist":873},"Starstorm Insomnia":{"key_price":101.44,"rank":74,"rank_pct":70.5,"exist":1770},"Infernal Smoke":{"key_price":101.2,"rank":75,"rank_pct":71.4,"exist":999},"Starstorm Slumber":{"key_price":100.22,"rank":76,"rank_pct":72.4,"exist":1761},"Power Surge":{"key_price":95.13,"rank":77,"rank_pct":73.3,"exist":590},"Circling Peace Sign":{"key_price":94.74,"rank":78,"rank_pct":74.3,"exist":3210},"Spectral Swirl":{"key_price":94.13,"rank":79,"rank_pct":75.2,"exist":1047},"Hellish Inferno":{"key_price":93.78,"rank":80,"rank_pct":76.2,"exist":959},"Disco Beat Down":{"key_price":93.16,"rank":81,"rank_pct":77.1,"exist":5680},"Cloud 9":{"key_price":90.3,"rank":82,"rank_pct":78.1,"exist":5566},"Electrostatic":{"key_price":88.99,"rank":83,"rank_pct":79,"exist":623},"Circling TF Logo":{"key_price":86.45,"rank":84,"rank_pct":80,"exist":3108},"Silver Cyclone":{"key_price":85.53,"rank":85,"rank_pct":81,"exist":767},"Purple Confetti":{"key_price":82.83,"rank":86,"rank_pct":81.9,"exist":3163},"Neutron Star":{"key_price":82.77,"rank":87,"rank_pct":82.9,"exist":1674},"Blizzardy Storm":{"key_price":81.18,"rank":88,"rank_pct":83.8,"exist":7903},"Midnight Whirlwind":{"key_price":80.19,"rank":89,"rank_pct":84.8,"exist":822},"Stormy Storm":{"key_price":74.89,"rank":90,"rank_pct":85.7,"exist":7728},"Green Confetti":{"key_price":71.66,"rank":91,"rank_pct":86.7,"exist":3182},"Memory Leak":{"key_price":68.42,"rank":92,"rank_pct":87.6,"exist":650},"Miami Nights":{"key_price":65.79,"rank":93,"rank_pct":88.6,"exist":5492},"Orbiting Fire":{"key_price":61.66,"rank":94,"rank_pct":89.5,"exist":7596},"Terror-Watt":{"key_price":61.29,"rank":95,"rank_pct":90.5,"exist":5319},"Massed Flies":{"key_price":60.97,"rank":96,"rank_pct":91.4,"exist":2997},"Overclocked":{"key_price":58.17,"rank":97,"rank_pct":92.4,"exist":574},"Kill-a-Watt":{"key_price":57.52,"rank":98,"rank_pct":93.3,"exist":5300},"Smoking":{"key_price":56.3,"rank":99,"rank_pct":94.3,"exist":7667},"Steaming":{"key_price":49.15,"rank":100,"rank_pct":95.2,"exist":7366},"Bubbling":{"key_price":48.55,"rank":101,"rank_pct":96.2,"exist":7313},"Orbiting Planets":{"key_price":46.62,"rank":102,"rank_pct":97.1,"exist":7350},"Dead Presidents":{"key_price":45.13,"rank":103,"rank_pct":98.1,"exist":5061},"Aces High":{"key_price":42.68,"rank":104,"rank_pct":99,"exist":5186},"Nuts n' Bolts":{"key_price":39.6,"rank":105,"rank_pct":100,"exist":6392}};

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
                // Append tf2 classes to item
                var str = '';
                if (wearables[mn] === -1) {
                    str = 'All';
                } else {
                    str = wearables[mn].join(', ');
                }
                $(this).parent().find('small.item-warning').append(' ' + str);
            }

            // Add mouseover text to effects
            var desc = $(this).parent().find('.item-desc').find('small:nth-of-type(2)').html();
            var effect = null;

            if (desc) {
                effect = desc.substring(desc.indexOf("Effect:") + 8).trim();
                if (effect && effects.hasOwnProperty(effect)) {
                    $(this).parent().find('.item-desc').find('small:nth-of-type(2)').prop('title', 'Effect Ranked ' + effects[effect].rank + ' (top ' + effects[effect].rank_pct + '%) average value at ' + effects[effect].key_price + ' keys').css('cursor', 'pointer');
                    if (effects[effect].rank < 40) {
                        $(this).parent().parent().css('background', '#2f2d12');
                    }
                    if (effects[effect].rank < 20) {
                        $(this).parent().parent().css('background', '#2f1212');
                    }
                }
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
