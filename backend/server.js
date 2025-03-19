app.post('/send-email', async (req, res) => {
  const { recipient, subject, message } = req.body;

  // Check if the necessary fields are provided
  if (!recipient || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const templateParams = {
    to_email: recipient,
    subject: subject,
    message: message,
  };

  try {
    // Log the email details to ensure proper request formation
    console.log("Sending email with params:", templateParams);

    // Make the request to EmailJS API
    const response = await axios.post(
      `https://api.emailjs.com/api/v1.0/email/send`,
      {
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_USER_ID,
        template_params: templateParams,
      }
    );

    // Check if EmailJS response was successful
    if (response.status === 200) {
      return res.status(200).json({ message: 'Email sent successfully!' });
    } else {
      console.error("EmailJS failed with response:", response.data);
      return res.status(500).json({ error: 'Failed to send email' });
    }
  } catch (error) {
    // Log the full error response
    console.error("Error sending email:", error.response ? error.response.data : error.message);

    return res.status(500).json({
      error: 'Failed to send email',
      message: error.message,
      details: error.response ? error.response.data : null, // Include the response data from EmailJS if available
    });
  }
});
