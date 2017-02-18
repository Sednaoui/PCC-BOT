'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const ElizaBot = require('./elizabot');
const eliza = new ElizaBot();
app.set('port', (process.env.PORT || 5000))

// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// Process application/json
app.use(bodyParser.json())

// Index route
app.get('/', function (req, res) {
    res.send('Hello world, I am a chat bot')
})

// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'VERIFYME') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})

// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

// add eliza
app.post('/webhook/', function (req, res) {
  startbutton(); // calling the start button
  addPersistentMenu(); //calling the menu
///  var query = req.query.newuser;

    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
      let event = req.body.entry[0].messaging[i]
      let sender = event.sender.id
      //if (event.message && event.message.text) {
      if (event.postback) {
       let text1 = JSON.stringify(event.postback)
       if(text1.includes("myawesomepostback")){
         welcome(sender);
         continue
       }
       else if(text1.includes('event_postback')){
         Evento(sender);
         continue
       }
       else if(text1.includes('General_postback')){
         GeneralInfo(sender);
         continue
       }
       else{
       sendGenericMessage(sender, "Postback received: "+text1.substring(0, 200), token)
       continue
     }
   }
  /*  if (event.message) {
    let text = JSON.stringify(event.message)
    if(text.includes('Fair_payload')){
      CareerFairQuickReply(sender);
      continue
    }
      else if(text.includes('PrepNight_payload')) {
      welcome(sender);
      continue
    }
    else if(text.includes('DressCode_postback')) {
        DressCode(sender);
        contiue
    }
  } */
    else  if (event.message.text) {
        let text = event.message.text

        if (text === 'Book an appointment') {
            sendGenericMessage(sender)
            continue
        }
         else if (text === 'hi' || text === 'Hello' || text === 'Hi' || text ==='hey' || text ==='Hey' || text ==='hello') {
            Greetings(sender)
            continue
        }
          else if (text === 'Career Fair') {
            CareerFairQuickReply(sender);
            continue
          }
          else if (text==='Dates'){
            DateofCareerFair(sender);
            continue
          }
          else if(text==='Dress Code'){
            DressCode(sender);
            continue
          }
          else if (text==='List of Companies') {
            ListComp(sender);
            continue
          }
          else if (text==='Fair Prep Night') {
            CareerFairPrepNight(sender);
            continue
          }
          else if (text==='Internships'){
            InternshipsCOOP(sender);
            continue
          }
          else if (text==='Eligibility'){
            AmIEligible(sender);
            continue
          }
          else if(text==='Resume'){
            ResumeMe(sender);
            continue
          }
          else if(text==='On Campus Jobs'){
            IWantAnOnCampusJob(sender);
            continue
          }
          else if(text==='Deadlines'){
            AmILate(sender);
            continue
          }
          else if(text==='Walk-ins Hours'){
            WalkinsHours(sender);
            continue
          }
          else if (text==='Networking for Nerds'){
            NetworkingforNerds(sender);
          }

        // get reply from eliza
        else {
          Sorrybro(sender);
          //var reply = eliza.transform(text);
          //sendTextMessage(sender, reply);
          }
         //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
      }


  }
    res.sendStatus(200)
})
const token = "Your#######TokenHere"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


// adding Menu to the Bot
function addPersistentMenu(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: { access_token:token},
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "existing_thread",
        call_to_actions:[
            {
              type:"postback",
              title:"Meet with a PCC",
              payload:"action?home"
            },
            {
              type:"postback",
              title:"Upcoming Events",
              payload:"event_postback"
            },
            {
              type:"postback",
              title:"General info",
              payload:"General_postback"
            }
          ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})

}

