const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'enquirygdgoenka@gmail.com',
    pass: 'xdow wtjs xyos cebt',
  },
});

app.post('/send-email', async (req, res) => {
  const { queryType, subject, text } = req.body;
console.log(req)
  const defaultEmail = 'enquirygdgoenka@gmail.com';

  let toEmail;
  if (queryType === 'admissions') {
    toEmail = 'admissions@gdgoenkadehradun.com';
  } else if (queryType === 'careers') {
    toEmail = 'hr@gdgoenkadehradun.com';
  } else {
    return res.status(400).send({ success: false, message: 'Invalid query type' });
  }

  const primaryMailOptions = {
    from: 'enquirygdgoenka@gmail.com',
    to: toEmail,
    subject,
    text,
  };

  const defaultMailOptions = {
    from: 'enquirygdgoenka@gmail.com',
    to: defaultEmail,
    subject: `Copy of: ${subject}`, 
    text,
  };

  try {
    await Promise.all([
      transporter.sendMail(primaryMailOptions),
      transporter.sendMail(defaultMailOptions),
    ]);

    console.log('Both emails sent successfully');
    return res.status(200).send({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.log('Error:', error);
    return res.status(500).send({ success: false, message: 'Emails not sent', error });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
