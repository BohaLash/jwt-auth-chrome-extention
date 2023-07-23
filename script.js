const enabledInput = document.getElementById('enabled_checkbox');
const refreshUrlInput = document.getElementById('refresh_url_input');
const accessTokenInput = document.getElementById('access_token_input')
const refreshTokenInput = document.getElementById('refresh_token_input')
const refreshButton = document.getElementById('refresh_button')

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const tab = tabs[0]
    const host = tab.url.split('/')[2]

    const refreshUrlKey = 'refresh_url__' + host

    chrome.storage.local.get(refreshUrlKey, (items) => {
        refreshUrlInput.value = items[refreshUrlKey] || ''
    })

    refreshUrlInput.onchange = () =>
        chrome.storage.local.set({ [refreshUrlKey]: refreshUrlInput.value })

    // const enabledKey = 'enabled__' + host

    // chrome.storage.local.get(enabledKey, (items) => {
    //     enabledInput.value = items[enabledKey] || ''
    // })

    // enabledInput.onchange = () =>
    //     chrome.storage.local.set({ [enabledKey]: enabledInput.value })
})

chrome.storage.local.get(
    ['access_token', 'refresh_token', 'enabled'],
    (items) => {
        enabledInput.checked = items.enabled || false

        accessTokenInput.value = items.access_token || ''
        refreshTokenInput.value = items.refresh_token || ''
    },
)

enabledInput.onchange = () =>
    chrome.storage.local.set({ 'enabled': enabledInput.checked })

accessTokenInput.onchange = () =>
    chrome.storage.local.set({ 'access_token': accessTokenInput.value })
refreshTokenInput.onchange = () =>
    chrome.storage.local.set({ 'refresh_token': refreshTokenInput.value })


refreshButton.onclick = async () => {
    const url = refreshUrlInput.value
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'refresh': refreshTokenInput.value }),
    })
    const data = await response.json()
    const accessToken = data.access
    if (accessToken) {
        accessTokenInput.value = data.access
        chrome.storage.local.set({ 'access_token': data.access })
    }
}
