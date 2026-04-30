const mongoose = require('mongoose');

const aiDataSchema = new mongoose.Schema({
    header: {
        device_id: String,
        timestamp: Date,
        location: {
            type:{
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            },
        }
    },
    detections:{
        fire_analysis: {
            detected: Boolean,
            confidence: Number,
            danger_level: String,
            incident_image_url :String ,
            priority: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH' , 'CRITICAL']
            }
        },
        weapon_analysis: {
            detected: Boolean,
            items: [String],
            confidence: Number,
            incident_image_url :String ,
            priority: {
                type: String,
                enum: ['LOW', 'MEDIUM', 'HIGH' , 'CRITICAL']
            },
        },
        behavior_analysis: {
            theft_detection:{
                alert: Boolean,
                confidence: Number,
                incident_image_url :String ,
                priority: {
                    type: String,
                    enum: ['LOW', 'MEDIUM', 'HIGH' , 'CRITICAL']
                }
            },
            crowd_management:{
                count: Number,
                is_crowded: Boolean,
                threshold: Number,
                incident_image_url :String ,
                priority: {
                    type: String,
                    enum: ['LOW', 'MEDIUM', 'HIGH' , 'CRITICAL']
                },
            },
            medical_emergency:{
                person_down: Boolean,
                status: String,
                incident_image_url :String ,
                priority: {
                    type: String,
                    enum: ['LOW', 'MEDIUM', 'HIGH' , 'CRITICAL']
                }
            }
        }
    },
    system_action:{
        priority_score: Number,
        trigger_alarm: Boolean,
        notification_target: {
            type:[String],
            enum: ['security_team', 'fire_department', 'medical_services', 'public_alert']
        }
    },
    timeStamp: {
        type: Date,
        default: Date.now
    }
});

const AiData = mongoose.model('AiData', aiDataSchema);

module.exports = AiData;