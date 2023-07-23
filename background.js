// import getRules from './rules';

// alert('hello world');

console.log('hello world');

const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

function getRules(token) {
    console.log('getRules', token)
    const headerValue = 'Bearer ' + token;
    const rules = [
        {
            id: 1,
            priority: 1,
            action: {
                type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                requestHeaders: [
                    {
                        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                        header: 'Authorization',
                        value: headerValue,
                    },
                ],
            },
            condition: {
                urlFilter: '*',
                resourceTypes: allResourceTypes,
            },
        },
    ];
    return rules;
}

function updateHeaders(token) {
    console.log('updateHeaders', token)
    const rules = getRules(token);
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((rule) => rule.id), // remove existing rules
        addRules: rules, // add new rules
    });
}

chrome.storage.local.get('access_token', (items) => {
    const accessToken = items.access_token;
    if (accessToken) {
        updateHeaders(accessToken);
    }
});

chrome.storage.local.onChanged.addListener((changes) => {
    console.log('storage.onChanged')
    console.log(changes)
    if (changes.access_token) {
        updateHeaders(changes.access_token.newValue);
    }
});

// chrome.action.onClicked.addListener((tab) => {
//     console.log('action.onClicked')
//     chrome.storage.local.set({ access_token: 'a', refresh_token: 'b' }, () => { })
// });