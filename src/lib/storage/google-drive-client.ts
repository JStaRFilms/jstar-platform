/**
 * Google Drive API Client for JohnGPT Conversations
 * 
 * Manages conversation storage in Google Drive with the following structure:
 * - Root folder: "J StaR Platform"
 * - Conversations folder: "J StaR Platform/conversations/"
 * - File format: JSON with versioning for future migrations
 * 
 * Features:
 * - Folder auto-creation
 * - CRUD operations for conversations
 * - Quota error handling
 * - Conflict resolution via timestamps
 */

import { UIMessage } from '@ai-sdk/react';

// ============================================================================
// Types
// ============================================================================

export type ConversationFile = {
  version: number;
  conversationId: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: StoredMessage[];
};

export type MessageMetadata = {
  // Persona/Mode tracking
  persona?: string; // e.g., 'Universal', 'code', 'bible', 'roast'
  personaName?: string; // e.g., 'JohnGPT', 'Senior Engineer'

  // Model tracking
  model?: string; // e.g., 'gemini-2.0-flash-exp', 'gpt-4o'
  provider?: string; // e.g., 'google', 'openai'

  // Generation parameters
  temperature?: number;
  topP?: number;
  maxTokens?: number;

  // Tool usage tracking
  toolCalls?: Array<{
    name: string;
    input: any;
    output?: any;
  }>;

  // Performance metrics
  responseTime?: number; // milliseconds
  tokenCount?: number;

  // User feedback (for future feature)
  userRating?: number; // 1-5 stars
  userFeedback?: string;
};

export type StoredMessage = UIMessage & {
  parentId?: string | null;
  childrenIds?: string[];
  createdAt: string;
  metadata?: MessageMetadata; // All the juicy analytics data
};

export type GoogleDriveError = {
  code: number;
  message: string;
  details?: any;
};

type FolderCache = {
  rootFolderId: string | null;
  conversationsFolderId: string | null;
  lastChecked: number;
};

// ============================================================================
// Constants
// ============================================================================

const ROOT_FOLDER_NAME = 'J StaR Platform';
const CONVERSATIONS_FOLDER_NAME = 'conversations';
const FILE_VERSION = 1;
const MIME_TYPE_FOLDER = 'application/vnd.google-apps.folder';
const MIME_TYPE_JSON = 'application/json';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ============================================================================
// Google Drive Client Class
// ============================================================================

export class GoogleDriveClient {
  private accessToken: string | null = null;
  private folderCache: FolderCache = {
    rootFolderId: null,
    conversationsFolderId: null,
    lastChecked: 0,
  };

  /**
   * Initialize the client with a Google OAuth access token
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  /**
   * Check if client is authenticated
   */
  isAuthenticated(): boolean {
    return this.accessToken !== null;
  }

  // ==========================================================================
  // Folder Management
  // ==========================================================================

  /**
   * Ensures the folder structure exists: J StaR Platform/conversations/
   * Creates folders if they don't exist
   * Uses caching to avoid repeated API calls
   */
  private async ensureFolderStructure(): Promise<string> {
    // Check cache
    const now = Date.now();
    if (
      this.folderCache.conversationsFolderId &&
      now - this.folderCache.lastChecked < CACHE_TTL
    ) {
      return this.folderCache.conversationsFolderId;
    }

    // Step 1: Get or create root folder "J StaR Platform"
    const rootFolderId = await this.getOrCreateFolder(ROOT_FOLDER_NAME, 'root');

    // Step 2: Get or create conversations subfolder
    const conversationsFolderId = await this.getOrCreateFolder(
      CONVERSATIONS_FOLDER_NAME,
      rootFolderId
    );

    // Update cache
    this.folderCache = {
      rootFolderId,
      conversationsFolderId,
      lastChecked: now,
    };

    return conversationsFolderId;
  }

