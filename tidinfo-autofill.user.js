// ==UserScript==
// @name         tidinfo-autofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Räksallad
// @author       Snigeln & Räkan
// @match        https://tidinfo.got.volvo.net/RestClientWEB/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=volvo.net
// @grant        none
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    waitForKeyElements (
        "#k-grid0-r2c1",
        add_save_approve_button
    );

    function add_save_approve_button() {
        if (document.getElementsByClassName("save-approve-button").length === 0) {
            console.log("Adding buttons");

            let buttonHtml = '<kendo-toolbar-renderer style="visibility: visible; display: inline-block;" class="ng-star-inserted"><button type="button" kendobutton="" tabindex="-1" class="save-approve-button k-button k-bare k-button-icontext ng-star-inserted" role="button" aria-disabled="false" dir="ltr" style="background-color: rgb(255, 255, 255); padding: 0px 10px;"><span class="k-icon k-i-heart ng-star-inserted" role="presentation"></span> Jag var här </button></kendo-toolbar-renderer>'
            let separatorHtml = '<kendo-toolbar-renderer class="ng-star-inserted" style="visibility: visible; display: inline-block;"><div class="k-separator ng-star-inserted"></div></kendo-toolbar-renderer>'

            let toolbars = document.getElementsByClassName("app-toolbar-section");

            toolbars[0].insertBefore(html_to_element(separatorHtml), toolbars[0].children[2]);
            toolbars[0].insertBefore(html_to_element(buttonHtml), toolbars[0].children[2]);
            toolbars[1].insertBefore(html_to_element(separatorHtml), toolbars[1].children[0]);
            toolbars[1].insertBefore(html_to_element(buttonHtml), toolbars[1].children[0]);

            let buttons = document.getElementsByClassName("save-approve-button");
            for (let b of buttons) {
                b.addEventListener("click", save_and_approve, false)
            }
        } else {
            console.log("Buttons added - skipping");
        }
    }

    function save_and_approve() {
        console.log("Filling...");
        fill_week();
        console.log("Saving...");
        let saveButtons = document.getElementsByClassName("k-i-save");
        saveButtons[0].parentElement.click();

        console.log("Waiting...");

        setTimeout(() => {
            console.log("Approving...");
            let approveButtons = document.getElementsByClassName("k-i-check-circle");
            approveButtons[0].parentElement.click();
        }, 2000);
    }

    function html_to_element(html) {
        let template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    function fill_week() {
        for (let dayNumber = 1; dayNumber <= 5; dayNumber++) {
            fill_day(dayNumber, "0800", "1642");
        }
    }

    function fill_day(dayNumber, start, end) {
        console.log("Setting day: " + dayNumber);
        let inputPair = document.getElementById('k-grid0-r2c' + dayNumber).firstElementChild.firstElementChild;
        inputPair.firstElementChild.value = start;
        inputPair.lastElementChild.value = end;
        triggerEvent("input", inputPair.firstElementChild);
        triggerEvent("input", inputPair.lastElementChild);
    }

    function triggerEvent(e, s){
        "use strict";
        var event = document.createEvent('HTMLEvents');
        event.initEvent(e, true, true);
        s.dispatchEvent(event);
    }
})();