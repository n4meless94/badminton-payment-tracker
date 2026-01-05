# 🏸 Badminton Club Payment Tracker

A comprehensive web app to manage your badminton club with payment tracking, scheduling, and WhatsApp integration.

## Features

- **Dashboard**: Overview of payment status and club statistics
- **Member Management**: Add, edit, and manage club members
- **Monthly Schedule**: Create sessions, manage player registrations and waitlists
- **Payment Tracking**: Record and track payments by month
- **WhatsApp Reminders**: Generate and send payment reminders with QR codes
- **Customizable Settings**: Bank details, QR codes, and message templates
- **Data Export/Import**: Sync with Google Sheets via CSV files
- **Local Storage**: Data persists in browser (no server required)

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**: http://localhost:5174

## Usage Guide

### 1. Initial Setup
- Go to **Settings** tab first
- Update club name, monthly fee, and bank details
- Upload your payment QR code (optional)
- Customize the WhatsApp message template

### 2. Add Members
- Go to **Members** tab
- Click "Add Member"
- Enter name, phone (WhatsApp number), and optional email
- Phone format: `60123456789` (country code + number)

### 3. Create Monthly Schedule
- Go to **Schedule** tab
- Click "Add Session" to create badminton sessions
- Set date, time, venue, and max players
- Members can register for sessions (with waitlist support)

### 4. Record Payments
- Go to **Payments** tab
- Click "Record Payment"
- Select member, amount (defaults to monthly fee), month, and date
- Add optional notes (e.g., "Bank transfer", "Cash")

### 5. Send WhatsApp Reminders
- Go to **Reminders** tab
- Select month and verify monthly fee
- For each unpaid member:
  - Click "Copy Message" to copy reminder text (includes QR code if uploaded)
  - Click "WhatsApp" to open WhatsApp directly

### 6. Sync with Google Sheets
- Go to **Sync** tab
- Export data as CSV files
- Import CSV files into Google Sheets
- Share Google Sheet with club members (view-only)

## New Features

### Monthly Schedule Management
- **Session Creation**: Set up badminton sessions with date, time, venue
- **Player Registration**: Members can register for sessions
- **Waitlist System**: Automatic waitlist when sessions are full
- **Visual Status**: See who's playing, waitlisted, or not registered

### Customizable Settings
- **Club Branding**: Custom club name in header
- **Payment Details**: Configurable monthly fee and bank details
- **QR Code Support**: Upload payment QR code for easy transfers
- **Message Templates**: Customize WhatsApp reminder messages
- **Placeholders**: Use `{memberName}`, `{monthName}`, `{amount}`, etc.

### Enhanced WhatsApp Integration
- **QR Code Inclusion**: Automatically includes QR code in messages
- **Custom Messages**: Fully customizable reminder templates
- **Bank Details**: Automatically populated from settings
- **Visual Preview**: See exactly what members will receive

## Customization

### Upload Payment QR Code
1. Go to **Settings** tab
2. Scroll to "Payment QR Code" section
3. Click "Upload QR Code Image"
4. Select your bank's QR code image
5. QR code will be included in WhatsApp messages

### Customize Message Template
Edit the message template in **Settings** using these placeholders:
- `{memberName}` - Member's name
- `{monthName}` - Month and year (e.g., "January 2026")
- `{amount}` - Payment amount
- `{bankName}` - Your bank name
- `{accountNumber}` - Your account number
- `{accountName}` - Your account name
- `{qrCode}` - QR code text (if uploaded)

### Change Default Monthly Fee
Update in **Settings** tab - this will be used as default for:
- New payment records
- Dashboard calculations
- WhatsApp reminders

## Data Structure

### Members
- ID, Name, Phone, Email

### Payments  
- ID, Member ID, Member Name, Amount, Month, Date, Notes

### Schedule
- ID, Date, Time, Venue, Max Players, Players List, Waitlist, Notes

### Settings
- Club Name, Monthly Fee, Bank Details, QR Code, Message Template

## Tech Stack

- **React** + Vite
- **Tailwind CSS** for styling
- **Local Storage** for data persistence
- **Google Sheets API** (optional)

## Browser Compatibility

- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile responsive design
- PWA-ready (can be installed on mobile)

## Deployment

### Netlify (Recommended)
1. Build the app: `npm run build`
2. Deploy `dist` folder to Netlify
3. Set up custom domain if needed

### Other Platforms
- Vercel, GitHub Pages, or any static hosting
- Just deploy the `dist` folder after building

## Support

For issues or feature requests, check the code comments or modify as needed. The app is designed to be simple and customizable for your club's specific needs.

---

**Made with ❤️ for badminton clubs everywhere! 🏸**