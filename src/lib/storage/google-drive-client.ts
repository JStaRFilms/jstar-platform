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

export class GoogleDriveAuthError extends Error {
  constructor(message: string, public authContext?: {
    hasAccessToken: boolean;
    hasRefreshToken: boolean;
    lastAuthAttempt?: Date;
  }) {
    super(message);
    this.name = 'GoogleDriveAuthError';
  }
}

export class GoogleDriveQuotaError extends Error {
  constructor(message: string, public quotaInfo?: {
    limit: number;
    usage: number;
    usageInDrive: number;
  }) {
    super(message);
    this.name = 'GoogleDriveQuotaError';
  }
}

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
const WIDGET_SESSIONS_FOLDER_NAME = 'widget-sessions';
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
  private widgetFolderId: string | null = null;
  private _authState: 'unauthenticated' | 'authenticated' | 'authenticating' = 'unauthenticated';
  private authChangeListeners: Array<(state: string) => void> = [];

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

  /**
   * Add listener for authentication state changes
   */
  onAuthStateChange(callback: (state: string) => void): void {
    this.authChangeListeners.push(callback);
  }

  /**
   * Remove authentication state change listener
   */
  offAuthStateChange(callback: (state: string) => void): void {
    this.authChangeListeners = this.authChangeListeners.filter(cb => cb !== callback);
  }

  /**
   * Get current authentication state
   */
  getAuthState(): string {
    return this._authState;
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

    // Step 3: Get or create widget sessions subfolder
    // Let's cache it now to ensure structure
    if (!this.widgetFolderId) {
      this.widgetFolderId = await this.getOrCreateFolder(
        WIDGET_SESSIONS_FOLDER_NAME,
        rootFolderId
      );
    }

    // Update cache
    this.folderCache = {
      rootFolderId,
      conversationsFolderId,
      lastChecked: now,
    };

    return conversationsFolderId;
  }

  /**
   * Ensures the widget sessions folder exists
   */
  private async ensureWidgetFolder(): Promise<string> {
    await this.ensureFolderStructure(); // Ensures root and conversations, and populates widgetFolderId if we added it above
    // But purely relies on the side-effect of ensureFolderStructure updating widgetFolderId
    if (this.widgetFolderId) return this.widgetFolderId;

    // Fallback if not set
    const rootId = this.folderCache.rootFolderId!; // Should be set by ensureFolderStructure
    this.widgetFolderId = await this.getOrCreateFolder(WIDGET_SESSIONS_FOLDER_NAME, rootId);
    return this.widgetFolderId;
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
   * Filename format: "[AI Title] - [conversationId-8chars].json"
   */
  async saveConversation(
    conversationData: Omit<ConversationFile, 'version'>
  ): Promise<{ fileId: string; updatedAt: string }> {
    await this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();

    // Generate human-readable filename with AI title
    const shortId = conversationData.conversationId.slice(0, 8);
    const sanitizedTitle = this.sanitizeFilename(conversationData.title);
    const fileName = `${sanitizedTitle} - ${shortId}.json`;

    console.log('[GoogleDrive] Saving conversation with filename:', fileName);

    // Prepare data with version (conversationId already in conversationData)
    const fileData: ConversationFile = {
      version: FILE_VERSION,
      ...conversationData,
      updatedAt: new Date().toISOString(),
    };

    // Check if file exists (search by conversationId pattern)
    const existingFileId = await this.findFileByConversationId(
      conversationData.conversationId,
      folderId
    );

    if (existingFileId) {
      // Update existing file (and rename if title changed)
      await this.updateFile(existingFileId, fileData, fileName);
      return { fileId: existingFileId, updatedAt: fileData.updatedAt };
    } else {
      // Create new file
      const fileId = await this.createFile(fileName, folderId, fileData);
      return { fileId, updatedAt: fileData.updatedAt };
    }
  }

  /**
   * Save a widget session to "widget-sessions" folder
   */
  async saveWidgetSession(
    conversationData: Omit<ConversationFile, 'version'>
  ): Promise<{ fileId: string; updatedAt: string }> {
    await this.ensureAuthenticated();
    const folderId = await this.ensureWidgetFolder();

    const shortId = conversationData.conversationId.replace('widget-session-', '').slice(0, 8);
    const sanitizedTitle = this.sanitizeFilename(conversationData.title || 'Widget Session');
    const fileName = `${sanitizedTitle} - ${shortId}.json`;

    console.log('[GoogleDrive] Saving widget session:', fileName);

    const fileData: ConversationFile = {
      version: FILE_VERSION,
      ...conversationData,
      updatedAt: new Date().toISOString(),
    };

    // Check existing
    const existingFileId = await this.findFileByConversationId(
      conversationData.conversationId,
      folderId
    );

    if (existingFileId) {
      await this.updateFile(existingFileId, fileData, fileName);
      return { fileId: existingFileId, updatedAt: fileData.updatedAt };
    } else {
      const fileId = await this.createFile(fileName, folderId, fileData);
      return { fileId, updatedAt: fileData.updatedAt };
    }
  }

  /**
   * Sanitize title for use in filename
   * Removes invalid characters and limits length
   */
  private sanitizeFilename(title: string): string {
    return title
      .replace(/[<>:"/\\|?*]/g, '') // Remove invalid filename chars
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 50); // Limit length
  }

  /**
   * Find a file by conversationId pattern in filename
   */
  private async findFileByConversationId(
    conversationId: string,
    parentId: string
  ): Promise<string | null> {
    const shortId = conversationId.slice(0, 8);
    // Search for files ending with " - [shortId].json"
    const searchQuery = `name contains '- ${shortId}.json' and '${parentId}' in parents and trashed=false`;
    const response = await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id)`,
      { method: 'GET' }
    );

    const data = await response.json();
    return data.files && data.files.length > 0 ? data.files[0].id : null;
  }

  /**
   * Load a conversation from Google Drive
   */
  async loadConversation(conversationId: string): Promise<ConversationFile | null> {
    await this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();
    // Fix: Use findFileByConversationId to handle "[Title] - [shortId].json" format
    // instead of expecting exact "ID.json" match
    const fileId = await this.findFileByConversationId(conversationId, folderId);

    if (!fileId) {
      return null;
    }

    return await this.downloadFile(fileId);
  }

  /**
   * Load a widget session from widget-sessions folder
   */
  async loadWidgetSession(conversationId: string): Promise<ConversationFile | null> {
    await this.ensureAuthenticated();
    const folderId = await this.ensureWidgetFolder();

    const fileId = await this.findFileByConversationId(conversationId, folderId);

    if (!fileId) return null;
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
    await this.ensureAuthenticated();

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
   * List all widget sessions
   */
  async listWidgetSessions(): Promise<Array<{
    conversationId: string;
    fileId: string;
    title: string;
    updatedAt: string;
  }>> {
    await this.ensureAuthenticated();
    const folderId = await this.ensureWidgetFolder();

    const searchQuery = `'${folderId}' in parents and mimeType='${MIME_TYPE_JSON}' and trashed=false`;
    const response = await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(searchQuery)}&fields=files(id,name,modifiedTime)&orderBy=modifiedTime desc`,
      { method: 'GET' }
    );

    const data = await response.json();
    if (!data.files || data.files.length === 0) return [];

    return data.files.map((file: any) => ({
      conversationId: 'widget-session', // We might need to parse this better if needed, but usually we load by specific ID
      fileId: file.id,
      title: file.name.replace('.json', ''),
      updatedAt: file.modifiedTime,
    }));
  }

  /**
   * Delete a conversation from Google Drive
   */
  async deleteWidgetSession(conversationId: string): Promise<void> {
    await this.ensureAuthenticated();
    const folderId = await this.ensureWidgetFolder();
    const fileId = await this.findFileByConversationId(conversationId, folderId);

    if (!fileId) {
      // Silent fail or throw? standard delete throws.
      throw new Error(`Widget session ${conversationId} not found in Google Drive`);
    }

    await this.deleteFile(fileId);
  }

  async deleteFile(fileId: string): Promise<void> {
    await this.makeRequest(
      `https://www.googleapis.com/drive/v3/files/${fileId}`,
      { method: 'DELETE' }
    );
  }

  /**
   * Delete a conversation from Google Drive
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await this.ensureAuthenticated();

    const folderId = await this.ensureFolderStructure();

    // Fix: Use findFileByConversationId instead of exact name match
    // because we save with titles now.
    const fileId = await this.findFileByConversationId(conversationId, folderId);

    if (!fileId) {
      throw new Error(`Conversation ${conversationId} not found in Google Drive`);
    }

    await this.deleteFile(fileId);
  }

  /**
   * Move a file from widget-sessions to conversations folder
   */
  async promoteSessionToConversation(widgetConversationId: string, _newTitle: string): Promise<string> {
    await this.ensureAuthenticated();

    // 1. Find the file in widget folder
    const widgetFolderId = await this.ensureWidgetFolder();
    const fileId = await this.findFileByConversationId(widgetConversationId, widgetFolderId);

    if (!fileId) throw new Error('Widget session file not found');

    // 2. Get target folder
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _convFolderId = await this.ensureFolderStructure();

    return fileId;
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
   * Also updates filename if it has changed (e.g., title was regenerated)
   */
  private async updateFile(
    fileId: string,
    content: ConversationFile,
    newFileName?: string
  ): Promise<void> {
    // Update file content
    await this.makeRequest(
      `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': MIME_TYPE_JSON },
        body: JSON.stringify(content, null, 2),
      }
    );

    // Rename file if new filename provided
    if (newFileName) {
      await this.makeRequest(
        `https://www.googleapis.com/drive/v3/files/${fileId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newFileName }),
        }
      );
    }
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
      const errorData = await this.parseError(response);

      // Handle Auth Errors (401)
      if (response.status === 401) {
        throw new GoogleDriveAuthError(errorData.message, {
          hasAccessToken: !!this.accessToken,
          hasRefreshToken: false, // We don't track this in client
          lastAuthAttempt: new Date()
        });
      }

      // Handle Quota Errors (403 with specific reason, or 507)
      // Google Drive uses 403 for rate limit and quota limits usually
      if (response.status === 403 && (
        errorData.message.toLowerCase().includes('quota') ||
        errorData.message.toLowerCase().includes('insufficient storage') ||
        (errorData.details?.errors?.[0]?.reason === 'storageQuotaExceeded')
      )) {
        // Try to fetch quota info if possible, otherwise throw with basic info
        throw new GoogleDriveQuotaError(errorData.message, {
          limit: 0,
          usage: 0,
          usageInDrive: 0
        });
      }

      // Throw generic error with details
      const error: any = new Error(errorData.message);
      error.code = errorData.code;
      error.details = errorData.details;
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
  private async ensureAuthenticated(): Promise<void> {
    if (this.accessToken) {
      if (this._authState !== 'authenticated') {
        this._authState = 'authenticated';
        this.authChangeListeners.forEach(cb => cb('authenticated'));
      }
      return;
    }

    this._authState = 'authenticating';
    this.authChangeListeners.forEach(cb => cb('authenticating'));

    const errorContext = {
      hasAccessToken: false,
      hasRefreshToken: false,
      lastAuthAttempt: new Date()
    };

    throw new GoogleDriveAuthError(
      'Google Drive client not authenticated. Call setAccessToken() first.',
      errorContext
    );
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
    await this.ensureAuthenticated();

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
