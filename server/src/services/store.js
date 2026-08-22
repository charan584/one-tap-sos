const bcrypt = require('bcryptjs');

// Standard Campus Anchor Coordinates (Stanford-inspired layout)
// Center: Lat 37.4275, Lng -122.1697
const CAMPUS_LOCATIONS = [
  { id: 'loc-1', name: 'Main Campus Quad', code: 'QUAD', category: 'Academic', latitude: 37.4275, longitude: -122.1697, radiusMeters: 80, securityPostContact: '+1 (555) 019-2834' },
  { id: 'loc-2', name: 'Green Library (2nd Floor)', code: 'LIB2', category: 'Library', latitude: 37.4268, longitude: -122.1662, radiusMeters: 60, securityPostContact: '+1 (555) 019-2835' },
  { id: 'loc-3', name: 'Gates Computer Science Building', code: 'GATES', category: 'Academic', latitude: 37.4300, longitude: -122.1732, radiusMeters: 75, securityPostContact: '+1 (555) 019-2836' },
  { id: 'loc-4', name: 'Hostel Block C (East Residence)', code: 'HOSTEL_C', category: 'Hostel', latitude: 37.4240, longitude: -122.1740, radiusMeters: 90, securityPostContact: '+1 (555) 019-2837' },
  { id: 'loc-5', name: 'Sports & Aquatic Recreation Complex', code: 'SPORTS', category: 'Sports', latitude: 37.4315, longitude: -122.1620, radiusMeters: 120, securityPostContact: '+1 (555) 019-2838' },
  { id: 'loc-6', name: 'Vaden Campus Health Center (Infirmary)', code: 'HEALTH', category: 'Medical', latitude: 37.4230, longitude: -122.1660, radiusMeters: 70, securityPostContact: '+1 (555) 019-9110' },
  { id: 'loc-7', name: 'Campus Safety & Police HQ', code: 'POLICE_HQ', category: 'Security', latitude: 37.4250, longitude: -122.1610, radiusMeters: 100, securityPostContact: '+1 (555) 019-9111' },
];