  /**
   * Get or create a folder by name within a parent folder
   */
  private async getOrCreateFolder(
    folderName: string,
    parentId: string
  ): Promise<string> {
    // Search for existing folder
    const searchQuery = `name='${folderName}' and '${parentId}' in parents and mimeType='${MIME_TYPE_FOLDER}' and trashed=false`;
    const searchResponse = await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name)`,
      { method: 'GET' }
    );

    const searchData = await searchResponse.json();

    if (searchData.files && searchData.files.length > 0) {
      return searchData.files[0].id;
    }

    // Create folder if it doesn't exist
    const createResponse = await this.makeRequest(
      'https://www.googleapis.com/drive/v3/files',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: folderName,
          mimeType: MIME_TYPE_FOLDER,
          parents: [parentId],
        }),
      }
    );

    const createData = await createResponse.json();
    return createData.id;
  }

  // ==========================================================================
  // CRUD Operations
  // ==========================================================================

  /**
   * Save a conversation to Google Drive
   * Creates a new file or updates existing one
   */
  async saveConversation(
    conversationData: Omit<ConversationFile, 'version'>
  ): Promise<{ fileId: string; updatedAt: string }> {
    this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();
    const fileName = `${conversationData.conversationId}.json`;

    // Prepare data with version
    const fileData: ConversationFile = {
      version: FILE_VERSION,
      ...conversationData,
      updatedAt: new Date().toISOString(),
    };

    // Check if file exists
    const existingFileId = await this.findFileByName(fileName, folderId);

    if (existingFileId) {
      // Update existing file
      await this.updateFile(existingFileId, fileData);
      return { fileId: existingFileId, updatedAt: fileData.updatedAt };
    } else {
      // Create new file
      const fileId = await this.createFile(fileName, folderId, fileData);
      return { fileId, updatedAt: fileData.updatedAt };
    }
  }

  /**
   * Load a conversation from Google Drive
   */
  async loadConversation(conversationId: string): Promise<ConversationFile | null> {
    this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();
    const fileName = `${conversationId}.json`;

    const fileId = await this.findFileByName(fileName, folderId);
    if (!fileId) {
      return null;
    }

    return await this.downloadFile(fileId);
  }

  /**
   * List all conversations for the current user
   * Returns metadata only (not full message content)
   */
  async listConversations(): Promise<Array<{
    conversationId: string;
    fileId: string;
    title: string;
    updatedAt: string;
  }>> {
    this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();

    // Query all JSON files in conversations folder
    const searchQuery = `'${folderId}' in parents and mimeType='${MIME_TYPE_JSON}' and trashed=false`;
    const response = await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
      { method: 'GET' }
    );

    const data = await response.json();

    if (!data.files || data.files.length === 0) {
      return [];
    }

    // For each file, extract conversation ID from filename
    return data.files.map((file: any) => ({
      conversationId: file.name.replace('.json', ''),
      fileId: file.id,
      title: 'Loading...', // Will be populated from metadata
      updatedAt: file.modifiedTime,
    }));
  }

  /**
   * Delete a conversation from Google Drive
   */
  async deleteConversation(conversationId: string): Promise<void> {
    this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();
    const fileName = `${conversationId}.json`;
    const fileId = await this.findFileByName(fileName, folderId);

    if (!fileId) {
      throw new Error(`Conversation ${conversationId} not found in Google Drive`);
    }

    await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      { method: 'DELETE' }
    );
  }

  // ==========================================================================
  // Low-Level File Operations
  // ==========================================================================

  /**
   * Find a file by name within a specific folder
   */
  private async findFileByName(
    fileName: string,
    parentId: string
  ): Promise<string | null> {
    const searchQuery = `name='${fileName}' and '${parentId}' in parents and trashed=false`;
    const response = await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id)`,
      { method: 'GET' }
    );

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
  }

  /**
   * Create a new file in Google Drive
   */
  private async createFile(
    fileName: string,
    parentId: string,
    content: ConversationFile
  ): Promise<string> {
    // Use multipart upload
    const metadata = {
      name: fileName,
      mimeType: MIME_TYPE_JSON,
      parents: [parentId],
    };

    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const multipartRequestBody =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(content, null, 2) +
      closeDelimiter;

    const response = await this.makeRequest(
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id',
      {
        method: 'POST',
        headers: {
          'Content-Type': `multipart/related; boundary=${boundary}`,
        },
        body: multipartRequestBody,
      }
    );

    const data = await response.json();
    return data.id;
  }

  /**
   * Update an existing file in Google Drive
   */
  private async updateFile(
    fileId: string,
    content: ConversationFile
  ): Promise<void> {
    await this.makeRequest(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': MIME_TYPE_JSON },
        body: JSON.stringify(content, null, 2),
      }
    );
  }

  /**
   * Download a file from Google Drive
   */
  private async downloadFile(fileId: string): Promise<ConversationFile> {
    const response = await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { method: 'GET' }
    );

    return await response.json();
  }

  // ==========================================================================
  // HTTP Request Wrapper
  // ==========================================================================

  /**
   * Make an authenticated request to Google Drive API
   * Handles errors and retries
   */
  private async makeRequest(url: string, options: RequestInit): Promise<Response> {
    if (!this.accessToken) {
      throw new Error('Google Drive client not authenticated');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw error;
    }

    return response;
  }

  /**
   * Parse error response from Google Drive API
   */
  private async parseError(response: Response): Promise<GoogleDriveError> {
    let errorData: any;

    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    return {
      code: response.status,
      message: errorData.error?.message || errorData.message || 'Unknown error',
      details: errorData.error,
    };
  }

  /**
   * Ensure client is authenticated before making requests
   */
  private ensureAuthenticated(): void {
    if (!this.accessToken) {
      throw new Error('Google Drive client not authenticated. Call setAccessToken() first.');
    }
  }

  // ==========================================================================
  // Quota & Storage Info
  // ==========================================================================

  /**
   * Get storage quota information
   * Returns total storage, used storage, and available storage in bytes
   */
  async getStorageQuota(): Promise<{
    limit: number;
    usage: number;
    usageInDrive: number;
  }> {
    this.ensureAuthenticated();

    const response = await this.makeRequest(
      'https://www.googleapis.com/drive/v3/about?fields=storageQuota',
      { method: 'GET' }
    );

    const data = await response.json();
    const quota = data.storageQuota;

    return {
      limit: parseInt(quota.limit, 10),
      usage: parseInt(quota.usage, 10),
      usageInDrive: parseInt(quota.usageInDrive, 10),
    };
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const googleDriveClient = new GoogleDriveClient();
