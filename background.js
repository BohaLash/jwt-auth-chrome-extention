const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType)

const getRules = (token) => {
    const headerValue = token ? 'Bearer ' + token : ''
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

const updateHeaders = (token) => {
    const rules = getRules(token)
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((rule) => rule.id),
        addRules: rules,
    })
}

const removeHeaders = () => {
    const rules = getRules()
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: rules.map((rule) => rule.id),
        addRules: [],
    })
}

const addHeaders = () => {
    chrome.storage.local.get('access_token', (items) => {
        const accessToken = items.access_token
        if (accessToken) updateHeaders(accessToken)
    })
}

addHeaders()

chrome.storage.local.onChanged.addListener((changes) => {
    if (changes.access_token)
        updateHeaders(changes.access_token.newValue)

    if (changes.enabled) {
        if (changes.enabled.newValue) addHeaders()
        else removeHeaders()
    }
})
