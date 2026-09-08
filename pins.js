// pins.js
/* 
  DANNY BAN PORTAL - VALID ACCESS KEYS 
  Generated for Premium Users 
*/

const VALID_KEYS = {
    "One Time": [
        "OT-X8D9-1234-A1B2",
        "OT-Y7C8-5678-D3E4",
        "OT-Z6B7-9012-F5G6",
        "OT-W5A6-3456-H7I8",
        "OT-V4Z5-7890-J9K0",
        "OT-U3Y4-1234-L1M2",
        "OT-T2X3-5678-N3O4",
        "OT-S1W2-9012-P5Q6",
        "OT-R0V1-3456-R7S8",
        "OT-Q9U0-7890-T9U0"
    ],
    "Weekly": [
        "WK-A1B2-1111-X9Y8",
        "WK-C3D4-2222-Z7W6",
        "WK-E5F6-3333-V5U4",
        "WK-G7H8-4444-T3S2",
        "WK-I9J0-5555-R1Q0",
        "WK-K1L2-6666-P9O8",
        "WK-M3N4-7777-N7M6",
        "WK-O5P6-8888-L5K4",
        "WK-Q7R8-9999-J3I2",
        "WK-S9T0-0000-H1G0"
    ],
    "Monthly": [
        "MN-X1Y2-AAA1-Z9Y8",
        "MN-A3B4-BBB2-X7W6",
        "MN-C5D6-CCC3-V5U4",
        "MN-E7F8-DDD4-T3S2",
        "MN-G9H0-EEE5-R1Q0",
        "MN-I1J2-FFF6-P9O8",
        "MN-K3L4-GGG7-N7M6",
        "MN-M5N6-HHH8-L5K4",
        "MN-O7P8-IIII9-J3I2",
        "MN-Q9R0-JJJ0-H1G0"
    ],
    "Yearly": [
        "YL-X9Y8-10X9-8W7V",
        "YL-A1B2-20Y1-9W8U",
        "YL-C3D4-30Z2-0X9T",
        "YL-E5F6-40A3-1Y8S",
        "YL-G7H8-50B4-2Z7R",
        "YL-I9J0-60C5-3A6Q",
        "YL-K1L2-70D6-4B5P",
        "YL-M3N4-80E7-5C4O",
        "YL-O5P6-90F8-6D3N",
        "YL-Q7R8-00G9-7E2M"
    ]
};

// Helper to find which plan a key belongs to
function getKeyPlan(accessKey) {
    const key = accessKey.trim();
    for (const [plan, keys] of Object.entries(VALID_KEYS)) {
        if (keys.includes(key)) return plan;
    }
    return null;
}

// Helper to get duration in seconds based on plan
function getPlanDuration(planName) {
    switch(planName) {
        case 'One Time': return 86400; // 24 hours (or 1 use logic handled elsewhere)
        case 'Weekly': return 604800; // 7 days
        case 'Monthly': return 2592000; // 30 days
        case 'Yearly': return 31536000; // 365 days
        default: return 0;
    }
}
2. index.html
This is the complete World Class UI.

Copy
