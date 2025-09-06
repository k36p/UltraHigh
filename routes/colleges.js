const express = require('express');
const router = express.Router();  
const College = require('../models/CourseCollage');   
const messages = require('../config/msg.json');

 
router.post('/colleges', async (req, res) => {
    try {
 
        const { name } = req.body;

  
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: true, message: messages.ar.COLLEGE_NAME_REQUIERD });
        }

 
        const existingCollege = await College.findOne({ name: name.trim() });
        if (existingCollege) {
   
            return res.status(409).json({ error: true, message: messages.ar.COLLEGE_ALREDY_CREATED });
        }

   
        const newCollege = new College({ name: name.trim() });

         
        await newCollege.save();

     
        res.status(201).json({ message: messages.ar.COLLEGE_CREATED_SUCCESFULLY , college: newCollege });

    } catch (err) {
     
        console.error('Error adding college:', err);
  
        res.status(500).json({ error: true, message: messages.ar.COLLEGE_CREATE_FAILED, details: err.message });
    }
});
 
router.get('/colleges', async (req, res) => {
    try {
        const colleges = await College.find();  
        res.json(colleges);  
    } catch (err) {
        console.error('Error fetching colleges:', err);  
        res.status(500).json({ error: true, message: messages.ar.COLLEGE_COLLECT_FROM_SERVER_ERROR });
    }
});


module.exports = router;  