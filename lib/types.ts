export type UserRole = 'admin' | 'developer' | 'social_media_manager' | 'client_manager'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export type TicketStatus = 'open' | 'in_progress' | 'completed' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type TicketCategory = 'general' | 'development' | 'social_media' | 'client'

export interface Ticket {
  id: string
  title: string
  description: string | null
  status: TicketStatus
  priority: TicketPriority
  category: TicketCategory
  assigned_to: string | null
  created_by: string
  income: number
  created_at: string
  updated_at: string
  assignee?: Profile | null
  creator?: Profile | null
}

export interface TicketComment {
  id: string
  ticket_id: string
  user_id: string
  content: string
  created_at: string
  user?: Profile
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  developer: 'Developer',
  social_media_manager: 'Social Media Manager',
  client_manager: 'Client Manager',
}

export const STATUS_LABELS: Record<TicketStatus, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  completed: 'Completed',
  closed: 'Closed',
}

export const PRIORITY_LABELS: Record<TicketPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const CATEGORY_LABELS: Record<TicketCategory, string> = {
  general: 'General',
  development: 'Development',
  social_media: 'Social Media',
  client: 'Client',
}
