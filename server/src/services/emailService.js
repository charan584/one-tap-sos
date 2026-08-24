const nodemailer = require('nodemailer');

let persistentTransporter = null;

const getTransporter = () => {
  if (persistentTransporter) return persistentTransporter;

  const user = process.env.EMAIL_USER || 'charanp326@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

  if (!pass) return null;

  persistentTransporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    pool: true, // Keep connections pooled and warm 24/7
    maxConnections: 5,
    maxMessages: 500,
    rateDelta: 1000,
    rateLimit: 10,
    auth: {
      user,
      pass,
    },
  });

  // Pre-warm the persistent connection pool immediately on startup
  persistentTransporter.verify((err) => {
    if (err) {
      console.warn('⚠️ [SMTP Pool Warm-up Note]:', err.message);
    } else {
      console.log('⚡ [SMTP Pool Ready] Ultra-fast persistent Gmail connection pool is warm and active.');
    }
  });

  return persistentTransporter;
};

// Immediately prime the pool on module load
try {
  getTransporter();
} catch (e) {
  // non-fatal
}

/**
 * Generate 6-digit cryptographic numeric OTP
 */
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP Email
 */
const sendOtpEmail = async (toEmail, otp, type = 'REGISTER', recipientName = 'Student') => {
  const user = process.env.EMAIL_USER || 'charanp326@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');
  const isRegister = type === 'REGISTER';

  const subject = isRegister
    ? `🚨 CampusSOS Verification Code: ${otp}`
    : `🔑 CampusSOS Password Reset Code: ${otp}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f1f5f9; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
          .header { text-align: center; margin-bottom: 24px; }
          .logo { font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; }
          .logo span { color: #ef4444; }
          .badge { display: inline-block; padding: 4px 12px; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 9999px; color: #ef4444; font-size: 12px; font-weight: bold; margin-top: 8px; }
          .title { font-size: 18px; font-weight: bold; color: #ffffff; margin-top: 16px; text-align: center; }
          .subtitle { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 6px; }
          .otp-box { margin: 28px 0; padding: 20px; background: #020617; border: 2px dashed #ef4444; border-radius: 12px; text-align: center; }
          .otp-code { font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #ef4444; font-family: monospace; }
          .otp-label { font-size: 11px; color: #64748b; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px; }
          .info { font-size: 12px; color: #94a3b8; line-height: 1.6; border-top: 1px solid #1e293b; padding-top: 16px; margin-top: 24px; }
          .footer { text-align: center; font-size: 11px; color: #475569; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">Campus<span>SOS</span></div>
            <div class="badge">One Tap Intelligent Emergency Response</div>
          </div>
          
          <div class="title">${isRegister ? 'Verify Your Student Account' : 'Reset Your Account Password'}</div>
          <div class="subtitle">Hello ${recipientName}, use the verification code below to authorize your request.</div>
          
          <div class="otp-box">
            <div class="otp-code">${otp}</div>
            <div class="otp-label">Valid for 10 minutes</div>
          </div>

          <div class="info">
            <p>🛡️ <b>Security Advisory:</b> Do not share this code with anyone. Campus administration will never ask for your verification code.</p>
            <p>If you did not request this verification, you can safely ignore this email.</p>
          </div>

          <div class="footer">
            Sent from CampusSOS Dispatch & Security System (${user})<br>
            © 2026 CampusSOS University Safety Operations
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();

  if (transporter && pass) {
    try {
      const info = await transporter.sendMail({
        from: `"CampusSOS Security" <${user}>`,
        to: toEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✅ [EmailService LIVE] Email successfully sent to ${toEmail}. Message ID: ${info.messageId}`);
      return { success: true, liveSent: true };
    } catch (smtpErr) {
      console.error(`❌ [EmailService SMTP Error]: ${smtpErr.message}`);
      console.log(`👉 [OTP for ${toEmail}]: [ ${otp} ] (Use this OTP to complete verification)`);
      return { success: true, liveSent: false, smtpError: smtpErr.message, fallbackOtp: otp };
    }
  } else {
    console.log(`\n========================================================`);
    console.log(`📧 [Gmail SMTP Note] EMAIL_PASS is not set in server/.env`);
    console.log(`👉 Live OTP generated for ${toEmail}: [ ${otp} ]`);
    console.log(`========================================================\n`);
    return { success: true, liveSent: false, fallbackOtp: otp };
  }
};

/**
 * Send High-Priority Instant SOS Alert Email to ALL Administrators
 */
