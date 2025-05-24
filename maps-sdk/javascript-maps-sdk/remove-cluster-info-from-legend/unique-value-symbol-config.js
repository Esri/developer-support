const symbol_0_1 = {
    "type": "simple-marker",
    "style": "circle",
    "size": 12,
    "color": "#1F439D",
    "outline": {
    "width": 0,
    "color": [0, 0, 0],
    "style": "solid"
    }
};

const symbol_1_2 = {
    "type": "simple-marker",
    "style": "circle",
    "size": 12,
    "color": "#2ECC71",
    "outline": {
        "width": 0,
        "color": [0, 0, 0],
        "style": "solid"
    }
};

const symbol_2_3 = {
    "type": "simple-marker",
    "style": "circle",
    "size": 12,
    "color": "#DC7633",
    "outline": {
        "width": 0,
        "color": [0, 0, 0],
        "style": "solid"
    }
};

const symbol_3_4 = {
    "type": "simple-marker",
    "style": "circle",
    "size": 12,
    "color": "#FFFF00",
    "outline": {
        "width": 0,
        "color": [0, 0, 0],
        "style": "solid"
    }
};

const symbol_4_5 = {
    "type": "simple-marker",
    "style": "circle",
    "size": 12,
    "color": "#C70300",
    "outline": {
        "width": 0,
        "color": [0, 0, 0],
        "style": "solid"
    }
};

const symbol_5_6 = {
    "type": "simple-marker",
    "style": "triangle",
    "size": 12,
    "color": "#DC7633",
    "outline": {
    "width": 0,
    "color": [0, 0, 0],
    "style": "solid"
    }
};

const symbol_6_7 = {
    "type": "simple-marker",
    "style": "triangle",
    "size": 12,
    "color": "#FFFF00",
    "outline": {
    "width": 0,
    "color": [0, 0, 0],
    "style": "solid"
    }
};

const symbol_7_8 = {
    "type": "simple-marker",
    "style": "triangle",
    "size": 12,
    "color": "#C70300",
    "outline": {
    "width": 0,
    "color": [0, 0, 0],
    "style": "solid"
    }
};

const classBreakInfos = [
    {
    "minValue": 0, 
    "maxValue": 1,
    "symbol": symbol_0_1
    },
    {
    "minValue": 1.01, 
    "maxValue": 2,
    "symbol": symbol_1_2
    },
    {
    "minValue": 2.01, 
    "maxValue": 3,
    "symbol": symbol_2_3
    },
    {
    "minValue": 3.01, 
    "maxValue": 4,
    "symbol": symbol_3_4
    },
    {
    "minValue": 4.01, 
    "maxValue": 5,
    "symbol": symbol_4_5
    },
    {
    "minValue": 5.01, 
    "maxValue": 6,
    "symbol": symbol_5_6
    },
    {
    "minValue": 6.01, 
    "maxValue": 7,
    "symbol": symbol_6_7
    },
    {
    "minValue": 7.01, 
    "maxValue": 10,
    "symbol": symbol_7_8
    }
]

const layerRenderer = {
    type: "class-breaks",
    field: "mag",
    classBreakInfos: classBreakInfos
}