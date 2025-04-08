import User from "../models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // You'll need to install this dependency
import { transporterConfig } from "../utils.js";

class AuthService {
    static async SignUpUser(userData) {
        try {
            if(!userData || !userData.email || !userData.password) {
                throw new Error('Email & Password are required');
            }

            const existingUser = await this.findUserByEmail(userData.email);
            if(existingUser) {
                throw new Error('User with this email already exists');
            }
            
            const user = await this.createUserInDatabase(userData);
            
            // Generate verification token and send email
            const verificationToken = this.generateVerificationToken(user._id);
            await this.storeVerificationToken(user._id, verificationToken);
            await this.sendVerificationEmail(userData.email, user._id, verificationToken);
            
            return this.sanitizeUserData(user);
        } catch(error) {
            throw new Error(`Signup failed: ${error.message}`);
        }
    }

    static async VerifyUser(userId, verificationToken) {

        console.log(userId, verificationToken)
        try {
            if(!userId) {
                throw new Error('userId needed for user verification');
            }

            const user = await this.findUserById(userId);
            if(!user) {
                throw new Error('User not found');
            }
            
            if(verificationToken) {
                const isValid = await this.validateVerificationToken(userId, verificationToken);
                if (!isValid) {
                    throw new Error('Invalid verification token');
                }
                
                await this.markUserAsVerified(userId);
                return this.sanitizeUserData(user);
            } else {
                // If no token provided, generate a new one and send email
                const newToken = this.generateVerificationToken(userId);
                await this.storeVerificationToken(userId, newToken);
                await this.sendVerificationEmail(user.email, newToken);
                return { message: 'Verification email sent' };
            }
        } catch(error) {
            throw new Error(`Verification failed: ${error.message}`);
        }
    }

    static async SignInUser(email, password) {
        try {
            if(!email || !password) {
                throw new Error('Email and password are required');
            }
            
            const user = await this.findUserByEmail(email);
            if(!user) {
                throw new Error('Invalid email or password');
            }
            
            // Check if account is verified
            if(!user.isVerified) {
                throw new Error('Please verify your email before logging in');
            }
            
            // Check if account is locked
            if(await this.isAccountLocked(user._id)) {
                throw new Error('Account is locked due to too many failed attempts');
            }
            
            // Validate password
            const isPasswordValid = await this.validatePassword(password, user.password);
            if(!isPasswordValid) {
                await this.logFailedLoginAttempt(user._id);
                throw new Error('Invalid email or password');
            }
            
            // Reset failed attempts and update last login
            await this.resetFailedAttempts(user._id);
            await this.updateLastLogin(user._id);
            
            // Generate auth token
            const token = await this.generateAuthToken(user);
            
            return {
                user: this.sanitizeUserData(user),
                token
            };
        } catch(error) {
            throw new Error(`Sign in failed: ${error.message}`);
        }
    }

    static async ResetPassword(email) {
        try {
            const user = await this.findUserByEmail(email);
            if(!user) {
                // To prevent email enumeration, don't reveal if user exists
                return { message: 'If your email exists in our system, you will receive a password reset link' };
            }
            
            const resetToken = this.generatePasswordResetToken();
            await this.storePasswordResetToken(user._id, resetToken);
            await this.sendPasswordResetEmail(email, resetToken);
            
            return { message: 'Password reset email sent' };
        } catch(error) {
            throw new Error(`Password reset failed: ${error.message}`);
        }
    }

    static async CompletePasswordReset(token, newPassword) {
        try {
            const userId = await this.validatePasswordResetToken(token);
            if(!userId) {
                throw new Error('Invalid or expired reset token');
            }
            
            const passwordHash = await this.hashPassword(newPassword);
            await this.updateUserPassword(userId, passwordHash);
            
            // Invalidate all previous sessions for security
            await this.invalidateUserSessions(userId);
            
            return { message: 'Password has been reset successfully' };
        } catch(error) {
            throw new Error(`Password reset completion failed: ${error.message}`);
        }
    }

    // Helper methods
    static async findUserByEmail(email) {
        return await User.findOne({ email });
    }

