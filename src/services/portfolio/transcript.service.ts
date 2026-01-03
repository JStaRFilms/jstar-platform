import { YoutubeTranscript } from 'youtube-transcript';

export async function getYouTubeTranscript(videoId: string): Promise<string | null> {
    try {
        const transcript = await YoutubeTranscript.fetchTranscript(videoId);
        // Combine all transcript parts into a single string
        return transcript.map(item => item.text).join(' ');
    } catch (error) {
        console.error(`Failed to get transcript for video ${videoId}:`, error);
        return null;
    }
}
