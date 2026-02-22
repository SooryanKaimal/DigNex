const admin = require('firebase-admin');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    try {
        // Parse the secure Firebase Service Account key from Netlify
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

        // 🚀 THE FIX: Repair the broken newline characters caused by Netlify's UI
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

        // Initialize Firebase Admin (only once)
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }

        // Get the token and message data sent from your index.html
        const { token, title, body } = JSON.parse(event.body);

        // Fire the notification to the phone!
        const message = {
            notification: { title: title, body: body },
            token: token, 
        };

        await admin.messaging().send(message);
        
        return { statusCode: 200, body: JSON.stringify({ success: true, message: "Notification Sent!" }) };
    } catch (error) {
        console.error("Backend Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