// Peer Career Coach Appointement schduling
function sendGenericMessage(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "generic",
                "elements": [{
                    "title": "Adeeb",
                    "subtitle": "Ask me how I got my offer at Target!",
                    "image_url": "https://web.iit.edu/sites/web/files/departments/career-services/S17-PCC-7.jpg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://calendar.google.com/calendar/embed?src=aahmed22%40hawk.iit.edu&ctz=America/Chicago",
                        "title": "Meet with me!"
                    }, {
                        "type": "web_url",
                        "url": "https://www.linkedin.com/in/adeebahmed",
                        "title": "Check my Linkedin",
                    }],
                }, {
                    "title": "Wole",
                    "subtitle": "I know leadership, management, and football. What do you know!?",
                    "image_url": "https://pbs.twimg.com/profile_images/431311245061271552/1Vk_wHnd_400x400.jpeg",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://calendar.google.com/calendar/embed?src=iit.edu_hma27lq49f5c86hf3rqtdrqnfg%40group.calendar.google.com&ctz=America/Chicago",
                        "title": "Meet with me!",
                    }, {
                        "type": "web_url",
                        "url": "https://www.linkedin.com/in/irewoleakande",
                        "title": "Check my Linkedin",
                    }],
                },{
                  "title": "Marc",
                  "subtitle": "Talk to me! This is the last semester you will get the chance to",
                  "image_url": "http://msed.me/img/marc1.jpg",
                  "buttons": [{
                      "type": "web_url",
                      "url": "https://calendar.google.com/calendar/embed?src=iit.edu_a269ifg96biea4g4j8vppr150k%40group.calendar.google.com&ctz=America/Chicago",
                      "title": "Meet with me!",
                  }, {
                      "type": "web_url",
                      "url": "http://www.msed.me",
                      "title": "Check out my website",
                    }],
              },{
                "title": "Adam",
                "subtitle": "When you mix Physics and Pizza, you get Society of Physics Students. Join us!",
                "image_url": "https://web.iit.edu/sites/web/files/departments/career-services/images/Adam-Denchfield.jpg",
                "buttons": [{
                    "type": "web_url",
                    "url": "https://calendar.google.com/calendar/embed?src=iit.edu_pgs0t1slr53o0nv1p132qhbp68%40group.calendar.google.com&ctz=America/Chicago",
                    "title": "Meet with me!",
                }, {
                    "type": "web_url",
                    "url": "https://www.linkedin.com/in/adamrobertdenchfield",
                    "title": "Check my Linkedin",
                  }]
                }, {
                  "title": "Will",
                  "subtitle": "Women in Engineering!",
                  "image_url": "https://web.iit.edu/sites/web/files/departments/career-services/S17-PCC-4.jpg",
                  "buttons": [{
                      "type": "web_url",
                      "url": "https://calendar.google.com/calendar/embed?src=iit.edu_i0ne7p7gep4m6btpfpoke5l924%40group.calendar.google.com&ctz=America/Chicago",
                      "title": "Meet with me!",
                  }, {
                      "type": "web_url",
                      "url": "https://www.linkedin.com/in/wildalineserin",
                      "title": "Check my Linkedin",
                    }]
                  },{
                  "title": "Manoj",
                  "subtitle": "I  am looking to go somewhere warm to climb some rocks, wanna come?",
                  "image_url": "https://web.iit.edu/sites/web/files/departments/career-services/S17-PCC-1.jpg",
                  "buttons": [{
                      "type": "web_url",
                      "url": "https://calendar.google.com/calendar/embed?src=iit.edu_n479uodti2od6rho0b000l56r4%40group.calendar.google.com&ctz=America/Chicago",
                      "title": "Meet with me!",
                  }, {
                      "type": "web_url",
                      "url": "https://www.linkedin.com/in/manojvarmap",
                      "title": "Check my Linkedin",
                }]
              },{
              "title": "Shreya",
              "subtitle": "It's ok, I also don't know what I will do after I graduate",
              "image_url": "https://iit.edu/news/iittoday/wp-content/uploads/2017/01/_dsc2909.jpg",
              "buttons": [{
                  "type": "web_url",
                  "url": "https://calendar.google.com/calendar/embed?src=iit.edu_trst48alqg7f8n3b53v2cnmnmk%40group.calendar.google.com&ctz=America/Chicago",
                  "title": "Meet with me!",
              }, {
                  "type": "web_url",
                  "url": "https://www.linkedin.com/in/shreya-jha-0a9aa579",
                  "title": "Check my Linkedin",
            }]
          }
            ]}
        }
    }

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
//welcome
function welcome(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Hi There! Select an option from the menu below. You can navigate later on with this menu at the buttom left corner",
                "buttons":[
                  {
                    type:"postback",
                    title:"Meet with a PCC",
                    payload:"action?home"
                  },
                  {
                    type:"postback",
                    title:"Upcoming Events",
                    payload:"event_postback"
                  },
                  {
                    type:"postback",
                    title:"General Info",
                    payload:"General_postback"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// Start button only trigged with first timers
function startbutton(){
 request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token:token},
    method: 'POST',
    json:{
        setting_type : "call_to_actions",
        thread_state : "new_thread",
        call_to_actions:[
          {
            type:"postback",
            payload:"myawesomepostback"
          },
          ]
    }

}, function(error, response, body) {
    console.log(response)
    if (error) {
        console.log('Error sending messages: ', error)
    } else if (response.body.error) {
        console.log('Error: ', response.body.error)
    }
})

}