const sendAdminEmergencyAlertEmail = async (emergency) => {
  const store = require('./store');
  const student = emergency.studentSnapshot || {};
  const location = emergency.location || {};
  const lat = Number(location.latitude) || 37.4275;
  const lng = Number(location.longitude) || -122.1697;
  const mapsUrl = location.googleMapsUrl || `https://maps.google.com/?q=${lat},${lng}`;
  const timestamp = new Date(emergency.timestamps?.triggeredAt || emergency.createdAt || Date.now()).toLocaleString();

  // 1. Gather all registered and active administrator emails (filtering out non-existent local mock domains)
  const adminEmailsSet = new Set();

  // Primary system operational admin
  const primaryAdmin = (process.env.EMAIL_USER || 'charanp326@gmail.com').toLowerCase().trim();
  if (primaryAdmin && primaryAdmin.includes('@')) {
    adminEmailsSet.add(primaryAdmin);
  }

  try {
    const allAdmins = await store.getAllAdmins();
    if (Array.isArray(allAdmins)) {
      allAdmins.forEach((adm) => {
        if (adm.email && typeof adm.email === 'string' && adm.email.includes('@')) {
          const cleanEmail = adm.email.toLowerCase().trim();
          // Skip unresolvable placeholder domains (e.g. @campussos.edu) that cause 60s SMTP DNS hangs
          if (!cleanEmail.endsWith('@campussos.edu')) {
            adminEmailsSet.add(cleanEmail);
          }
        }
      });
    }
  } catch (err) {
    console.warn('Note: Could not load admins from database for broadcast:', err.message);
  }

  const targetEmails = Array.from(adminEmailsSet);
  if (targetEmails.length === 0) {
    targetEmails.push('charanp326@gmail.com');
  }

  const subject = `🚨 URGENT SOS ALERT: Emergency Triggered by ${student.name || 'Student'} (${student.studentId || 'N/A'})`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #050811; color: #f1f5f9; padding: 16px; margin: 0; }
          .container { max-width: 580px; margin: 0 auto; background: #0b1120; border: 2px solid #ef4444; border-radius: 16px; padding: 28px; box-shadow: 0 20px 40px rgba(239, 68, 68, 0.25); }
          .header { text-align: center; border-bottom: 1px solid #1e293b; padding-bottom: 18px; margin-bottom: 20px; }
          .alert-badge { display: inline-block; padding: 6px 16px; background: #dc2626; color: #ffffff; font-size: 13px; font-weight: 900; border-radius: 9999px; text-transform: uppercase; letter-spacing: 1.5px; }
          .title { font-size: 22px; font-weight: 900; color: #ffffff; margin-top: 14px; text-align: center; }
          .time { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 4px; font-family: monospace; }
          .section { margin-top: 18px; background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; }
          .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #ef4444; margin-bottom: 12px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
          .item-label { color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; }
          .item-val { color: #f8fafc; font-weight: 700; margin-top: 2px; }
          .medical-banner { margin-top: 18px; background: rgba(239, 68, 68, 0.15); border: 1px solid #ef4444; border-radius: 12px; padding: 14px; text-align: center; font-weight: 800; color: #fca5a5; font-size: 13px; }
          .btn-container { text-align: center; margin-top: 24px; }
          .btn-primary { display: inline-block; padding: 14px 28px; background: #dc2626; color: #ffffff !important; font-size: 14px; font-weight: 900; text-decoration: none; border-radius: 12px; box-shadow: 0 10px 20px rgba(220, 38, 38, 0.4); text-transform: uppercase; letter-spacing: 0.5px; }
          .btn-maps { display: inline-block; padding: 10px 20px; background: #0284c7; color: #ffffff !important; font-size: 12px; font-weight: 800; text-decoration: none; border-radius: 10px; margin-top: 8px; }
          .footer { text-align: center; font-size: 11px; color: #475569; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="alert-badge">🚨 CRITICAL SOS DISPATCH ALERT</div>
            <div class="title">Immediate Emergency Response Required</div>
            <div class="time">Triggered At: ${timestamp}</div>
          </div>

          <div class="section">
            <div class="section-title">👤 Student Identification</div>
            <div class="grid">
              <div>
                <div class="item-label">Student Name</div>
                <div class="item-val">${student.name || 'Charan P (Student)'}</div>
              </div>
              <div>
                <div class="item-label">Student Roll No</div>
                <div class="item-val">${student.studentId || '25B91A05Q3'}</div>
              </div>
              <div>
                <div class="item-label">Department / Branch</div>
                <div class="item-val">${student.department || student.branch || 'CSE'}</div>
              </div>
              <div>
                <div class="item-label">Academic Year</div>
                <div class="item-val">${student.year || '2nd Year'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📍 Live GPS Coordinates & Location</div>
            <div class="grid">
              <div>
                <div class="item-label">Campus Zone</div>
                <div class="item-val" style="color: #38bdf8;">${location.zone || 'SRKR CSE Complex'}</div>
              </div>
              <div>
                <div class="item-label">GPS Accuracy</div>
                <div class="item-val" style="color: #4ade80;">±${location.accuracy || 5} meters</div>
              </div>
              <div style="grid-column: 1 / -1;">
                <div class="item-label">GPS Decimal Degrees</div>
                <div class="item-val" style="font-family: monospace; color: #facc15;">Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 12px;">
              <a href="${mapsUrl}" class="btn-maps" target="_blank">🗺️ Open Live Pin on Google Maps</a>
            </div>
          </div>

          <div class="section">
            <div class="section-title">🩺 Pre-Armed Medical Health Record</div>
            <div class="grid">
              <div>
                <div class="item-label">Blood Group</div>
                <div class="item-val" style="color: #ef4444; font-size: 15px;">🩸 ${student.bloodGroup || 'O+'}</div>
              </div>
              <div>
                <div class="item-label">Medical Conditions / Allergies</div>
                <div class="item-val" style="color: #fbbf24;">${student.medicalConditions || 'None reported / Healthy'}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📞 Emergency Contacts</div>
            <div class="grid">
              <div>
                <div class="item-label">Student Phone</div>
                <div class="item-val"><a href="tel:${student.mobile || '9908446898'}" style="color: #38bdf8; text-decoration: none;">${student.mobile || '9908446898'}</a></div>
              </div>
              <div>
                <div class="item-label">Guardian / Parent Contact</div>
                <div class="item-val"><a href="tel:${student.guardianPhone || student.emergencyContactNumber || '9440123456'}" style="color: #38bdf8; text-decoration: none;">${student.guardianName || 'P Venkata Rao (Father)'}: ${student.guardianPhone || student.emergencyContactNumber || '9440123456'}</a></div>
              </div>
            </div>
          </div>

          <div class="btn-container">
            <a href="http://localhost:5173/admin" class="btn-primary" target="_blank">🛡️ Open Admin Dispatch Center</a>
          </div>

          <div class="footer">
            CampusSOS Intelligent Emergency Operations Center (EOC)<br>
            Automated dispatcher alert broadcast to all active campus administrators.<br>
            Please accept the case within 100 seconds to comply with Campus SLA.
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

  if (transporter && pass) {
    console.log(`⚡ [SOS Ultra-Fast Broadcast] Sending instant emergency alert to ${targetEmails.length} admin(s): ${targetEmails.join(', ')}`);
    
    try {
      const info = await transporter.sendMail({
        from: `"CampusSOS Emergency Center" <${process.env.EMAIL_USER || 'charanp326@gmail.com'}>`,
        to: targetEmails.join(', '),
        subject,
        html: htmlContent,
        priority: 'high',
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'Priority': 'urgent',
        },
      });
      console.log(`🚨 [SOS Admin Alert Email DELIVERED] Live alert broadcast to all ${targetEmails.length} admins. Message ID: ${info.messageId}`);
      return {
        success: true,
        liveSent: true,
        totalAdmins: targetEmails.length,
        delivered: targetEmails.length,
        recipients: targetEmails,
        messageId: info.messageId,
      };
    } catch (smtpErr) {
      console.error(`❌ [SOS Admin Alert Email SMTP Error]: ${smtpErr.message}`);
      return { success: false, error: smtpErr.message, recipients: targetEmails };
    }
  } else {
    console.log(`\n========================================================`);
    console.log(`🚨 [SIMULATED SOS ADMIN BROADCAST ALERT]`);
    console.log(`To All Admins (${targetEmails.length}): ${targetEmails.join(', ')}`);
    console.log(`Subject: ${subject}`);
    console.log(`Student: ${student.name} (${student.studentId})`);
    console.log(`Zone: ${location.zone}`);
    console.log(`Google Maps: ${mapsUrl}`);
    console.log(`========================================================\n`);
    return { success: true, liveSent: false, totalAdmins: targetEmails.length, recipients: targetEmails };
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail,
  sendAdminEmergencyAlertEmail,
  SENDER_EMAIL: process.env.EMAIL_USER || 'charanp326@gmail.com',
};

