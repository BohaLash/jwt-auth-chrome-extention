const allResourceTypes = Object.values(chrome.declarativeNetRequest.ResourceType);

function getRules() {
    const rules = [
        {
            id: 1,
            priority: 1,
            action: {
                type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                requestHeaders: [
                    {
                        operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                        header: 'x-test-request-header',
                        value: 'test-value',
                    },
                ],
            },
            condition: {
                urlFilter: '/returnHeaders',
                resourceTypes: allResourceTypes,
            },
        },
    ];
    return rules;
}


export default getRules;
