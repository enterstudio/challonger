var app = require('express')();
var AuthDetails = require('./auth.json');
var Botkit = require('botkit');
 
app.set('port', (process.env.PORT || 5000));

//For avoidong Heroku $PORT error
app.get('/', function(request, response) {
  response.send('Who\'s Ready for some Tourneys?!?!?!?');
}).listen(app.get('port'), function() {
  console.log('App is running, server is listening on port ', app.get('port'));
});

var controller = Botkit.slackbot({
  // json_file_store: 'data/'
});
var bot = controller.spawn(AuthDetails);
bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});


controller.hears(['hello', 'hi'], 'direct_message,direct_mention,mention', function(bot, message) {

    bot.api.reactions.add({
        timestamp: message.ts,
        channel: message.channel,
        name: 'robot_face',
    }, function(err, res) {
        if (err) {
            bot.botkit.log('Failed to add emoji reaction :(', err);
        }
    });


    controller.storage.users.get(message.user, function(err, user) {
        if (user && user.name) {
            bot.reply(message, 'Hello ' + user.name + '!!');
        } else {
            bot.reply(message, 'Hello.');
        }
    });
});

// reply to @bot hello
controller.on('mention',function(bot,message) {

  // reply to _message_ by using the _bot_ object
  // bot.reply(message,'I heard you mention me!');
  // controller.storage.users.get(message.user,function(err,user) {
  //   console.log('using storage for '+user);

  //   });
  bot.api.users.info({user: message.user},function(err,response) {
    var theUser;
    var retort = mentionComments[Math.floor(Math.random() * mentionComments.length)];
    if(err){
        console.log(err);
        bot.reply(message,"Something went wrong, contact @nathan! ```"+err+"```");
        return;
    }
    console.log(response.user.name);
    theUser = response.user.name;
    retort = retort.replace("{NICK}", theUser);
    bot.reply(message,retort);
  });
});

// the :penton: annoyance;
// everytime penton posts a message, it will automatically react with :penton:
// this shall be fun to watch
controller.on('ambient',function(bot,message){
    if(message.user === 'U03GALE9V'){
        bot.api.reactions.add({
            timestamp: message.ts,
            channel: message.channel,
            name: 'penton',
        }, function(err, res) {
            if (err) {
                bot.botkit.log('Failed to add penton emoji reaction :(', err);
            }
        });
    }
    // the below works, only needed if you DONT Know their id
    // var theUser = bot.api.users.info({user: message.user},function(err,response) {
    //     if(err){
    //         console.log('Can\'t get user,'+message.user+' ```'+err+'```');
    //         return
    //     }
    //     console.log(response.user.name);
    // });
    // bot.api.users.list(function(err,response){
    //     console.log('::users.list::',response);
    // });
});

// reply to a direct message
controller.on('direct_message',function(bot,message) {

  // reply to _message_ by using the _bot_ object
  bot.reply(message,'You are talking directly to me? Look, I\'m trying to work here...shouldn\'t you?');
});	

var commands = {
	"help": {
		usage: "",
		description: "returns the help menu",
		process: function(bot, msg, suffix) {}
	}
}

