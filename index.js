const Discord = require('discord.js');
const bot = new Discord.Client();

const token = 'TOKEN DE TON BOT';
const PREFIX ='PREFIX DE TON BOT';
var servers = {};

const ytdl = require("ytdl-core");

bot.on('ready',()=>{
    console.log('Je Suis Pret!')
})

bot.on('message',message =>{

    let args = message.content.substring(PREFIX.length).split(" ");
    switch(args[0]){
        case 'play':
            
            function play(connection,message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.playStream(ytdl(server.queue[0],{filter: 'audioonly'}));
                server.queue.shift();
                server.dispatcher.on("end",function(){
                    if(server.queue[0]){
                        play(connection,message);
                    }else {
                        connection.disconnect();
                    }
                });

            }

            if(!args[1]){
                message.channel.send("vous devez fournir un lien");
                return;
            }
            if(!message.member.voiceChannel){
                message.channel.send("vous devez être dans un channel vocal pour jouer au bot !");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id]={
                queue :[]
            }
            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) 
            message.member.voiceChannel.join().then(function(connection){
                play(connection,message);
            })

            break;
        case 'skip':
                var server = servers[message.guild.id];
                if(server.dispatcher) server.dispatcher.end();
                message.channel.send("song skipped")
        break;

        case 'stop':
                var server = servers[message.guild.id];
                if(message.guild.voiceConnection){
                    for(var i=server.queue.length -2;i>=0;i--){
                        server.queue.splice(i,1);
                    }
                    server.dispatcher.end();
                    message.channel.send("Fin de la file d'attente en quittant le channel vocal")
                    console.log('musique arrete')
                }
                if(message.guild.connection) message.guild.voiceConnection.disconnect();
        
        break;
    }
})


bot.login(token)
