

var wastedata = {
  
  choices: {

        "w02": {
           "name": "Yes, it is hazardous",
           "question": "What are you doing with the hazardous waste?",
           "children": [
              "w03",
              "w06",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w03": {
           "name": "Incinerating it",
           "question": "What's the capacity of your incinerators?",
           "children": [
              "w04",
              "w05",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w04": {
           "name": "10 tonnes or less",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w05": {
           "name": "More than 10 tonnes",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w06": {
           "name": "Storing it",
           "question": "How much are you storing?",
           "children": [
              "w07",
              "w13",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w07": {
           "name": "50 tonnes or more",
           "question": "Where is it stored?",
           "children": [
              "w08",
              "w09",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w08": {
           "name": "Underground",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w09": {
           "name": "Above ground",
           "question": "Why is it stored?",
           "children": [
              "w10",
              "w11",
              "w12",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w10": {
           "name": "Temporary storage on same site as it is generated",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w11": {
           "name": "Temporary storage before incineration or landfill",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w12": {
           "name": "Other purpose",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w13": {
           "name": "Less than 50 tonnes",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w14": {
           "name": "No, it's not hazardous",
           "question": "What do you do with the waste?",
           "children": [
              "w15",
              "w22",
              "w26",
              "w30",
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w15": {
           "name": "Incineration or co-incineration",
           "question": "What are you incinerating?",
           "children": [
              "w16",
              "w17",
              "w18",
              "w19",
              "w20",
              "w21",
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w16": {
           "name": "non-hazardous waste with a capacity of more than 3 tonnes an hour",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w17": {
           "name": "any gaseous compound containing halogens (except incidentally)",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w18": {
           "name": "vegetable, cork or wood waste in plant with a capacity of 50kg or more an hour",
           "question": "The permit you need",
           "children": [
              "b",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w19": {
           "name": "animal carcasses in plant with a capacity of 50kg or more an hour",
           "question": "The permit you need",
           "children": [
              "b",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w20": {
           "name": "cremating human remains",
           "question": "The permit you need",
           "children": [
              "b",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w21": {
           "name": "other materials or less than 50kg an hour capacity",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w22": {
           "name": "Disposal to landfill",
           "question": "Do any of these apply to your landfill activity?",
           "children": [
              "w23",
              "w24",
              "w25",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w23": {
           "name": "it receives more than 10 tonnes of waste in any day",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w24": {
           "name": "it has a total capacity of more than 25,000 tonnes",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w25": {
           "name": "neither of these apply",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w26": {
           "name": "Produce fuel from waste",
           "children": [
              "w27",
              "w28",
              "w29",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w27": {
           "name": "make solid fuel from waste by any process involving heat",
           "question": "The permit you need",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w28": {
           "name": "make charcoal",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w29": {
           "name": "another fuel",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w30": {
           "name": "Disposal or recovery",
           "question": "Do any of these apply?",
           "children": [
              "w31",
              "w32",
              "w33",
              "w34",
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w31": {
           "name": "disposal and/or recovery by anaerobic digestion with capacity more than 100 tonnes a day",
           "question": "The permit you need",
           "children": [
              "a1-anaerobic",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w32": {
           "name": "disposal with capacity of more than 50 tonnes a day",
           "question": "The permit you need",
           "description": "involving: biological treatment; physico-chemical treatment; pre-treatment of waste for incineration; treatment of slags and ashes; treatment in shredders of metal waste, including waste electrical and electronic equipment and end-of-life vehicles and their components",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w33": {
           "name": "recovery and/or disposal with capacity of more than 75 tonnes a day",
           "question": "The permit you need",
           "description": "involving: biological treatment; pre-treatment of waste for incineration or co-incineration; treatment of slags and ashes; treatment in shredders of metal waste, including waste electrical and electronic equipment and end-of-life vehicles and their components.",
           "children": [
              "a1",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        },
        "w34": {
           "name": "smaller capacity or other activity",
           "question": "The permit you need",
           "children": [
              "nopermit",
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null,
              null
           ]
        }
     }
  
};
