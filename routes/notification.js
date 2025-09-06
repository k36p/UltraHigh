const express = require('express');
const router = express.Router();   
const multer = require('multer');
const Notify = require('../models/notifications');
const Specialization = require('../models/CourseSpecializations');
const messages = require('../config/msg.json');

var ImageKit = require("imagekit");
var imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 25 * 1024 * 1024, 
    },
});

router.post('/notifications/add',upload.single('mediaFile'), async (req, res) => {
    try { 

       const {content, type, specialization} = req.body;

         let mediaLink = null;
         let specExists = false;

            if(req.file){
                const uploadResult = await imagekit.upload({
                    file: req.file.buffer,
                    fileName: `Midad-${req.file.originalname}`,
                    folder: `university/notificationMedia`,
                    isPrivateFile: false,
                });
                mediaLink = uploadResult.url;
            }

            if(type === 'specialization'){
                specExists = await Specialization.findById(specialization);
                if (!specExists) {
                    return res.status(400).json({message: 'التخصص غير موجود'});
                }
            }

            const newNotification = new Notify({
                    content:content,
                    media: mediaLink,
                    type: type,
                    specialization: specExists._id || null,
                    });
            
            await newNotification.save();

            res.status(200).json({message: 'تم إضافة إشعار بنجاح'});


    } catch (err) {
         console.error('Error adding college:', err); 
         if(err.code === 11000){
            res.status(500).json({message: 'هنالك رسالة حالية من نفس البريد  الألكتروني، إنتظر حتى يتم الرد عليها قبل الإرسال مرة أخرى'});
         }else{
            res.status(500).json({message: 'فشل في إرسال الرسالة، حاول لاحقا'});
         }
      
    }
});
 
router.get('/notifications/all', async (req, res) => {
    let data = await Notify.find({}).sort({createdAt: -1}).populate('specialization').lean();
       res.json(data);
})

module.exports = router; 