// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});

function login(){
  let loginRequest = new Request("http://www.myvirtualcookbook.com/api/chapters",
      {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        headers: {
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': 'http://www.myvirtualcookbook.com/'
        }
      }
  );

  fetch(loginRequest)
      .then((response)=>{
        console.log(response);
        response.text().then((res)=>{console.log(res)});
      })
      .catch((err)=>{
        console.log(err);
      });

}

login();


let parent = chrome.contextMenus.create({"id": "mvc-add", "title": "Add to MyVirtualCookbook",}, ()=>{
  //console.log("menu item created");
});

// this should be a list of chapters from the cookbook
let child1 = chrome.contextMenus.create({"id": "beef", "title": "Beef", "parentId": parent})
let child2 = chrome.contextMenus.create({"id": "chicken", "title": "Chicken", "parentId": parent})
chrome.contextMenus.onClicked.addListener((event)=>{
  console.log(event);
  alert(event);
  alert("clicked2");
});

// check to make sure account hasn't been deleted (lol)
// generate menu options later so they're accurate

