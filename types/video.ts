interface VideoData {
    snippet: {
        publishedAt: string;
        channelId: string;
        channelTitle: string;
        title: string;
        description: string;
        thumbnails: {
            medium: {
                url: string;
            }
        }
    }
    contentDetails: {
        videoId: string;
    }
    tags: string[];
}

interface SummaryData {
    videoId: string;
    summary: string;
}