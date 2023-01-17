const{from} = require("./index")
const welcome = {
    messaging_product:"whatsapp",
    to:from,
    text:{
        body:"Welcome to Builtrec, to start our services please enter 1 "
    }
};

const mainMenu = {
    messaging_product:"whatsapp",
    to:from,
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {
            "text": "Which service would you like to access?"
        },
        "action": {
            "buttons": [
                {
                    "type": "reply",
                    "reply": {
                        "id": "1",
                        "title": "Accounting"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "2",
                        "title": "Other"
                    }
                }
            ]
        }
    }
    
};

const secondMenu = {
    messaging_product:"whatsapp",
    to:from,
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {
            "text": "Which would you like to record?"
        },
        "action": {
            "buttons": [
                {
                    "type": "reply",
                    "reply": {
                        "id": "3",
                        "title": "Sales"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "4",
                        "title": "Purchases"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "5",
                        "title": "Expenses"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "6",
                        "title": "Inventory level"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "7",
                        "title": "Cash in hand"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "8",
                        "title": "Cash at bank"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "9",
                        "title": "Check balances"
                    }
                },
                {
                    "type": "reply",
                    "reply": {
                        "id": "10",
                        "title": "Go back to main menu"
                    }
                }
            ]
        }
    }
    
};

/*
If Sales selected
1.	How much did you sell today? Input figure
2.	Go back

After figure is input, it should say thank you for recording your sales for today, 
1.	Go back to main menu
2.	Exit

If Purchase is selected

1.	How much did you buy stock with today?
2.	Go back

After figure is input, it should say thank you for recording your purchases for today, 
1.	Go back to main menu

For all other selections it should follow this same pattern.

Only for check balances
Then select between the follow
1.	Month Sales
2.	Month Purchases
3.	Current bank balance

Then it ends 

*/
const saleMenu = {
    messaging_product:"whatsapp",
    to:from,
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {
            "text": "How much did you sell today?"
        },
        "action": {
            "buttons": [
                {
                    "type": "reply",
                    "reply": {
                        "id": "11",
                        "title": "Go back"
                    }
                }
            ]
        }
    }
    
};

const saleSecondMenu = {
    messaging_product:"whatsapp",
    to:from,
    "type": "interactive",
    "interactive": {
        "type": "button",
        "body": {
            "text": "Thank you for recording your purchases for today."
        },
        "action": {
            "buttons": [
                {
                    "type": "reply",
                    "reply": {
                        "id": "12",
                        "title": "Go back to main menu"
                    }
                }
            ]
        }
    }
    
};
module.exports = { welcome, mainMenu, secondMenu, saleMenu, saleSecondMenu };