console.log('hello js');

const refreshUrlInput = document.getElementById('refresh_url_input');
const accessTokenInput = document.getElementById('access_token_input');
const refreshTokenInput = document.getElementById('refresh_token_input');
const refreshButton = document.getElementById('refresh_button');

// chrome.tabs.getSelected(null, function (tab) {
//     console.log(tab)
//     console.log(tab.url)
//     console.log(tab.host)
//     setRefreshUrlKey(tab.host);
//     loadRefreshUrl();
// });

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    const tab = tabs[0];
    console.log(tab)
    console.log(tab.url)
    const host = tab.url.split('/')[2];
    console.log(host)

    const refreshUrlKey = 'refresh_url__' + host;

    console.log(refreshUrlKey);

    chrome.storage.local.get(refreshUrlKey, (items) => {
        console.log(items)
        refreshUrlInput.value = items[refreshUrlKey] || '';
    });

    refreshUrlInput.onchange = () =>
        chrome.storage.local.set({ [refreshUrlKey]: refreshUrlInput.value });

    // refreshUrlInput.onchange = (e) => {
    //     console.log(e)
    //     chrome.storage.local.set({ [refreshUrlKey]: refreshUrlInput.value })
    // };
});

chrome.storage.local.get(
    ['access_token', 'refresh_token'],
    (items) => {
        accessTokenInput.value = items.access_token || '';
        refreshTokenInput.value = items.refresh_token || '';
    },
);

accessTokenInput.onchange = () =>
    chrome.storage.local.set({ 'access_token': accessTokenInput.value });
refreshTokenInput.onchange = () =>
    chrome.storage.local.set({ 'refresh_token': refreshTokenInput.value });


refreshButton.onclick = async () => {
    console.log('Refresh')
    const url = refreshUrlInput.value;
    // window.location.toString()
    const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 'refresh': refreshTokenInput.value }),
    });
    const data = await response.json();
    console.log(data);
    const accessToken = data.access;
    if (accessToken) {
        accessTokenInput.value = data.access;
        chrome.storage.local.set({ 'access_token': data.access })
    }
}



// chrome.storage.local.get('access_token', (items) => {
//     accessTokenInput.value = items.access_token
// })

// chrome.storage.local.get('refresh_token', (items) => {
//     refreshTokenInput.value = items.refresh_token
// })

// const loadData = async () => {
//     console.log(await chrome.storage.local.get(['access_token', 'refresh_token']))

//     // accessTokenInput.value = await chrome.storage.local.get('access_token');
//     // refreshTokenInput.value = await chrome.storage.local.get('refresh_token');
// }

// loadData();