const INITIAL_RESPONDERS = [
  {
    _id: 'resp-1',
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
    _id: 'resp-2',
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
    _id: 'resp-3',
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
    _id: 'resp-4',
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
    _id: 'resp-5',
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

class MemoryStore {
  constructor() {
    this.students = [];
    this.admins = [];
    this.emergencies = [];
    this.emergencyLogs = [];
    this.responders = [...INITIAL_RESPONDERS];
    this.locations = [...CAMPUS_LOCATIONS];
    this.notifications = [];
    this.initialized = false;
  }

  async init() {
    if (this.initialized) return;

    const hashedPassword = await bcrypt.hash('password123', 10);
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);

    // Pre-seeded Students
    this.students = [
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
        createdAt: new Date('2025-01-10T08:00:00Z'),
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
        createdAt: new Date('2025-02-14T09:30:00Z'),
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
        createdAt: new Date('2025-03-01T11:00:00Z'),
      }
    ];

    // Pre-seeded Administrators
    this.admins = [
      {
        _id: 'adm-1',
        name: 'Chief Sarah Jenkins',
        email: 'admin@campussos.edu',
        password: hashedAdminPassword,
        badgeNumber: 'CAMPUS-CHIEF-01',
        role: 'Chief Security Officer',
        department: 'Campus Safety & Emergency Operations Center',
        phone: '+1 (555) 911-0101',
        createdAt: new Date('2024-01-01T00:00:00Z'),
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
        createdAt: new Date('2024-01-01T00:00:00Z'),
      }
    ];

    // Pre-seeded Sample Historical Emergency for rich analytics display
    this.emergencies = [
      {
        _id: 'emg-demo-hist-1',
        student: 'std-2',
        studentSnapshot: {
          name: 'Samantha Chen',
          studentId: 'STU-2023-7729',
          email: 'samantha.chen@campus.edu',
          mobile: '+1 (555) 234-8890',
          emergencyContactName: 'David Chen (Father)',
          emergencyContactNumber: '+1 (555) 771-0021',
          department: 'Biomedical Engineering',
          year: '4th Year',
          hostelOrDayScholar: 'Hostel Block A',
          bloodGroup: 'A+',
          medicalConditions: 'Type 1 Diabetes (CGM wearer)',
          profilePhoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
        },
        location: {
          latitude: 37.4268,
          longitude: -122.1662,
          accuracy: 4,
          zone: 'Green Library (2nd Floor)',
          address: '571 Escondido Mall, Stanford, CA',
          googleMapsUrl: 'https://maps.google.com/?q=37.4268,-122.1662',
        },
        status: 'Resolved',
        priority: 'High',
        assignedResponders: [
          {
            responderId: 'resp-2',
            name: 'Officer Priya Sharma',
            role: 'Campus Security Patrol',
            callSign: 'PATROL-BRAVO',
            phone: '+1 (555) 923-1102',
            status: 'Completed',
            assignedAt: new Date(Date.now() - 3600000 * 24),
            etaMinutes: 2,
          },
          {
            responderId: 'resp-3',
            name: 'Paramedic Dr. Jason Lee',
            role: 'Rapid Medical Response',
            callSign: 'MEDIC-ONE',
            phone: '+1 (555) 923-1103',
            status: 'Completed',
            assignedAt: new Date(Date.now() - 3600000 * 24),
            etaMinutes: 3,
          }
        ],
        assignedOfficer: {
          id: 'adm-1',
          name: 'Chief Sarah Jenkins',
          badgeNumber: 'CAMPUS-CHIEF-01',
          role: 'Chief Security Officer',
        },
        timestamps: {
          triggeredAt: new Date(Date.now() - 3600000 * 24),
          acceptedAt: new Date(Date.now() - 3600000 * 24 + 18000),
          onRouteAt: new Date(Date.now() - 3600000 * 24 + 45000),
          arrivedAt: new Date(Date.now() - 3600000 * 24 + 120000),
          resolvedAt: new Date(Date.now() - 3600000 * 24 + 900000),
        },
        resolutionNotes: 'Hypoglycemia event treated with glucose oral gel by Paramedic Lee. Student vitals stabilized and escorted to dorm.',
        resolvedBy: 'Chief Sarah Jenkins',
        locationHistory: [
          { latitude: 37.4268, longitude: -122.1662, accuracy: 4, timestamp: new Date(Date.now() - 3600000 * 24) }
        ],
        createdAt: new Date(Date.now() - 3600000 * 24),
        updatedAt: new Date(Date.now() - 3600000 * 24 + 900000),
      }
    ];

    this.initialized = true;
    console.log(`🚀 [Store] Memory Store Initialized with ${this.students.length} students, ${this.admins.length} admins, ${this.responders.length} responders.`);
  }

  // Student Methods
  async findStudentByEmail(email) {
    await this.init();
    return this.students.find(s => s.email.toLowerCase() === email.toLowerCase());
  }

  async findStudentById(id) {
    await this.init();
    return this.students.find(s => s._id === id || s.studentId === id);
  }

  async createStudent(data) {
    await this.init();
    const newStudent = {
      _id: `std-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    this.students.push(newStudent);
    return newStudent;
  }

  async getAllStudents() {
    await this.init();
    return this.students.map(({ password, ...rest }) => rest);
  }

  // Admin Methods
  async findAdminByEmail(email) {
    await this.init();
    return this.admins.find(a => a.email.toLowerCase() === email.toLowerCase());
  }

  async findAdminById(id) {
    await this.init();
    return this.admins.find(a => a._id === id);
  }

  async createAdmin(data) {
    await this.init();
    const newAdmin = {
      _id: `adm-${Date.now()}`,
      ...data,
      createdAt: new Date(),
    };
    this.admins.push(newAdmin);
    return newAdmin;
  }

  // Emergency Methods
  async createEmergency(emergencyData) {
    await this.init();
    const newEmergency = {
      _id: `emg-${Date.now()}`,
      ...emergencyData,
      timestamps: {
        triggeredAt: new Date(),
        ...emergencyData.timestamps,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.emergencies.unshift(newEmergency);

    // Create Audit Log
    this.emergencyLogs.push({
      _id: `log-${Date.now()}`,
      emergencyId: newEmergency._id,
      action: 'SOS_TRIGGERED',
      performedBy: newEmergency.studentSnapshot?.name || 'Student',
      details: {
        location: newEmergency.location,
        priority: newEmergency.priority,
      },
      timestamp: new Date(),
    });

    return newEmergency;
  }

  async getAllEmergencies() {
    await this.init();
    return this.emergencies;
  }

  async getActiveEmergencies() {
    await this.init();
    return this.emergencies.filter(e => ['Pending', 'Accepted', 'On Route', 'Arrived'].includes(e.status));
  }

  async getEmergencyById(id) {
    await this.init();
    return this.emergencies.find(e => e._id === id);
  }

  async updateEmergency(id, updateData) {
    await this.init();
    const index = this.emergencies.findIndex(e => e._id === id);
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
    this.emergencyLogs.push(log);
    return log;
  }

  async getEmergencyLogs(emergencyId) {
    await this.init();
    return this.emergencyLogs.filter(l => l.emergencyId === emergencyId);
  }

  // Responder Methods
  async getAllResponders() {
    await this.init();
    return this.responders;
  }

  async updateResponderStatus(id, status, activeIncidentId = null) {
    await this.init();
    const responder = this.responders.find(r => r._id === id);
    if (responder) {
      responder.status = status;
      responder.activeIncidentId = activeIncidentId;
    }
    return responder;
  }

  // Location / Geofence Methods
  async getAllLocations() {
    await this.init();
    return this.locations;
  }

  // Notification Methods
  async createNotification(data) {
    await this.init();
    const notif = {
      _id: `notif-${Date.now()}`,
      ...data,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.unshift(notif);
    return notif;
  }

  async getNotifications() {
    await this.init();
    return this.notifications.slice(0, 50);
  }

  async markNotificationRead(id) {
    await this.init();
    const notif = this.notifications.find(n => n._id === id);
    if (notif) notif.isRead = true;
    return notif;
  }
}

const store = new MemoryStore();
module.exports = store;
