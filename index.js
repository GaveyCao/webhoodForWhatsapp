const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const app = express().use(body_parser.json());
require('dotenv').config();

//firebase part
const firebase = require("firebase/app");
const { text } = require("body-parser");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyACk35PD9o5oXc3KMJPaTyD4SU9d9y6ofU",
    authDomain: "whatsapp-362c0.firebaseapp.com",
    projectId: "whatsapp-362c0",
    storageBucket: "whatsapp-362c0.appspot.com",
    messagingSenderId: "946938008001",
    appId: "1:946938008001:web:4956775fb43caf2e39df40",
    measurementId: "G-3YFFJGX877"
  };

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();



const token = process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

app.listen( process.env.PORT, ()=>{
    console.log("webhook is listening");
});

app.get("/webhook",(req,res)=>{
    let mode = req.query["hub.mode"];
    let challenge = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    if(mode && token){
        if (mode==="subscribe" && token===mytoken){
            res.status(200).send(challenge);
        }else{
            res.status(403);
        }
    }
});

app.post("/webhook",(req,res)=>{
    let body_param = req.body;
    console.log(JSON.stringify(body_param, null, 2));
    if (body_param.object){
        if(body_param.entry && 
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
            ){
                let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
                let from = body_param.entry[0].changes[0].value.messages[0].from;
                let replyid = "";
                let datas = {
                    messaging_product:"whatsapp",
                    to:from,
                    text:{
                        body:"Welcome to Builtrec, to start our services please enter 1 "
                    }
                };
                const userRef = db.collection(from);
                let message = body_param.entry[0].changes[0].value.messages[0]
                let messageTime = message.timestamp
                userRef.doc(messageTime).set(message);
                /*
                deal with common message
                */
                if (body_param.entry[0].changes[0].value.messages[0].text){
                    let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
                    if (msg_body === "1"){
                        datas = {
                            messaging_product:"whatsapp",
                            to:from,
                            "type": "interactive",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Which language would you like to us?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "English",
                                                "title": "English"
                                            }
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "Setswana",
                                                "title": "Setswana"
                                            }
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "Yoruba",
                                                "title": "Yoruba"
                                            }
                                        }
                                    ]
                                }
                            }
                            
                        };
                    }
                    if (msg_body.includes("NAME")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "What's your phone number? \nplease input by \"PHONE\"+ your phone number"
                            }
                        };
                    }
                    if (msg_body.includes("PHONE")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "What's your name of business? \nplease input by \"BSNAME\"+ your business name"
                            }
                        };
                    }
                    if (msg_body.includes("BSNAME")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "When was your business start? \nplease input by \"BSST\"+ your business start time"
                            }
                        };
                    }
                    if (msg_body.includes("BSST")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "What is the location of your business? \nplease input by \"LOCA\"+ your business location"
                            }
                        };
                    }
                    if (msg_body.includes("LOCA")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "What is your estimated annual revenue or income? \nplease input by \"INCO\"+ your answer"
                            }
                        };
                    }
                    if (msg_body.includes("INCO")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "What is your type of business? \nplease input by \"TYPE\"+ your answer"
                            }
                        };
                    }
                    if (msg_body.includes("TYPE")){
                        datas = {
                            messaging_product:"whatsapp",
                            to:from,
                            "type": "interactive",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    "text": "Is the business registered?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "Q1YES",
                                                "title": "Yes"
                                            }
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "Q1NO",
                                                "title": "No"
                                            }
                                        }
                                    ]
                                }
                            }
                            
                        };
                    }
                    if (msg_body.includes("START")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                "body": "Thanks for your recording!"
                            }
                        };
                    }

                    //setswana
                    if (msg_body.includes("MANG")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // "body": "What's your phone number? \nplease input by \"PHONE\"+ your phone number"
                                "body": "Mogala wa gago wa letheka ke? \nkwadise ka go \"LET\"+ mogala wa gago"
                            }
                        };
                    }
                    if (msg_body.includes("LET")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // "body": "What's your name of business? \nplease input by \"BSNAME\"+ your business name"
                                "body": "Leina la kgwebo ya gago ke mang? \nkwadise ka go \"KGMA\"+ leina la kgwebo ya gago"
                            }
                        };
                    }
                    if (msg_body.includes("KGMA")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // When was your business start? please input by ""+ your business start time
                                "body": "O simolotse kgwebo ya gago leng? \nkwadise ka go \"KGLE\"+ kgwebo ya gago e simolotse leng"
                            }
                        };
                    }
                    if (msg_body.includes("KGLE")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // What is the location of your business? please input by ""+ your business location
                                "body": "Kgwebo ya gago e direla ko kae? \nkwadise ka go \"DIRE\"+ lefelo le kgwebo ya gago e direlang teng"
                            }
                        };
                    }
                    if (msg_body.includes("DIRE")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // What is your estimated annual revenue or income? please input by ""+ your answer
                                "body": "O dira bokae ka ngwaga mo kgwebong ya gago? \nkwadise ka go \"KGWE\"+ karabo ya gago"
                            }
                        };
                    }
                    if (msg_body.includes("KGWE")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // What is your type of business? please input by ""+ your answer
                                "body": "Kgwebo ya gago ke a mofuta ofe? \nkwadise ka go \"MOFU\"+ karabo ya gago"
                            }
                        };
                    }
                    if (msg_body.includes("MOFU")){
                        datas = {
                            messaging_product:"whatsapp",
                            to:from,
                            "type": "interactive",
                            "interactive": {
                                "type": "button",
                                "body": {
                                    // Is the business registered?
                                    "text": "A kgwebo ya gago e kwadisitswe ka fa molaong?"
                                },
                                "action": {
                                    "buttons": [
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "Q1Ee",
                                                "title": "Ee"
                                            }
                                        },
                                        {
                                            "type": "reply",
                                            "reply": {
                                                "id": "Q1Nnyaa",
                                                "title": "Nnyaa"
                                            }
                                        }
                                    ]
                                }
                            }
                            
                        };
                    }
                    if (msg_body.includes("BOKAE")){
                        datas = {
                            "messaging_product": "whatsapp",    
                            "to": from,
                            "type": "text",
                            "text": {
                                // Thanks for your recording!
                                "body": "Re leboga kwadiso ya gago!"
                            }
                        };
                    }
                }

                /*
                deal with bottom reply
                */
                if (body_param.entry[0].changes[0].value.messages[0].interactive){
                    if (body_param.entry[0].changes[0].value.messages[0].interactive.button_reply){
                        let replyid = body_param.entry[0].changes[0].value.messages[0].interactive.button_reply.id;
                        if (replyid === "English"){
                            datas = {
                                "messaging_product": "whatsapp",    
                                "to": from,
                                "type": "text",
                                "text": {
                                    "body": "What's your name? \nplease input by \"NAME\"+ your name"
                                }
                            };
                        }
                        if (replyid === "Q1NO" || replyid === "Q1YES"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Do you have a business loan?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q2YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q2NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q2NO" || replyid === "Q2YES"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Do you have an accounting software that you use to account for your business activities?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q3YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q3NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q3NO" || replyid === "Q3YES"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Do you have prior knowledge of accounting?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q4YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q4NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q4NO" || replyid === "Q4YES"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Would you pay for an easy to use accounting software for under $5 per month to assist you in getting access to financial services?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q5YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q5NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q5NO" || replyid === "Q5YES"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "How often do you have sales in your business?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q6DAILY",
                                                    "title": "Daily"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q6WEEKLY",
                                                    "title": "Weekly"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q6MONTHLY",
                                                    "title": "Monthly"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q6DAILY" || replyid === "Q6WEEKLY" || replyid === "Q6MONTHLY"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Is language a barrier to using accounting services available?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q7YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q7NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q7YES" || replyid === "Q7NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Would you use the free version of our accounting product to input your business data?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q8YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q8NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q8YES" || replyid === "Q8NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Is your business profitable?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q9YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q9NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q9YES" || replyid === "Q9NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Would getting a small loan to help finance your business help you grow?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q10YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q10NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q10YES" || replyid === "Q10NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Do you currently have access to insurance products?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q11YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q11NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q11YES" || replyid === "Q11NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Would you purchase insurance products from Builtrec if made available?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q12YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q12NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q12YES" || replyid === "Q12NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Do you have a business bank account?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q13YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q13NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q13NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "If no, would you like to be assisted to open one in future?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q14YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q14NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q13YES" || replyid === "Q14NO"|| replyid === "Q14YES"){
                            datas = {
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "list",
                                    "body": {
                                        "text": "Where do you currently store your business earnings?"
                                    },
                                    "action": {
                                        "button": "select here",
                                        "sections": [
                                            {
                                                "rows": [
                                                    {
                                                        "id": "Q15Businessbank",
                                                        "title": "Business bank"
                                                    },
                                                    {
                                                        "id": "Q15Personalbankaccount",
                                                        "title": "Personal bank account"
                                                    },
                                                    {
                                                        "id": "Q15Mobilemoneyservices",
                                                        "title": "Mobile money services"
                                                    },
                                                    {
                                                        "id": "Q15Other",
                                                        "title": "Other"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            };
                        }
                        if (replyid === "Q16NO"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "If no, would you like to be assisted to open one in future?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q17YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q17NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q16YES" || replyid === "Q17NO"|| replyid === "Q17YES"){
                            datas = {
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "list",
                                    "body": {
                                        "text": "Which is your primary customer?"
                                    },
                                    "action": {
                                        "button": "select here",
                                        "sections": [
                                            {
                                                "rows": [
                                                    {
                                                        "id": "Q18Otherbusinesses",
                                                        "title": "Other businesses"
                                                    },
                                                    {
                                                        "id": "Q18Consumers",
                                                        "title": "Consumers"
                                                    },
                                                    {
                                                        "id": "Q18Government",
                                                        "title": "Government"
                                                    },
                                                    {
                                                        "id": "Q18Other",
                                                        "title": "Other"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            };
                        }
                        // setswana
                        if (replyid === "Setswana"){
                            datas = {
                                "messaging_product": "whatsapp",    
                                "to": from,
                                "type": "text",
                                "text": {
                                    // "body": "What's your name? \nplease input by \"NAME\"+ your name"
                                    "body": "Leina la gago ke mang? \nLe kwadise ka go \"MANG\"+ leina la gago"
                                }
                            };
                        }
                        if (replyid === "Q1Nnyaa" || replyid === "Q1Ee"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Do you have a business loan?"
                                        "text":"A kgwebo ya gago e na le sekoloto?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q2Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q2Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q2Nnyaa" || replyid === "Q2Ee"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Do you have an accounting software that you use to account for your business activities?"
                                        "text": "A go na le tsela nngwe ya maranyane e o e dirisang go dira dibuka(account) tsa kgwebo ya gago?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q3Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q3Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q3Nnyaa" || replyid === "Q3Ee"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Do you have prior knowledge of accounting?"
                                        "text": "A o na le kitso ka tsa go dira dibuka tsa kgwebo (accounting)?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q4Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q4Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q4Nnyaa" || replyid === "Q4Ee"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Would you pay for an easy to use accounting software for under $5 per month to assist you in getting access to financial services?"
                                        "text": "A o ka duelelwa tiriso ya maranyane a Builtrec go go direla dibuka (accounting) tsa kgwebo ya gago ko tlase ga BWP 50 ka kgwedi, go go thusa gore o fiwe dithuso tsa madi go godisa kgwebo ya gago?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q5Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q5Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q5Nnyaa" || replyid === "Q5Ee"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "How often do you have sales in your business?"
                                        "text": "O rekisa ga kae mo kgwebong ya gago?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q6Tsatsileletsatsi",
                                                    "title": "Tsatsi le letsatsi"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q6Gangwemobekeng",
                                                    "title": "Gangwe mo bekeng"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q6Gangwemokgweding",
                                                    "title": "Gangwe mo kgweding"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q6Tsatsileletsatsi" || replyid === "Q6Gangwemobekeng" || replyid === "Q6Gangwemokgweding"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Is language a barrier to using accounting services available?"
                                        "text": "A tiriso ya teme e o sa e hlaloganyeng e go kganela go ka dira dibuka tsa kgwebo ya gago (accounting)?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q7Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q7Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q7Ee" || replyid === "Q7Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Would you use the free version of our accounting product to input your business data?"
                                        "text": "A o na le keletso ya go dirisa Builtrec go dira dibuka tsa kgwebo ya gago mahala ka go dirisa mogala wa gago?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q8Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q8Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q8Ee" || replyid === "Q8Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Is your business profitable?"
                                        "text": "A kgwebo ya gago e na le dipoelo?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q9Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q9Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q9Ee" || replyid === "Q9Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Would getting a small loan to help finance your business help you grow?"
                                        "text": "A go fiwa sekoloto ke Builtrec go ka thusa kgwebo ya gago go gola?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q10Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q10Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q10Ee" || replyid === "Q10Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Do you currently have access to insurance products?"
                                        "text": "A mo bogompienong o kgona go reka itshireletso (insurance)?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q11Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q11Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q11Ee" || replyid === "Q11Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Would you purchase insurance products from Builtrec if made available?"
                                        "text": "A o na le keletso ya go reka itshireletso (insurance) mo Builtrec?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q12Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q12Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q12Ee" || replyid === "Q12Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Do you have a business bank account?"
                                        "text": "A kgwebo ya gago e na le letlole la madi (bank account) ko bankeng?"
                                        
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q13Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q13Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q13Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "If no, would you like to be assisted to open one in future?"
                                        "text": "Fa ele gore nnyaa, a o na le keletso ya go thusiwa go bula letlole la madi (bank account) le banka nngwe mo bogaufing?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q14Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q14Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q13Ee" || replyid === "Q14Nnyaa"|| replyid === "Q14Ee"){
                            datas = {
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "list",
                                    "body": {
                                        // "text": "Where do you currently store your business earnings?"
                                        "text": "Mo bogompienong, madi a o a dirang mo kgwebong o a bolokela kae?"
                                    },
                                    "action": {
                                        "button": "select here",
                                        "sections": [
                                            {
                                                "rows": [
                                                    {
                                                        "id": "Q15Letlolelamadilakompone",
                                                        "title": "1",
                                                        "description": "Letlole la madi la kompone"
                                                    },
                                                    {
                                                        "id": "Q15letlolelamadilagago",
                                                        "title": "2",
                                                        "description": "letlole la madi la gago"
                                                    },
                                                    {
                                                        "id": "Q15Orangemoney",
                                                        "title": "3",
                                                        "description":"mobile money (Orange money, My zaka)"
                                                    },
                                                    {
                                                        "id": "Q15tsedingwe",
                                                        "title": "4",
                                                        "description":"tse dingwe"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            };
                        }
                        if (replyid === "Q16Nnyaa"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "If no, would you like to be assisted to open one in future?"
                                        "text": "Fa e le gore nnyaa, a o na le keletso ya go thusiwa go bula letlole le banka mo bogaufing?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q17Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q17Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q16Ee" || replyid === "Q17Nnyaa"|| replyid === "Q17Ee"){
                            datas = {
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "list",
                                    "body": {
                                        // "text": "Which is your primary customer?"
                                        "text": "Kgwebo ya gago e rekisetsa mang thata?"
                                    },
                                    "action": {
                                        "button": "select here",
                                        "sections": [
                                            {
                                                "rows": [
                                                    {
                                                        "id": "Q18Dikompone",
                                                        "title": "1",
                                                        "description": "Dikompone kgotsa bagwebi ba bangwe"
                                                    },
                                                    {
                                                        "id": "Q18Batho",
                                                        "title": "2",
                                                        "description": "Batho kgotsa baji bareki"
                                                    },
                                                    {
                                                        "id": "Q18Goromente",
                                                        "title": "3",
                                                        "description": "Goromente kgotsa offisi tsa puso"
                                                    },
                                                    {
                                                        "id": "Q18Tsedingwe",
                                                        "title": "4",
                                                        "description": "Tse dingwe"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                }
                            };
                        }
    
                    }
                    /*
                    deal with list reply
                    */
                    if (body_param.entry[0].changes[0].value.messages[0].interactive.list_reply){
                        let replyid = body_param.entry[0].changes[0].value.messages[0].interactive.list_reply.id;
                        if (replyid === "Q15Businessbank" || replyid === "Q15Personalbankaccount" || replyid === "Q15Mobilemoneyservices" || replyid === "Q15Other"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        "text": "Do you have a personal bank account?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q16YES",
                                                    "title": "Yes"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q16NO",
                                                    "title": "No"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q18Otherbusinesses" || replyid === "Q18Consumers" || replyid === "Q18Government" || replyid === "Q18Other"){
                            datas = {
                                "messaging_product": "whatsapp",    
                                "to": from,
                                "type": "text",
                                "text": {
                                    "body": "How much money did you start your business with? \nplease input by \"START\"+ your answer"
                                }
                            };
                        }
                        // setswana
                        if (replyid === "Q15Letlolelamadilakompone" || replyid === "Q15Orangemoney" || replyid === "Q15letlolelamadilagago" || replyid === "Q15tsedingwe"){
                            datas = {
                                "messaging_product":"whatsapp",
                                "to":from,
                                "type": "interactive",
                                "interactive": {
                                    "type": "button",
                                    "body": {
                                        // "text": "Do you have a personal bank account?"
                                        "text": "A o na le letlole le banka le e leng la gago (personal bank account)?"
                                    },
                                    "action": {
                                        "buttons": [
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q16Ee",
                                                    "title": "Ee"
                                                }
                                            },
                                            {
                                                "type": "reply",
                                                "reply": {
                                                    "id": "Q16Nnyaa",
                                                    "title": "Nnyaa"
                                                }
                                            }
                                        ]
                                    }
                                }
                                
                            };
                        }
                        if (replyid === "Q18Dikompone" || replyid === "Q18Batho" || replyid === "Q18Goromente" || replyid === "Q18Tsedingwe"){
                            datas = {
                                "messaging_product": "whatsapp",    
                                "to": from,
                                "type": "text",
                                "text": {
                                    // "body": "How much money did you start your business with? \nplease input by \"START\"+ your answer"
                                    "body": "O simolotse kgwebo ya gago ka bokae? \nplease input by \"BOKAE\"+ karabo ya gago"
                                }
                            };
                        }
                    }
                    
                }
                


                axios({
                    method:"POST",
                    url:"https://graph.facebook.com/v15.0/" + phon_no_id + "/messages?access_token=" + token,
                    data: datas,
                });

                res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }
    }
});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is wehhook setup")
});