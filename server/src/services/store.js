const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// Mongoose Models
const Student = require('../models/Student');
const Administrator = require('../models/Administrator');
const Emergency = require('../models/Emergency');
const EmergencyLog = require('../models/EmergencyLog');
const Responder = require('../models/Responder');
const Location = require('../models/Location');
const Notification = require('../models/Notification');

// Standard Campus Anchor Coordinates
const CAMPUS_LOCATIONS = [
  { name: 'Main Campus Quad', code: 'QUAD', category: 'Academic', latitude: 37.4275, longitude: -122.1697, radiusMeters: 80, securityPostContact: '+1 (555) 019-2834' },
  { name: 'Green Library (2nd Floor)', code: 'LIB2', category: 'Library', latitude: 37.4268, longitude: -122.1662, radiusMeters: 60, securityPostContact: '+1 (555) 019-2835' },
  { name: 'Gates Computer Science Building', code: 'GATES', category: 'Academic', latitude: 37.4300, longitude: -122.1732, radiusMeters: 75, securityPostContact: '+1 (555) 019-2836' },
  { name: 'Hostel Block C (East Residence)', code: 'HOSTEL_C', category: 'Hostel', latitude: 37.4240, longitude: -122.1740, radiusMeters: 90, securityPostContact: '+1 (555) 019-2837' },
  { name: 'Sports & Aquatic Recreation Complex', code: 'SPORTS', category: 'Sports', latitude: 37.4315, longitude: -122.1620, radiusMeters: 120, securityPostContact: '+1 (555) 019-2838' },
  { name: 'Vaden Campus Health Center (Infirmary)', code: 'HEALTH', category: 'Medical', latitude: 37.4230, longitude: -122.1660, radiusMeters: 70, securityPostContact: '+1 (555) 019-9110' },
  { name: 'Campus Safety & Police HQ', code: 'POLICE_HQ', category: 'Security', latitude: 37.4250, longitude: -122.1610, radiusMeters: 100, securityPostContact: '+1 (555) 019-9111' },
];

const INITIAL_RESPONDERS = [
  {
    name: 'Officer Marcus Vance',
    callSign: 'PATROL-ALPHA',
    role: 'Campus Security Patrol',
    phone: '+1 (555) 923-1101',
    vehicleType: 'Quick Patrol EV-1',
    status: 'Available',
    currentLocation: { latitude: 37.4282, longitude: -122.1710, zone: 'West Academic Lawn' },
    activeIncidentId: null,
  },
  {
    name: 'Officer Priya Sharma',
    callSign: 'PATROL-BRAVO',
    role: 'Campus Security Patrol',
    phone: '+1 (555) 923-1102',
    vehicleType: 'Patrol Buggy-2',
    status: 'Available',
    currentLocation: { latitude: 37.4255, longitude: -122.1675, zone: 'Central Library Walk' },
    activeIncidentId: null,
  },
  {
    name: 'Paramedic Dr. Jason Lee',
    callSign: 'MEDIC-ONE',
    role: 'Rapid Medical Response',
    phone: '+1 (555) 923-1103',
    vehicleType: 'Campus Mobile Intensive Unit',
    status: 'Available',
    currentLocation: { latitude: 37.4232, longitude: -122.1663, zone: 'Health Center Base' },
    activeIncidentId: null,
  },
  {
    name: 'Nurse Ellen Rodriguez',
    callSign: 'MEDIC-TWO',
    role: 'Rapid Medical Response',
    phone: '+1 (555) 923-1104',
    vehicleType: 'Rapid Response Cart',
    status: 'Available',
    currentLocation: { latitude: 37.4290, longitude: -122.1640, zone: 'North Recreation Infirmary' },
    activeIncidentId: null,
  },
  {
    name: 'Dispatcher Sarah Jenkins',
    callSign: 'DISPATCH-LEAD',
    role: 'Administration Dispatch',
    phone: '+1 (555) 923-1100',
    vehicleType: 'Command Center Console',
    status: 'Available',
    currentLocation: { latitude: 37.4250, longitude: -122.1610, zone: 'Emergency Operations Center' },
    activeIncidentId: null,
  }
];

class UnifiedDataStore {
  constructor() {
    this.students = [];
    this.admins = [];
    this.emergencies = [];
    this.emergencyLogs = [];
    this.responders = [...INITIAL_RESPONDERS.map((r, i) => ({ _id: `resp-${i+1}`, ...r }))];
    this.locations = [...CAMPUS_LOCATIONS.map((l, i) => ({ id: `loc-${i+1}`, ...l }))];
    this.notifications = [];
    this.initialized = false;
  }

  isMongoActive() {
    return mongoose.connection.readyState === 1;
  }

