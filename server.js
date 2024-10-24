const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 8080;

app.use(cors({
  origin: 'https://gdgoenkadehradun.com', // Replace '*' with your domain for security

    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'enquirygdgoenka@gmail.com',
        pass: 'xdow wtjs xyos cebt',
    },
});

app.post('/send-email', async (req, res) => {
    const { student_name, mobile, class: classNum, email, queryType } = req.body;

    // Determine the email recipient based on the queryType
    let toEmail;
    if (queryType === 'admissions') {
        toEmail = 'admissions@gdgoenkadehradun.com';
    } else if (queryType === 'careers') {
        toEmail = 'hr@gdgoenkadehradun.com';
    } else {
        // Default to a general email if no queryType or an unknown type is provided
        toEmail = 'general_enquiries@gdgoenkadehradun.com';
    }

    const subject = `Enquiry from ${student_name}`;
    const text = `Name: ${student_name}\nMobile: ${mobile}\nClass: ${classNum}\nEmail: ${email}`;

    const defaultEmail = 'enquirygdgoenka@gmail.com'; // Email to always receive a copy

    // Define mail options for primary and default emails
    const primaryMailOptions = {
        from: 'enquirygdgoenka@gmail.com',
        to: toEmail,
        subject: subject,
        text: text,
    };

    const defaultMailOptions = {
        from: 'enquirygdgoenka@gmail.com',
        to: defaultEmail,
        subject: `Copy of: ${subject}`,
        text: text,
    };

    try {
        // Send both emails concurrently
        await Promise.all([
            transporter.sendMail(primaryMailOptions),
            transporter.sendMail(defaultMailOptions),
        ]);

        console.log('Both emails sent successfully');
        res.status(200).send({ success: true, message: 'Emails sent successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send({ success: false, message: 'Emails not sent', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