    static async findUserById(userId) {
        return await User.findById(userId);
    }

    static async createUserInDatabase(userData) {
        // Hash password
        const passwordHash = await this.hashPassword(userData.password);
        
        // Create new user
        const user = new User({
            email: userData.email,
            password: passwordHash,
            name: userData.name || '',
            phone: userData.phone || '',
            isVerified: false,
            failedLoginAttempts: 0,
            lastLogin: null
        });
        
        return await user.save();
    }

    static async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    static async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }

    static async generateAuthToken(user) {
        return jwt.sign(
            {
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );
    }

    static async validateVerificationToken(userId, token) {
        const user = await User.findById(userId);
        if(!user || !user.verificationToken) {
            return false;
        }
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.id === userId.toString();
        } catch(error) {
            return false;
        }
    }

    static generateVerificationToken(userId) {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' } // 24 hours validity
        );
    }

    static async storeVerificationToken(userId, token) {
        const user = await User.findById(userId);
        if(!user) {
            throw new Error('User not found');
        }
        
        user.verificationToken = token;
        await user.save();
    }

    static async sendVerificationEmail(email, userId, token) {
        // Create transporter (configure for your email provider)
        const transporter = transporterConfig()
        
        const verificationLink = `${process.env.VERIFICATION_URL}/verify/${userId}/${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <h1>Email Verification</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
    }

    static async markUserAsVerified(userId) {
        const user = await User.findById(userId);
        if(!user) {
            throw new Error('User not found');
        }
        
        user.isVerified = true;
        user.verificationToken = null; // Clear token after verification
        await user.save();
    }

    static async updateLastLogin(userId) {
        await User.findByIdAndUpdate(userId, {
            lastLogin: new Date()
        });
    }

    static async logFailedLoginAttempt(userId) {
        const user = await User.findById(userId);
        if(!user) return;
        
        user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
        await user.save();
    }

    static async resetFailedAttempts(userId) {
        await User.findByIdAndUpdate(userId, {
            failedLoginAttempts: 0
        });
    }

    static async isAccountLocked(userId) {
        const user = await User.findById(userId);
        if(!user) return false;
        
        // Lock account after 5 failed attempts
        return (user.failedLoginAttempts || 0) >= 5;
    }

    static generatePasswordResetToken() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        return resetToken;
    }

    static async storePasswordResetToken(userId, token) {
        const tokenHash = await bcrypt.hash(token, 10);
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 1); // 1 hour expiration
        
        await User.findByIdAndUpdate(userId, {
            resetToken: tokenHash,
            resetTokenExpires: expiration
        });
    }

    static async sendPasswordResetEmail(email, token) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or your email service
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h1>Password Reset</h1>
                <p>You requested a password reset. Please click the link below to reset your password:</p>
                <a href="${resetLink}">Reset Password</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
    }

    static async validatePasswordResetToken(token) {
        // Find user with non-expired reset token
        const user = await User.findOne({
            resetTokenExpires: { $gt: new Date() }
        });
        
        if(!user || !user.resetToken) return null;
        
        // Compare token with stored hash
        const isValid = await bcrypt.compare(token, user.resetToken);
        if(!isValid) return null;
        
        return user._id;
    }

    static async updateUserPassword(userId, passwordHash) {
        await User.findByIdAndUpdate(userId, {
            password: passwordHash,
            resetToken: null,
            resetTokenExpires: null
        });
    }

    static async invalidateUserSessions(userId) {
        // This would normally involve blacklisting tokens or updating a version number
        // For simplicity, we'll assume the client will handle logout on password change
    }

    static async invalidateSession(token) {
        // This would normally involve adding the token to a blacklist with Redis
        // For a simpler approach, you could use a token version system
    }

    static sanitizeUserData(user) {
        if (!user) return null;
        
        // Convert to object if it's a Mongoose document
        const userObject = user.toObject ? user.toObject() : { ...user };
        
        // Remove sensitive fields
        const { password, resetToken, resetTokenExpires, verificationToken, __v, ...safeUser } = userObject;
        
        return safeUser;
    }
}

export default AuthService;