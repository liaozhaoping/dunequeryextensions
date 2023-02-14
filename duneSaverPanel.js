const summary = document.getElementById("dataSummary")
const contentWrapper = document.getElementsByClassName("contentWrapper")[0]
const content = document.getElementById("content")
const saveButton = document.getElementById("saveButton")
const viewButton = document.getElementById("viewButton")
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

viewButton.addEventListener('click', () => {
    contentWrapper.classList.toggle("showAll")
})

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && changes.queryData?.newValue) {
        const queryData = changes.queryData.newValue
        const id = queryData.execution_id
        const at = queryData.generated_at

        summary.innerHTML = `
            <div>Execution ID: ${id}</div>
            <div>Generated At: ${at ? new Date(at).toLocaleString() : '-'}</div>
        `
        content.innerText = JSON.stringify(queryData)

        if (document.getElementById("content").getBoundingClientRect().height > 80) {
            viewButton.style.display = "block"
        } else {
            viewButton.style.display = "none"
        }
    }
})