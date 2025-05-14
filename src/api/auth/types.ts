// User role type
export type UserRole = 'CLIENT' | 'ADMIN' | 'COACH';

// User role object type
export interface Role {
  id: string;
  name: UserRole;
}

// User data type
export interface User {
  id: string;
  email: string;
  displayName: string;
  phoneNumber: string;
  emailVerified: boolean;
  role: Role;
  profileImage?: string;
}

// Authentication response type
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: string;
}

// Register request type
export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
  phoneNumber: string;
  roleName: UserRole;
}

// Login request type
export interface LoginRequest {
  email: string;
  password: string;
}

// Forgot password request type
export interface ForgotPasswordRequest {
  email: string;
}

// Verify email request type
export interface VerifyEmailRequest {
  oobCode: string;
}

// Update profile request type
export interface UpdateProfileRequest {
  displayName?: string;
  phoneNumber?: string;
  profileImage?: string;
}

// Message response type
export interface MessageResponse {
  message: string;
}

// Firebase webhook event type
export interface FirebaseWebhookRequest {
  event: string;
  user: {
    uid: string;
    email: string;
  };
} 