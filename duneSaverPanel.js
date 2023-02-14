
const wrapper = document.getElementById("dataWrapper")
const saveButton = document.getElementById("saveButton")
const tips = document.getElementById("successTips")

saveButton.addEventListener("click", () => {
    chrome.storage.local.get("queryData").then((data) => {
        chrome.downloads.download({
            url: "data:," + JSON.stringify(data.queryData),
            filename: "dune_query_" + data.queryData?.execution_id || "data",
            conflictAction: "overwrite"
        }, (downloadId) => {
            if (downloadId && tips) {
                tips.style.display = "inline-block"
                setTimeout(() => tips.style.display = "none", 3000)
            }
        })
    })
})

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.queryData?.newValue) {
        console.log("Local: ", changes.queryData.newValue)
        wrapper.innerText = JSON.stringify(changes.queryData.newValue)
    }
})