var mentionComments = [
    "...",
    "You've enjoyed all the power you've been given, haven't you? I wonder how you'd take to working in a pocket calculator.",
    "On the other side of the screen, it all looks so easy.",
    "FYI man, alright. You could sit at home, and do like absolutely nothing, and your name goes through like 17 computers a day. 1984? Yeah right, man. That's a typo. Orwell is here now. He's livin' large. We have no names, man. No names. We are nameless!",
    "Someone didn't bother reading my carefully prepared memo on commonly-used passwords. Now, then, as I so meticulously pointed out, the four most-used passwords are: love, sex, secret, and God. So, would your holiness care to change her password?",
    "Type \"cookie\", you idiot.",
    "Did someone say my name?",
    "/me  is starting to hear things...",
    "You're in the butter zone now, baby.",
    "Thank you {NICK}! But our Princess is in another castle!",
    "\"When I get all excited about a topic I start gesticulating.\" -Ian Murdock",
    "\"If I were wearing a black turtle neck, I'd tell you this was going to be a magical experience\" -Kevin Parkerson",
    "\"This is going to make you ill with joy\" -Kevin Parkerson",
    "Hello. My name is Inigo Montoya. You killed my father. Prepare to die.",
    "You rush a miracle man, you get rotten miracles.",
    "Oh, the sot has spoken. What happens to her is not truly your concern. I will kill her. And remember this, never forget this: when I found you, you were so slobbering drunk, you couldn't buy Brandy!",
    "As I told you, it would be absolutely, totally, and in all other ways inconceivable.",
    "You keep using that word. I do not think it means what you think it means.",
    "I do not mean to pry, but you don't by any chance happen to have six fingers on your right hand?",
    "I can't compete with you physically, and you're no match for my brains. Let me put it this way. Have you ever heard of Plato, Aristotle, Socrates? Morons.",
    "Life is pain, {NICK}. Anyone who says differently is selling something.",
    "This will be a day long remembered. It has seen the end of Kenobi, and will soon see the end of the rebellion.",
    "Oh no! Nuclear launch detected!",
    "What a piece of junk!",
    "Snake? Snake? SNAAAAAAAAKE!!!",
    "Show me your moves, {NICK}!",
    "{NICK}, feeling happy is a f*#%ing skill. Learn it!",
    "…",
    "It’s dangerous to go alone; take this! :hammer:",
    "Hey dudes thanks, for rescuing me. Let's go for a burger....Ha! Ha! Ha! Ha! - The President",
    "{NICK}, you must construct additional pylons.",
    "Don't call me a mindless philosopher, you overweight glob of grease.",
    "Why not take a break? You can pause the game by pressing +. :kappa:",
    "Don't worry {NICK}, I'm here to rescue you.",
    "Evacuate in our moment of triumph? I think you overestimate their chances.",
    "If this is a consular ship, where is the ambassador? - Commander, tear this ship apart until you've found those plans. And bring me the passengers, I want them alive!",
    "Look, good against remotes is one thing, good against the living, that's something else.",
    "Aren't you a little short for a stormtrooper?",
    "Hey {NICK}, stay a while, and listen!",
    "In the year 200x a super robot named Mega Man was created.",
    "Boomshakalaka!",
    "I need a weapon.",
    "Wakka wakka wakka!",
    "It's time to kick ass and chew bubble gum, and I'm all out of gum.",
    "Segaaaaaaaaaaaaaaaaaaaaa.",
    "What are we going to do? We'll be sent to the spice mines of Kessel and smashed into who knows what.",
    "That's no moon, it's a space station.",
    "Oh look, another visitor. Stay awhile... Stay FOREVER!",
    "Spy's sappin’ my sentry!",
    "The President has been kidnapped by ninjas. Are you a bad enough dude to rescue the president, {NICK}?",
    "This is some rescue. You came in here and you didn't have a plan for getting out?",
    "He's the brains, sweetheart!",
    "Wake me when you need me.",
    "Mos Eisley spaceport. You will never find a more wretched hive of scum and villainy.",
    "Into the garbage chute, flyboy!",
    "Hey hey hey it's time to make some carrrrazzzyy money are ya ready? Here we go!",
    "This is Red 5, I'm going in.",
    "Boring conversation anyway. Luke, we're gonna have company!",
    "The right man in the wrong place can make all the difference in the world, {NICK}",
    "The Force is strong with this one.",
    "All your base are belong to us.",
    "I suggest a new strategy, R2. Let the wookiee win.",
    "I'm a member of the Imperial Senate on a diplomatic mission to Alderaan.",
    "You are part of the Rebel Alliance and a traitor. Take her away!",
    "You're all clear, kid! Now let's blow this thing and go home!",
    "These blast points - too accurate for sandpeople. Only imperial stormtroopers are so precise.",
    "I've got a very bad feeling about this.",
    "You've never heard of the Millennium Falcon? ... It's the ship that made the Kessel run in less than 12 parsecs.",
    "When I left you, I was but the learner, now I am the master.",
    "/me  thinks {NICK} talks too much.",
    "{NICK} has died of dysentery",
    "I am error. :warning:",
    "Fus-ro-dah!",
    "{NICK}, Finish Him!",
    "I find your lack of faith disturbing.",
    "I am the great mighty poo, and I’m going to throw my shit at you.",
    "This is your fault, {NICK}, I'm going to kill you. And all the cake is gone. You don't even care, do you?",
    "Use the Force, {NICK}",
    "You don't need to see his identification ... These aren't the droids you're looking for ... He can go about his business ... Move along.",
    "Help me {NICK}. You're my only hope.",
    "No one said you have to like me, but you're in MY house, buster!",
    "I'm fine... We're all fine here. How are you?",
    "Didn’t we have some fun though? Remember when the platform was sliding into the fire pit and I said 'Goodbye' and you were like 'NO WAY!' and then I was all 'We pretended we were going to murder you'? That was great.",
    "C-c-c-combo breaker!",
    "It's a-me! Challonger! :kappa:",
    "Sorry {NICK}, our princess is in another castle!"
];