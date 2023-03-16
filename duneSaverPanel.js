const summary = document.getElementById("dataSummary")
const contentWrapper = document.getElementsByClassName("contentWrapper")[0]
const content = document.getElementById("content")
const saveButton = document.getElementById("saveButton")
const viewButton = document.getElementById("viewButton")
const tips = document.getElementById("successTips")

function formatDataForCsv(data) {
    const dataArr = [data.columns?.join(",")];
    data?.data?.forEach(d => {
        const item = data?.columns?.map(key => d[key])
        dataArr.push(item.join(','))
    })
    return dataArr.join('\n');
}

function getDownloadUrl(text) {
    const BOM = '\uFEFF';
    if (window.Blob && window.URL && window.URL.createObjectURL) {
        const csvData = new Blob([BOM + text], {type: "text/csv"});
        return URL.createObjectURL(csvData)
    } else {
        return "data:attachment/csv;charset=utf-8," + BOM + text
    }
}

saveButton.addEventListener("click", () => {
    chrome.storage.local.get("queryData").then((data) => {
        chrome.downloads.download({
            url: getDownloadUrl(formatDataForCsv(data.queryData)),
            filename: "dune_query_" + (data.queryData?.execution_id || "data") + ".csv",
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

        if (document.getElementById("content").getBoundingClientRect().height > 78) {
            viewButton.style.display = "block"
        } else {
            viewButton.style.display = "none"
        }
    }
})