const express = require('express');
const router = express.Router();
const Specialization = require('../models/CourseSpecializations') 
const College = require('../models/CourseCollage');  
const messages = require('../config/msg.json');

router.post('/specializations', async (req, res) => {
    try {
        const { name, collegeId } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: true, message: messages.ar.SPECIALIZATION_NAME_REQUIERD });
        }
        if (!collegeId || collegeId.trim() === '') {
            return res.status(400).json({ error: true, message: messages.ar.SPECIALIZATION_COLLEGE_REQUIERD });
        }

        const existingCollege = await College.findById(collegeId);
        if (!existingCollege) {
            return res.status(404).json({ error: true, message: messages.ar.UNDEFIEND_COLLEGE });
        }

         const existingSpecialization = await Specialization.findOne({ name: name.trim() });
         if (existingSpecialization) {
             return res.status(409).json({ error: true, message: messages.ar.SPECIALIZATION_ALREDY_CREATED });
         }

        const newSpecialization = new Specialization({
            name: name.trim(),
            college: collegeId  
        });
 
        await newSpecialization.save();
 
        res.status(201).json({ message: messages.ar.SPECIALIZATION_CREATED_SUCCESFULLY, specialization: newSpecialization });

    } catch (err) {
        console.error('Error adding specialization:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: true, message: err.message });
        }
        res.status(500).json({ error: true, message: messages.ar.SPECIALIZATION_FAILD_CREATE, details: err.message });
    }
});

router.get('/specializations/all', async (req, res) => {
    try {
        
        const specializations = await Specialization.find({}).lean(); 
        res.json(specializations); 

    } catch (err) {
        console.error('Error fetching all specializations:', err);
        res.status(500).json({ error: true, message: messages.ar.SPECIALIZATION_COLLECT_FROM_SERVER_ERROR });
    }
});


router.get('/specializations/:college', async (req, res) => {
    try {

        const collegeId = req.params.college;
    
        const specializations = await Specialization.find({ college: collegeId }).lean();

        if (specializations.length === 0) {
            return res.status(404).json({ message: 'No specializations found for this college.' });
        }
        
        res.json(specializations);

    } catch (err) {
        console.error('Error fetching specializations for college:', err);
        res.status(500).json({ error: true, message: 'An error occurred while fetching specializations.' });
    }
});

module.exports = router;