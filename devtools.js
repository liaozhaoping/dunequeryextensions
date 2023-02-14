chrome.tabs.query({active: true}, function (tab) {
    const currentTab = tab[0]
    if (currentTab.url.includes("dune.com")) {
        chrome.devtools.panels.create("Dune result saver", "panel.png", "dune_saver_panel.html", function (panel){})
    }
})

chrome.devtools.network.onRequestFinished.addListener(function (request) {
    if (request.request.url === "https://app-api.dune.com/v1/graphql") {
        request.getContent(function(content) {
            const parsedContent = JSON.parse(content)
            if (parsedContent
                && parsedContent.data
                && parsedContent.data.get_execution
                && parsedContent.data.get_execution.execution_succeeded
            ) {
                // chrome.devtools.inspectedWindow.eval(
                //     'console.log("Content: " + unescape("' +
                //     escape(JSON.stringify(parsedContent.data)) + '"))');
                chrome.storage.local.set({
                    queryData: parsedContent.data.get_execution.execution_succeeded
                })
            }
        })
    }
})