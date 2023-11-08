interface User {
    email: string;
    name: string;
    image: string | null;
    points?: number | 0;
    level?: number | 0;
    location?: string;
    description?: string;
    birthday?: string;
    facebook_url?: string;
    twitter_x_url?: string;
    linkedin_url?: string;
}