  async init() {
    if (this.initialized) return;

    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    // Initial Students
    const defaultStudents = [
      {
        _id: 'std-1',
        name: 'Alex Rivera',
        studentId: 'STU-2024-8841',
        email: 'alex.rivera@campus.edu',
        password: hashedPassword,
        mobile: '+1 (555) 438-9921',
        emergencyContactName: 'Elena Rivera (Mother)',
        emergencyContactNumber: '+1 (555) 993-4412',
        department: 'Computer Science & AI',
        year: '3rd Year',
        hostelOrDayScholar: 'Hostel Block C',
        bloodGroup: 'O+',
        medicalConditions: 'Severe Penicillin Allergy • Mild Exercise-Induced Asthma (Carries Inhaler)',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        role: 'student',
        createdAt: new Date(),
      },
      {
        _id: 'std-2',
        name: 'Samantha Chen',
        studentId: 'STU-2023-7729',
        email: 'samantha.chen@campus.edu',
        password: hashedPassword,
        mobile: '+1 (555) 234-8890',
        emergencyContactName: 'David Chen (Father)',
        emergencyContactNumber: '+1 (555) 771-0021',
        department: 'Biomedical Engineering',
        year: '4th Year',
        hostelOrDayScholar: 'Hostel Block A',
        bloodGroup: 'A+',
        medicalConditions: 'Type 1 Diabetes (CGM wearer)',
        profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        role: 'student',
        createdAt: new Date(),
      },
      {
        _id: 'std-3',
        name: 'Liam Martinez',
        studentId: 'STU-2025-1044',
        email: 'liam.m@campus.edu',
        password: hashedPassword,
        mobile: '+1 (555) 876-1234',
        emergencyContactName: 'Carlos Martinez (Brother)',
        emergencyContactNumber: '+1 (555) 432-8765',
        department: 'Electrical Engineering',
        year: '2nd Year',
        hostelOrDayScholar: 'Day Scholar',
        bloodGroup: 'B-',
        medicalConditions: 'None reported / Healthy',
        profilePhoto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
        role: 'student',
        createdAt: new Date(),
      }
    ];

    // Initial Administrators
    const defaultAdmins = [
      {
        _id: 'adm-1',
        name: 'Chief Sarah Jenkins',
        email: 'admin@campussos.edu',
        password: hashedAdminPassword,
        badgeNumber: 'CAMPUS-CHIEF-01',
        role: 'Chief Security Officer',
        department: 'Campus Safety & Emergency Operations Center',
        phone: '+1 (555) 911-0101',
        createdAt: new Date(),
      },
      {
        _id: 'adm-2',
        name: 'Dr. Arthur Vance',
        email: 'medical.head@campussos.edu',
        password: hashedAdminPassword,
        badgeNumber: 'MED-CHIEF-04',
        role: 'Medical Response Officer',
        department: 'Student Health & Urgent Care',
        phone: '+1 (555) 911-0102',
        createdAt: new Date(),
      }
    ];

    this.students = [...defaultStudents];
    this.admins = [...defaultAdmins];

    // Sync to MongoDB if connected
    if (this.isMongoActive()) {
      try {
        for (const s of defaultStudents) {
          const { _id, ...studentDoc } = s;
          await Student.findOneAndUpdate(
            { email: studentDoc.email },
            { $set: studentDoc },
            { upsert: true, returnDocument: 'after' }
          );
        }

        for (const a of defaultAdmins) {
          const { _id, ...adminDoc } = a;
          await Administrator.findOneAndUpdate(
            { email: adminDoc.email },
            { $set: adminDoc },
            { upsert: true, returnDocument: 'after' }
          );
        }

        for (const l of CAMPUS_LOCATIONS) {
          await Location.findOneAndUpdate(
            { code: l.code },
            { $set: l },
            { upsert: true, returnDocument: 'after' }
          );
        }

        for (const r of INITIAL_RESPONDERS) {
          await Responder.findOneAndUpdate(
            { callSign: r.callSign },
            { $set: r },
            { upsert: true, returnDocument: 'after' }
          );
        }
        console.log(`🗄️ [MongoDB] Successfully seeded collections: students, administrators, responders, locations.`);
      } catch (mongoErr) {
        console.warn('MongoDB Seed Sync Note:', mongoErr.message);
      }
    }

    this.initialized = true;
    console.log(`🚀 [Store] Store Active. Students: ${this.students.length}, Admins: ${this.admins.length}, Responders: ${this.responders.length}`);
  }

