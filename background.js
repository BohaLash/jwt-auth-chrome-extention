const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType)

const getRules = (token) => {
    const headerValue = 'Bearer ' + token
    const headerRule = {
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
    }
    return [headerRule]
}

function updateHeaders(token) {
    const rules = getRules(token)
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((rule) => rule.id),
        addRules: rules,
    })
}

chrome.storage.local.get('access_token', (items) => {
    const accessToken = items.access_token
    if (accessToken) updateHeaders(accessToken)
})

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.access_token)
        updateHeaders(changes.access_token.newValue)
})
