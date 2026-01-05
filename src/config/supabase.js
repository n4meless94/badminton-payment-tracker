import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  MEMBERS: 'members',
  PAYMENTS: 'payments', 
  SCHEDULE: 'schedule',
  SETTINGS: 'settings'
}

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Database operations
export class SupabaseService {
  
  // Members operations
  static async getMembers() {
    const { data, error } = await supabase
      .from(TABLES.MEMBERS)
      .select('*')
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async saveMembers(members) {
    // Delete all existing members first
    await supabase.from(TABLES.MEMBERS).delete().neq('id', 'impossible-id')
    
    // Insert new members
    if (members.length > 0) {
      const { error } = await supabase
        .from(TABLES.MEMBERS)
        .insert(members.map(member => ({
          id: member.id,
          name: member.name,
          phone: member.phone,
          email: member.email || null
        })))
      
      if (error) throw error
    }
    return true
  }

  // Payments operations
  static async getPayments() {
    const { data, error } = await supabase
      .from(TABLES.PAYMENTS)
      .select('*')
      .order('date', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async savePayments(payments) {
    // Delete all existing payments first
    await supabase.from(TABLES.PAYMENTS).delete().neq('id', 'impossible-id')
    
    // Insert new payments
    if (payments.length > 0) {
      const { error } = await supabase
        .from(TABLES.PAYMENTS)
        .insert(payments.map(payment => ({
          id: payment.id,
          member_id: payment.memberId,
          member_name: payment.memberName,
          amount: parseFloat(payment.amount),
          month: payment.month,
          date: payment.date,
          notes: payment.notes || null
        })))
      
      if (error) throw error
    }
    return true
  }

  // Schedule operations
  static async getSchedule() {
    const { data, error } = await supabase
      .from(TABLES.SCHEDULE)
      .select('*')
      .order('date', { ascending: true })
    
    if (error) throw error
    return data || []
  }

  static async saveSchedule(schedule) {
    // Delete all existing schedule first
    await supabase.from(TABLES.SCHEDULE).delete().neq('id', 'impossible-id')
    
    // Insert new schedule
    if (schedule.length > 0) {
      const { error } = await supabase
        .from(TABLES.SCHEDULE)
        .insert(schedule.map(session => ({
          id: session.id,
          month: session.month,
          date: session.date,
          time: session.time,
          venue: session.venue,
          max_players: parseInt(session.maxPlayers),
          players: session.players || [],
          waitlist: session.waitlist || [],
          notes: session.notes || null
        })))
      
      if (error) throw error
    }
    return true
  }

  // Settings operations
  static async getSettings() {
    const { data, error } = await supabase
      .from(TABLES.SETTINGS)
      .select('*')
      .single()
    
    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
    return data || null
  }

  static async saveSettings(settings) {
    // Try to update first
    const { data, error: updateError } = await supabase
      .from(TABLES.SETTINGS)
      .update({
        club_name: settings.clubName,
        monthly_fee: settings.monthlyFee,
        bank_name: settings.bankName,
        account_number: settings.accountNumber,
        account_name: settings.accountName,
        qr_code_url: settings.qrCodeUrl || null,
        payment_message: settings.paymentMessage,
        reminder_days: settings.reminderDays,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()

    // If no rows were updated, insert new record
    if (!data || data.length === 0) {
      const { error: insertError } = await supabase
        .from(TABLES.SETTINGS)
        .insert({
          id: 1,
          club_name: settings.clubName,
          monthly_fee: settings.monthlyFee,
          bank_name: settings.bankName,
          account_number: settings.accountNumber,
          account_name: settings.accountName,
          qr_code_url: settings.qrCodeUrl || null,
          payment_message: settings.paymentMessage,
          reminder_days: settings.reminderDays
        })
      
      if (insertError) throw insertError
    } else if (updateError) {
      throw updateError
    }
    
    return true
  }

  // Sync all data to Supabase
  static async syncToSupabase(members, payments, schedule, settings) {
    try {
      await Promise.all([
        this.saveMembers(members),
        this.savePayments(payments),
        this.saveSchedule(schedule),
        this.saveSettings(settings)
      ])
      return { success: true }
    } catch (error) {
      console.error('Supabase sync error:', error)
      return { success: false, error: error.message }
    }
  }

  // Load all data from Supabase
  static async loadFromSupabase() {
    try {
      const [members, payments, schedule, settings] = await Promise.all([
        this.getMembers(),
        this.getPayments(),
        this.getSchedule(),
        this.getSettings()
      ])

      // Transform data back to app format
      const transformedData = {
        members: members,
        payments: payments.map(p => ({
          id: p.id,
          memberId: p.member_id,
          memberName: p.member_name,
          amount: p.amount.toString(),
          month: p.month,
          date: p.date,
          notes: p.notes
        })),
        schedule: schedule.map(s => ({
          id: s.id,
          month: s.month,
          date: s.date,
          time: s.time,
          venue: s.venue,
          maxPlayers: s.max_players.toString(),
          players: s.players || [],
          waitlist: s.waitlist || [],
          notes: s.notes
        })),
        settings: settings ? {
          clubName: settings.club_name,
          monthlyFee: settings.monthly_fee,
          bankName: settings.bank_name,
          accountNumber: settings.account_number,
          accountName: settings.account_name,
          qrCodeUrl: settings.qr_code_url,
          paymentMessage: settings.payment_message,
          reminderDays: settings.reminder_days
        } : null
      }

      return { success: true, data: transformedData }
    } catch (error) {
      console.error('Supabase load error:', error)
      return { success: false, error: error.message }
    }
  }
}