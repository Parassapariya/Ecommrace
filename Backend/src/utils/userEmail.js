const nodemailer = require('nodemailer');

const sendEmail = async (userEmail, productArray) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MY_EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Prepare product details in text format
  const productDetails = productArray.map((product, index) => {
    return `Product ${index + 1}: ${product.name} - $${product.price} x ${product.quantity}`;
  });

  // Email structure
  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: userEmail,
    subject: 'Order Confirmation',
    text: `Dear Customer,\n\nYour order has been confirmed.\n\nHere are the products you ordered:\n\n${productDetails.join(
      '\n'
    )}\n\nThank you for shopping with us.\n\nBest regards,\nYour Company Name`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
    return true;
  } catch (err) {
    console.error('Error sending email:', err);
    return false;
  }
};

module.exports = sendEmail;
