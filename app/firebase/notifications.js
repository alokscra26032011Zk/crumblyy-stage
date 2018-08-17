
const admin = require('firebase-admin');
const serviceAccount = require('../../exclude/crumblyy.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount) 
});

exports.sendNotification = (req,resp) =>
    
    admin.messaging().send(message)
    .then(response => { 
        console.log('Successfully sent message:', response);
        return sendSuccResp.generalSuccess(req, resp, response);
    })
    .catch(error => { 
        console.log('Error sending message:', error);
        return sendErrResp.normalError(req, resp, error);
    })
;
   
    