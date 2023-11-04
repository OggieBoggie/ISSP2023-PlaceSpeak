interface User {
    email: string;
    name: string;
    image: string | null;
    points?: number | 0;
    location?: string;
    description?: string;
    birthday?: string;
}