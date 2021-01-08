// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log('The color is green.');
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  chrome.contextMenus.create({"id": "mvc-add",
                                "title": "Add to MyVirtualCookbook",
                            }, ()=>{
      console.log("menu item created");
  });
  chrome.contextMenus.onClicked.addListener(()=>{
      alert("clicked");
  });
});

// check to make sure account hasn't been deleted (lol)
// generate menu options later so they're accurate

