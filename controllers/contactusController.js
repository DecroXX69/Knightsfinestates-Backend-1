const Contactus = require('../models/contactus');  // Import the Contactus model
const nodemailer = require('nodemailer');
const axios = require('axios');  // Import axios for making HTTP requests
const LAMBDA_API_URL = 'https://p7hjkeqa74.execute-api.eu-north-1.amazonaws.com/prod/contactform';
    // Controller for handling the creation of a new contact us message
    exports.createContactus = async (req, res) => {
        try {
            // Destructure the request body
            const { fullname, email, phone, chooseProperty, profession, message } = req.body;

            // Create a new contact us message
            const newContactus = new Contactus({
                fullname,
                email,
                phone,
                chooseProperty,
                profession,
                message
            });

            // Save the new message to the database
            const savedContactus = await newContactus.save();

            // Send email to the desired email address
        const transporter = nodemailer.createTransport({
            service: 'gmail',  // or you can use another email service like Outlook, SendGrid, etc.
            auth: {
                user: 'ajinkya.gajarmal2001@gmail.com',  // Replace with your email address
                pass: 'bssy ikwt fton gxgx',   // Replace with your email password (or app password if 2FA enabled)
            }
        });

        // Prepare the email content
        const mailOptions = {
            from: 'ajinkya.gajarmal2001@gmail.com',
            to: 'knightsfinestates@gmail.com', // Replace with the email address you want to send to
            subject: 'New Contact Us Form Submission',
            text: `New contact message received:

Full Name: ${fullname}
Email: ${email}
Phone: ${phone}
Property Type: ${chooseProperty}
Profession: ${profession}

Message:
${message}`
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

            // Send response with success message and saved data
            res.status(201).json({
                message: 'Contact message created successfully',
                data: savedContactus
            });
        } catch (error) {
            // Handle errors, like validation errors or DB connection issues
            console.error(error);
            res.status(500).json({
                message: 'Error creating contact message',
                error: error.message
            });
        }
    };

    // Controller to get all contact messages (this might be useful for admin panels)
    exports.getAllContactus = async (req, res) => {
        try {
            const contactMessages = await Contactus.find();  // Retrieve all contact messages
            res.status(200).json({
                message: 'All contact messages fetched successfully',
                data: contactMessages
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error fetching contact messages',
                error: error.message
            });
        }
    };

    // Controller to get a single contact message by ID
    exports.getContactusById = async (req, res) => {
        try {
            const contactMessage = await Contactus.findById(req.params.id);  // Find by ID from params
            if (!contactMessage) {
                return res.status(404).json({
                    message: 'Contact message not found'
                });
            }
            res.status(200).json({
                message: 'Contact message fetched successfully',
                data: contactMessage
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error fetching contact message',
                error: error.message
            });
        }
    };

    // Controller to delete a contact message by ID
    exports.deleteContactus = async (req, res) => {
        try {
            const contactMessage = await Contactus.findByIdAndDelete(req.params.id);  // Find by ID and delete
            if (!contactMessage) {
                return res.status(404).json({
                    message: 'Contact message not found'
                });
            }
            res.status(200).json({
                message: 'Contact message deleted successfully',
                data: contactMessage
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error deleting contact message',
                error: error.message
            });
        }
    };


    exports.getAllSubmissions = async (req, res) => {
        try {
          console.log('Making request to Lambda API:', LAMBDA_API_URL);
          
          const response = await axios.get(LAMBDA_API_URL);
          console.log('Lambda API response status:', response.status);
          console.log('Lambda API response data:', JSON.stringify(response.data));
          
          // Check if submissions exist in the response
          const submissions = response.data.submissions || [];
          
          res.status(200).json({
            success: true,
            data: submissions,
            meta: {
              count: submissions.length,
              source: 'lambda'
            }
          });
        } catch (error) {
          console.error('Error fetching submissions:', error.message);
          if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
          }
          
          res.status(500).json({
            success: false,
            message: 'Failed to fetch contact submissions',
            error: error.response?.data || error.message
          });
        }
      };