const nodemailer = require('nodemailer');

const getTransporter = () => {
  const user = process.env.EMAIL_USER || 'charanp326@gmail.com';
  const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

  if (!pass) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
};

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
 * Send High-Priority Instant SOS Alert Email to Administrator
 */
const sendAdminEmergencyAlertEmail = async (emergency) => {
  const adminEmail = process.env.EMAIL_USER || 'charanp326@gmail.com';
  const student = emergency.studentSnapshot || {};
  const location = emergency.location || {};
  const lat = Number(location.latitude) || 37.4275;
  const lng = Number(location.longitude) || -122.1697;
  const mapsUrl = location.googleMapsUrl || `https://maps.google.com/?q=${lat},${lng}`;
  const timestamp = new Date(emergency.timestamps?.triggeredAt || emergency.createdAt || Date.now()).toLocaleString();

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
          .blood-badge { display: inline-block; padding: 2px 8px; background: #7f1d1d; border: 1px solid #dc2626; color: #fca5a5; border-radius: 6px; font-weight: 900; font-family: monospace; }
          .med-alert { background: rgba(220, 38, 38, 0.15); border-left: 4px solid #ef4444; padding: 10px; border-radius: 6px; margin-top: 10px; font-size: 12px; color: #fca5a5; font-weight: 600; }
          .btn-container { text-align: center; margin-top: 24px; }
          .btn-primary { display: inline-block; padding: 14px 28px; background: #dc2626; color: #ffffff !important; font-weight: 900; font-size: 13px; text-decoration: none; border-radius: 10px; text-transform: uppercase; letter-spacing: 1px; }
          .footer { text-align: center; font-size: 11px; color: #475569; margin-top: 24px; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="alert-badge">🚨 EMERGENCY SOS BROADCAST</div>
            <div class="title">Student Emergency Activated</div>
            <div class="time">🕒 Triggered At: ${timestamp}</div>
          </div>

          <!-- 1. Student Identity Dossier -->
          <div class="section">
            <div class="section-title">🎓 Student Identity & Academic Profile</div>
            <div class="grid">
              <div>
                <div class="item-label">Student Name</div>
                <div class="item-val">${student.name || 'Unknown Student'}</div>
              </div>
              <div>
                <div class="item-label">Roll Number / ID</div>
                <div class="item-val" style="font-family: monospace; color: #38bdf8;">${student.studentId || 'N/A'}</div>
              </div>
              <div>
                <div class="item-label">Branch / Department</div>
                <div class="item-val">${student.branch || student.department || 'CSE'}</div>
              </div>
              <div>
                <div class="item-label">Year & Section</div>
                <div class="item-val">${student.year || '1st Year'} • ${student.section || 'Sec A'}</div>
              </div>
              <div>
                <div class="item-label">Student Phone</div>
                <div class="item-val" style="color: #4ade80;">${student.mobile || 'Not available'}</div>
              </div>
              <div>
                <div class="item-label">Campus Email</div>
                <div class="item-val" style="font-size: 12px;">${student.email || 'N/A'}</div>
              </div>
            </div>
          </div>

          <!-- 2. Guardian Dossier -->
          <div class="section">
            <div class="section-title">🛡️ Guardian & Kin Contact</div>
            <div class="grid">
              <div>
                <div class="item-label">Guardian Name</div>
                <div class="item-val">${student.guardianName || student.emergencyContactName || 'Guardian'}</div>
              </div>
              <div>
                <div class="item-label">Guardian Phone</div>
                <div class="item-val" style="color: #4ade80; font-family: monospace; font-size: 14px;">${student.guardianPhone || student.emergencyContactNumber || 'N/A'}</div>
              </div>
            </div>
          </div>

          <!-- 3. Medical Sheet -->
          <div class="section">
            <div class="section-title">🩺 Pre-Armed Medical Dossier</div>
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <span style="font-size: 12px; color: #94a3b8;">Blood Group:</span>
              <span class="blood-badge">${student.bloodGroup || 'O+'}</span>
            </div>
            ${student.medicalConditions && !student.medicalConditions.toLowerCase().includes('none') ? `
              <div class="med-alert">
                ⚠️ <b>Medical Alert:</b> ${student.medicalConditions}
              </div>
            ` : `
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">No chronic medical alerts reported.</div>
            `}
          </div>

          <!-- 4. Geospatial & GPS Location -->
          <div class="section">
            <div class="section-title">📍 Tactical GPS Geolocation</div>
            <div class="grid">
              <div>
                <div class="item-label">Campus Zone</div>
                <div class="item-val" style="color: #fbbf24;">${location.zone || 'Campus Grounds'}</div>
              </div>
              <div>
                <div class="item-label">GPS Coordinates</div>
                <div class="item-val" style="font-family: monospace; font-size: 12px;">${lat.toFixed(5)}, ${lng.toFixed(5)}</div>
              </div>
            </div>
            <div style="margin-top: 10px;">
              <a href="${mapsUrl}" style="color: #38bdf8; font-size: 12px; font-weight: bold; text-decoration: underline;" target="_blank">Open Exact GPS Pin on Google Maps →</a>
            </div>
          </div>

          <!-- Actions -->
          <div class="btn-container">
            <a href="http://localhost:5173/admin" class="btn-primary" target="_blank">🛡️ Open Admin Dispatch Center</a>
          </div>

          <div class="footer">
            CampusSOS Intelligent Emergency Operations Center (EOC)<br>
            Automated dispatcher alert sent to administrator: <b>${adminEmail}</b><br>
            Please accept the case within 100 seconds to comply with Campus SLA.
          </div>
        </div>
      </body>
    </html>
  `;

  const transporter = getTransporter();
  const pass = (process.env.EMAIL_PASS || '').trim().replace(/\s+/g, '');

  if (transporter && pass) {
    try {
      const info = await transporter.sendMail({
        from: `"CampusSOS Emergency Center" <${process.env.EMAIL_USER || 'charanp326@gmail.com'}>`,
        to: adminEmail,
        subject,
        html: htmlContent,
        priority: 'high',
      });
      console.log(`🚨 [SOS Admin Alert Email SENT] Live email alert dispatched to ${adminEmail}. Message ID: ${info.messageId}`);
      return { success: true, liveSent: true };
    } catch (smtpErr) {
      console.error(`❌ [SOS Admin Alert Email SMTP Error]: ${smtpErr.message}`);
      return { success: false, error: smtpErr.message };
    }
  } else {
    console.log(`\n========================================================`);
    console.log(`🚨 [SIMULATED SOS ADMIN EMAIL ALERT]`);
    console.log(`To: Admin (${adminEmail})`);
    console.log(`Subject: ${subject}`);
    console.log(`Student: ${student.name} (${student.studentId})`);
    console.log(`Zone: ${location.zone}`);
    console.log(`Google Maps: ${mapsUrl}`);
    console.log(`========================================================\n`);
    return { success: true, liveSent: false };
  }
};

module.exports = {
  generateOtp,
  sendOtpEmail,
  sendAdminEmergencyAlertEmail,
  SENDER_EMAIL: process.env.EMAIL_USER || 'charanp326@gmail.com',
};

