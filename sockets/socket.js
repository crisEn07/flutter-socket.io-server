const {io} = require('../index');
const { comprobarJWT } = require('../helpers/jwt');
const {usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


//Mensajes de Sockets
io.on('connection', client => {
    console.log('Cliente conectado');

 
    //?? Cliente con JWT 
   
    const [ valido, uid] = comprobarJWT(client.handshake.headers['x-token'])

    //Verificar autenticacón
    if(!valido){ return client.disconnect(); }

    //Cliente autenticado
    usuarioConectado( uid );

    //Ingresar al usuario a una sala en particular
    //Sala Global , client.id , 60833bf6b201ae1bbc378883
    client.join( uid );


    //Escuchar del cliente el mensaje-personal
    client.on('mensaje-personal',async (payload) => {
        //TODO: Grabar Mensaje
       await grabarMensaje(payload);
       
       io.to(payload.para ).emit('mensaje-personal',payload);


    })

    //client.to(uid).emit('mensaje-personal');



    

    client.on('disconnect', () => { 
        usuarioDesconectado( uid );
    }); 

    // client.on('mensaje',(payload) => {
    //     console.log("mensaje!!!",payload);

    //     io.emit('mensaje',{admin:'Nuevo mensaje'})
    // });


        
    });