// testing quick reply
function Evento(sender) {
  let messageData = {
      "text":"What type of event are you looking for?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Career Fair",
          "payload":"Fair_payload"
        },
        {
          "content_type":"text",
          "title":"Fair Prep Night",
          "payload":"PrepNight_payload"
        }
      ]

  }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function CareerFairQuickReply(sender) {
  let messageData = {
      "text":"Please select an option!",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Dates",
          "payload":"Dates_postback"
        },
        {
          "content_type":"text",
          "title":"Dress Code",
          "payload":"DressCode_postback"
        },
        {
          "content_type":"text",
          "title":"List of Companies",
          "payload":"List_postback"
        }
      ]

  }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function DressCode(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Professional dress is required for entry. Jeans, t-shirts, casual shoes (sneakers), shorts, and hats* will not be permitted",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Style Guide",
                    url:"https://web.iit.edu/sites/web/files/departments/career-services/pdfs/Sping%202016%20style%20guide.pdf"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function ListComp(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"You can check out the companies who have signed up to attend the fair through the Fairs App",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Day 1",
                    url:"http://app.thefairsapp.com/#/fair/58/announcements"
                  },
                  {
                    type:"web_url",
                    title:"Day 2",
                    url:"http://app.thefairsapp.com/#/fair/125/announcements"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function DateofCareerFair(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":" The two Career fairs are taking place February 22 and 23, 2017. ",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Fair Dates",
                    url:"https://web.iit.edu/career-services/students/career-fairs"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function CareerFairPrepNight(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Spring 2017 Career Fair Prep Night is happenig February 13, 4:00pm to 7:00pm in MTCC Ballroom. Come review your resume & practice your elevator pitch!",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Prep Night",
                    url:"https://web.iit.edu/career-services/events/spring-2017-career-fair-prep-night"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

// testing quick reply
function GeneralInfo(sender) {
  let messageData = {
      "text":"Please select an option!",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Internships",
          "payload":"Internships_payload"
        },
        {
          "content_type":"text",
          "title":"Resume",
          "payload":"resume_payload"
        },
        {
          "content_type":"text",
          "title":"Walk-ins Hours",
          "payload":"Walkin_payload"
        },
        {
          "content_type":"text",
          "title":"On Campus Jobs",
          "payload":"Oncampus_payload"
        }
      ]

  }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function InternshipsCOOP(sender) {
  let messageData = {
      "text":"Please select an option!",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"Eligibility",
          "payload":"eligibility_payload"
        },
        {
          "content_type":"text",
          "title":"Deadlines",
          "payload":"deadlines_payload"
        }
      ]

  }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function AmIEligible(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"All students must complete two full-time semesters (Fall and Spring) at Illinois Tech in their degree level and major to be eligible for Co-ops, Internships and Curricular Practical Training (CPT). Please read all info about eligibility, rules and requirements for Coops and Internships",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Rules",
                    url:"https://web.iit.edu/career-services/students/internships-and-co-ops/eligibility-rules-and-requirements"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function ResumeMe(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Come by anytime during walk-ins hours for a resume review! If it is your first resume, we recommend you first to check the IIT Resume Guide, and start building it online using EnhanCV ",
                "buttons":[
                  {
                    type:"web_url",
                    title:"IIT Resume Guide",
                    url:"https://web.iit.edu/sites/web/files/departments/career-services/CS_ResumeGuide.pdf"
                  },
                  {
                    type:"web_url",
                    title:"EnhanCV",
                    url:"https://enhancv.com/"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function IWantAnOnCampusJob(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"You can apply to on-campus jobs through Jobs4hawks, where you will find them all under Jobs/OnCampus",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Jobs4Hawks",
                    url:"https://iit-csm.symplicity.com/students/"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function AmILate(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"This page lists important deadlines for New Co-ops and Internships and Co-op Renewals.",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Key Deadlines",
                    url:"https://web.iit.edu/career-services/students/internships-and-co-ops/key-deadlines"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}


function WalkinsHours(sender) {
  let messageData = { text:"Walks-ins hours in Herman Hall H113 are Tuesday to Friday from 12:30pm to 4:30pm. We encourage you to see us outside of these hours. Check the menu for Meet with a PCC! " }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

function Greetings(sender) {
  let messageData = { text:"Hi There!" }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}

/*function Sorrybro(sender) {
  let messageData = { text:"Sorry - the admins haven't set a description for this response :( Pease use the menu on the buttom left corner to navigate" }
  request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token:token},
      method: 'POST',
      json: {
          recipient: {id:sender},
          message: messageData,
      }
  }, function(error, response, body) {
      if (error) {
          console.log('Error sending messages: ', error)
      } else if (response.body.error) {
          console.log('Error: ', response.body.error)
      }
  })
}*/

function NetworkingforNerds(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Career Services at Illinois Tech is thrilled to welcome Alaina G. Levine, author of award-winning book Networking for Nerds to campus on Wednesday, February 8, 2017 in MTCC for day-long programming on a variety of career development topics.",
                "buttons":[
                  {
                    type:"web_url",
                    title:"Networking4Nerds",
                    url:"https://web.iit.edu/career-services/events/networking-nerds-alaina-levine"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}

function Sorrybro(sender) {
    let messageData = {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text":"Sorry - the admins haven't set a description for this response :( Select an option from the menu below. You can navigate later on with this menu from the buttom left corner of your Chat",
                "buttons":[
                  {
                    type:"postback",
                    title:"Meet with a PCC",
                    payload:"action?home"
                  },
                  {
                    type:"postback",
                    title:"Upcoming Events",
                    payload:"event_postback"
                  },
                  {
                    type:"postback",
                    title:"General Info",
                    payload:"General_postback"
                  }
                ]
              }
            }
          }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
