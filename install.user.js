// ==UserScript==
// @name     Trimps-o-matic
// @version  1
// @grant    none
// @include  https://trimps.github.io/
// @run-at   document-idle
// ==/UserScript==

var script = document.createElement('script');
script.id = 'Trimps-o-Matic-script';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://cdn.rawgit.com/gdupeux/Trimps-o-Matic/main/trimps.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);