  // Student Operations
  async findStudentByEmail(email) {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const doc = await Student.findOne({ email: email.toLowerCase() });
        if (doc) return doc.toObject();
      } catch (e) {}
    }
    return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  async findStudentById(id) {
    await this.init();
    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await Student.findById(id);
        if (doc) return doc.toObject();
      } catch (e) {}
    }
    return this.students.find(s => s._id.toString() === id.toString() || s.studentId === id);
  }

  async createStudent(data) {
    await this.init();
    let created = {
      _id: `std-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };

    if (this.isMongoActive()) {
      try {
        const doc = await Student.create(data);
        created = doc.toObject();
      } catch (e) {
        console.warn('Mongo create student note:', e.message);
      }
    }

    this.students.push(created);
    return created;
  }

  async getAllStudents() {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const docs = await Student.find({}, '-password');
        if (docs.length > 0) return docs;
      } catch (e) {}
    }
    return this.students.map(({ password, ...rest }) => rest);
  }

  // Admin Operations
  async findAdminByEmail(email) {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const doc = await Administrator.findOne({ email: email.toLowerCase() });
        if (doc) return doc.toObject();
      } catch (e) {}
    }
    return this.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  async findAdminById(id) {
    await this.init();
    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await Administrator.findById(id);
        if (doc) return doc.toObject();
      } catch (e) {}
    }
    return this.admins.find(a => a._id.toString() === id.toString());
  }

  // Emergency Operations
  async createEmergency(emergencyData) {
    await this.init();
    let created = {
      _id: `emg-${Date.now()}`,
      ...emergencyData,
      timestamps: {
        triggeredAt: new Date(),
        ...emergencyData.timestamps,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (this.isMongoActive()) {
      try {
        const doc = await Emergency.create(emergencyData);
        created = doc.toObject();
      } catch (e) {
        console.warn('Mongo create emergency note:', e.message);
      }
    }

    this.emergencies.unshift(created);
    await this.addEmergencyLog(created._id, 'SOS_TRIGGERED', created.studentSnapshot?.name || 'Student', {
      location: created.location,
      priority: created.priority,
    });

    return created;
  }

  async getAllEmergencies() {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const docs = await Emergency.find().sort({ createdAt: -1 });
        if (docs.length > 0) return docs;
      } catch (e) {}
    }
    return this.emergencies;
  }

  async getEmergencyById(id) {
    await this.init();
    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await Emergency.findById(id);
        if (doc) return doc.toObject();
      } catch (e) {}
    }
    return this.emergencies.find(e => e._id.toString() === id.toString());
  }

  async updateEmergency(id, updateData) {
    await this.init();
    const index = this.emergencies.findIndex(e => e._id.toString() === id.toString());
    
    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        const doc = await Emergency.findByIdAndUpdate(id, { $set: updateData }, { new: true });
        if (doc) {
          const updatedObj = doc.toObject();
          if (index !== -1) this.emergencies[index] = updatedObj;
          return updatedObj;
        }
      } catch (e) {}
    }

    if (index === -1) return null;
    this.emergencies[index] = {
      ...this.emergencies[index],
      ...updateData,
      updatedAt: new Date(),
    };
    return this.emergencies[index];
  }

  async addEmergencyLog(emergencyId, action, performedBy, details = {}) {
    await this.init();
    const log = {
      _id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      emergencyId,
      action,
      performedBy,
      details,
      timestamp: new Date(),
    };

    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(emergencyId)) {
      try {
        await EmergencyLog.create({ emergencyId, action, performedBy, details });
      } catch (e) {}
    }

    this.emergencyLogs.push(log);
    return log;
  }

  async getEmergencyLogs(emergencyId) {
    await this.init();
    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(emergencyId)) {
      try {
        const docs = await EmergencyLog.find({ emergencyId }).sort({ timestamp: 1 });
        if (docs.length > 0) return docs;
      } catch (e) {}
    }
    return this.emergencyLogs.filter(l => l.emergencyId.toString() === emergencyId.toString());
  }

  // Responders
  async getAllResponders() {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const docs = await Responder.find();
        if (docs.length > 0) return docs;
      } catch (e) {}
    }
    return this.responders;
  }

  async updateResponderStatus(id, status, activeIncidentId = null) {
    await this.init();
    const responder = this.responders.find(r => r._id.toString() === id.toString());
    if (responder) {
      responder.status = status;
      responder.activeIncidentId = activeIncidentId;
    }
    if (this.isMongoActive() && mongoose.Types.ObjectId.isValid(id)) {
      try {
        await Responder.findByIdAndUpdate(id, { $set: { status, activeIncidentId } });
      } catch (e) {}
    }
    return responder;
  }

  // Locations & Geofences
  async getAllLocations() {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const docs = await Location.find();
        if (docs.length > 0) return docs;
      } catch (e) {}
    }
    return this.locations;
  }

  // Notifications
  async createNotification(data) {
    await this.init();
    const notif = {
      _id: `notif-${Date.now()}`,
      ...data,
      isRead: false,
      createdAt: new Date(),
    };
    if (this.isMongoActive()) {
      try {
        await Notification.create(data);
      } catch (e) {}
    }
    this.notifications.unshift(notif);
    return notif;
  }

  async getNotifications() {
    await this.init();
    if (this.isMongoActive()) {
      try {
        const docs = await Notification.find().sort({ createdAt: -1 }).limit(50);
        if (docs.length > 0) return docs;
      } catch (e) {}
    }
    return this.notifications.slice(0, 50);
  }
}

const store = new UnifiedDataStore();
module.exports = store;
