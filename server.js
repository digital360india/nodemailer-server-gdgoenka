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
    pass: 'xdow wtjs xyos cebt', // Ensure to use environment variables for sensitive data in production
  },
});

app.post('/send-email', async (req, res) => {
  const {
    student_name,
    mobile,
    class: classNum,
    email,
    queryType,
    dob,
    father_name,
    category,
    gender,
    address
  } = req.body;

  // Determine the email recipient based on the queryType
  let toEmail;
  if (queryType === 'admissions') {
    toEmail = 'admissions@gdgoenkadehradun.com';
  } else if (queryType === 'careers') {
    toEmail = 'hr@gdgoenkadehradun.com';
  } else {
    toEmail = 'general_enquiries@gdgoenkadehradun.com';
  }

  // Dynamically build the email content
  let emailContent = `Name: ${student_name}\nMobile: ${mobile}\n ${classNum}\nEmail: ${email}`;

  // Add optional fields if they exist
  if (dob) emailContent += `\nDate of Birth: ${dob}`;
  if (father_name) emailContent += `\nFather's Name: ${father_name}`;
  if (category) emailContent += `\nCategory: ${category}`;
  if (gender) emailContent += `\nGender: ${gender}`;
  if (address) emailContent += `\nAddress: ${address}`;

  const defaultEmail = 'enquirygdgoenka@gmail.com'; // Email to always receive a copy

  const primaryMailOptions = {
    from: 'enquirygdgoenka@gmail.com',
    to: toEmail,
    subject: `Enquiry from ${student_name}`,
    text: emailContent,
  };

  const defaultMailOptions = {
    from: 'enquirygdgoenka@gmail.com',
    to: defaultEmail,
    subject: `Copy of: Enquiry from ${student_name}`,
    text: emailContent,
  };

  try {
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

