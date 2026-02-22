const admin = require('firebase-admin');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        // 🚀 THE BULLETPROOF FIX: 
        // Forcefully extract only the 3 pieces we need and strictly format the newlines
        const formattedPrivateKey = serviceAccount.private_key.replace(/\\n/g, '\n');

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: serviceAccount.project_id,
                    clientEmail: serviceAccount.client_email,
                    privateKey: formattedPrivateKey
                })
            });
        }

        const { token, title, body } = JSON.parse(event.body);

        const message = {
            notification: { title: title, body: body },
            token: token, 
            
            // 🚀 THE SPEED FIX: Tell Android and Chrome to deliver this instantly
            android: { priority: "high" },
            webpush: { headers: { Urgency: "high" } }
        };

        await admin.messaging().send(message);
        
        return { statusCode: 200, body: JSON.stringify({ success: true, message: "Notification Sent!" }) };
    } catch (error) {
        console.error("Backend Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};

