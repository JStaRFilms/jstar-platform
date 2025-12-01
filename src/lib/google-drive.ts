import { google } from 'googleapis';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GoogleDriveService {
    private oauth2Client;

    constructor() {
        this.oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );
    }

    /**
     * Generates the auth URL for the user to connect their Drive
     */
    generateAuthUrl() {
        return this.oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: [
                'https://www.googleapis.com/auth/drive.file',
                'https://www.googleapis.com/auth/drive.metadata.readonly'
            ],
            prompt: 'consent' // Force refresh token generation
        });
    }

    /**
     * Exchanges auth code for tokens and saves them to the user's record
     */
    async handleCallback(code: string, workosUserId: string) {
        const { tokens } = await this.oauth2Client.getToken(code);

        // Find the user by WorkOS ID to get their internal ID
        const user = await prisma.user.findUnique({
            where: { workosId: workosUserId }
        });

        if (!user) {
            throw new Error(`User not found for WorkOS ID: ${workosUserId}`);
        }

        // Save tokens to database using internal user ID
        await prisma.googleDriveConfig.upsert({
            where: { userId: user.id },
            create: {
                userId: user.id,
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token!,
                tokenExpiry: new Date(tokens.expiry_date!),
                enabled: true,
                syncDirection: 'BIDIRECTIONAL',
                conflictResolution: 'LOCAL_WINS'
            },
            update: {
                accessToken: tokens.access_token!,
                refreshToken: tokens.refresh_token || undefined, // Only update if new one provided
                tokenExpiry: new Date(tokens.expiry_date!),
                enabled: true,
            }
        });

        return tokens;
    }

    /**
     * Gets an authenticated Drive client for a user
     */
    async getDriveClient(userId: string) {
        const config = await prisma.googleDriveConfig.findUnique({
            where: { userId }
        });

        if (!config || !config.refreshToken) {
            throw new Error('User not connected to Google Drive');
        }

        this.oauth2Client.setCredentials({
            access_token: config.accessToken,
            refresh_token: config.refreshToken,
            expiry_date: config.tokenExpiry.getTime()
        });

        // Handle token refresh automatically if needed
        this.oauth2Client.on('tokens', async (tokens) => {
            if (tokens.access_token) {
                await prisma.googleDriveConfig.update({
                    where: { userId },
                    data: {
                        accessToken: tokens.access_token,
                        tokenExpiry: new Date(tokens.expiry_date!),
                        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token })
                    }
                });
            }
        });

        return google.drive({ version: 'v3', auth: this.oauth2Client });
    }
    /**
     * Ensures the "JohnGPT Data" folder exists and returns its ID
     */
    async ensureRootFolder(drive: any) {
        // Check if root folder exists
        const res = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and name='JohnGPT Data' and trashed=false",
            fields: 'files(id, name)',
        });

        if (res.data.files && res.data.files.length > 0) {
            return res.data.files[0].id;
        }

        // Create root folder
        const folderMetadata = {
            name: 'JohnGPT Data',
            mimeType: 'application/vnd.google-apps.folder',
        };

        const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: 'id',
        });

        return folder.data.id;
    }

    /**
     * Ensures the "conversations" subfolder exists
     */
    async ensureConversationsFolder(userId: string) {
        const drive = await this.getDriveClient(userId);
        const rootFolderId = await this.ensureRootFolder(drive);

        const res = await drive.files.list({
            q: `mimeType='application/vnd.google-apps.folder' and name='conversations' and '${rootFolderId}' in parents and trashed=false`,
            fields: 'files(id, name)',
        });

        if (res.data.files && res.data.files.length > 0) {
            return res.data.files[0].id;
        }

        const folderMetadata = {
            name: 'conversations',
            mimeType: 'application/vnd.google-apps.folder',
            parents: [rootFolderId],
        };

        const folder = await drive.files.create({
            requestBody: folderMetadata,
            fields: 'id',
        });

        return folder.data.id;
    }

    /**
     * Saves a conversation to Google Drive
     */
    async saveConversation(userId: string, conversation: any) {
        const drive = await this.getDriveClient(userId);
        const folderId = await this.ensureConversationsFolder(userId);
        const fileName = `${conversation.id}.json`;

        // Check if file exists
        const res = await drive.files.list({
            q: `name='${fileName}' and '${folderId}' in parents and trashed=false`,
            fields: 'files(id)',
        });

        const fileMetadata = {
            name: fileName,
            parents: [folderId],
        };

        const media = {
            mimeType: 'application/json',
            body: JSON.stringify(conversation, null, 2),
        };

        if (res.data.files && res.data.files.length > 0) {
            // Update existing file
            const fileId = res.data.files[0].id!;
            await drive.files.update({
                fileId: fileId,
                requestBody: {
                    modifiedTime: new Date().toISOString()
                },
                media: media,
            });
            return fileId;
        } else {
            // Create new file
            const file = await drive.files.create({
                requestBody: fileMetadata as any,
                media: media,
                fields: 'id',
            });
            return file.data.id!;
        }
    }

    /**
     * Lists all conversations from Google Drive
     */
    async listConversations(userId: string) {
        const drive = await this.getDriveClient(userId);
        const folderId = await this.ensureConversationsFolder(userId);

        const res = await drive.files.list({
            q: `'${folderId}' in parents and trashed=false and mimeType='application/json'`,
            fields: 'files(id, name, modifiedTime)',
            orderBy: 'modifiedTime desc',
        });

        return res.data.files || [];
    }

    /**
     * Gets a specific conversation file content
     */
    async getConversationContent(userId: string, fileId: string) {
        const drive = await this.getDriveClient(userId);
        const res = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        });
        return res.data;
    }

    /**
     * Deletes a file from Google Drive
     */
    async deleteFile(userId: string, fileId: string) {
        const drive = await this.getDriveClient(userId);
        await drive.files.delete({
            fileId: fileId,
        });
    }
}

export const googleDriveService = new GoogleDriveService();
