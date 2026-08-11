// Service for communicating with the image generation backend
const STYLE_PROMPTS = {
    'dumbeldore': "cinematic, portrait, as Dumbeldore",
    'iron_man': "cinematic, portrait, as Iron Man",
    'jon_snow': "cinematic, portrait, as Jon Snow",
    'fire_queen': "cinematic, portrait, as a Fire Queen",
    'princess_hj': "cinematic, portrait, as a Princess, hijab",
    'mafia_boss': "cinematic, portrait, as Mafia Boss",
    'spider_woman': "cinematic, portrait, as Spider Woman",
    'basketball_star': "cinematic, portrait, as a Basketball Star",
    'captain_america': "cinematic, portrait, as Captain America",
    'spider_man': "cinematic, portrait, as Spider Man",
    'superman': "cinematic, portrait, as Superman",
    'flash': "cinematic, portrait, as Flash, without face mask, lightning.",
    'gamer_fm': "cinematic, portrait, as a Gamer Girl",
    'cyberpunk': "cinematic, portrait, as a Cyberpunk Man, Neon lights",
    'cyberpunk_hacker': "cinematic, portrait, as a Cyberpunk Hacker",
    'future_scientist': "cinematic, portrait, as a Future Scientist",
    'engineer_kid': "cinematic, portrait, as a Young Engineer",
    'anime_hero': "cinematic, portrait, as an Anime Hero",
    'space_knight': "cinematic, portrait, as a Space Knight",
    'villainess_fm': "cinematic, portrait, as a Villainess",
    'thomas_shelby': "cinematic, portrait, as Thomas Shelby from Peaky Blinders",
    'ceo_dad': "cinematic, portrait, as a CEO Dad",
    'ninja': "cinematic, portrait, as a Ninja",
    'robot': "cinematic, portrait, as a Robot, dark",
    'vampire': "cinematic, portrait, as a Vampire",
    'ice_princess': "cinematic, portrait, as an Ice Princess",
    'superdad': "cinematic, portrait, as a Superdad",
    'dragon_tamer': "cinematic, portrait, as a Dragon Tamer",
    'pilot': "cinematic, portrait, as a Jet Pilot, without helmet, goggles",
    'forest_elf': "cinematic, portrait, as a Forest Elf",
    'space_captain': "cinematic, portrait, as a Space Captain",
    'lightning_hero': "cinematic, portrait, as a Lightning Hero",
    'angel': "cinematic, portrait, as an Angel, wings, halo",
    'detective': "cinematic, portrait, as a Detective",
    'custom': null
};

class BackendService {
    constructor() {
        this.HOST = 'localhost';
        this.PORT = 9998;
    }

    async sendCommand(payload) {
        try {
            console.log('Sending command:', payload);
            const response = await fetch(`http://${this.HOST}:${this.PORT}/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Failed to parse server response:', e);
                throw new Error('Server returned invalid JSON');
            }

            if (!response.ok) {
                const errorMessage = data.error || `Server error: ${response.status}`;
                console.error('Server returned error:', errorMessage);
                throw new Error(errorMessage);
            }

            // Validate response format
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid response format: not an object');
            }

            if (data.status !== 'success' && data.status !== 'processing') {
                throw new Error(data.error || 'Unknown server error');
            }

            if (data.status === 'success' && !data.image_path) {
                throw new Error('Success response missing image path');
            }

            return data;
        } catch (error) {
            console.error('❌ Failed to send command:', error);
            throw error;
        }
    }

    async startGeneration(style, customPrompt = null, signal = null) {
        if (!style) {
            throw new Error('Style is required');
        }

        const payload = {
            command: "START_GENERATION",
            style: style,
            custom_prompt: customPrompt
        };

        try {
            console.log('Starting generation with payload:', payload);
            const response = await fetch(`http://${this.HOST}:${this.PORT}/command`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
                signal // Add abort signal to fetch request
            });

            if (signal?.aborted) {
                throw new Error('Request was cancelled');
            }

            let data;
            try {
                data = await response.json();
            } catch (e) {
                console.error('Failed to parse server response:', e);
                throw new Error('Server returned invalid JSON');
            }

            if (!response.ok) {
                const errorMessage = data.error || `Server error: ${response.status}`;
                console.error('Server returned error:', errorMessage);
                throw new Error(errorMessage);
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('Request was aborted');
                throw new Error('Request was cancelled');
            }
            console.error('❌ Failed to send command:', error);
            throw error;
        }
    }

    getStylePrompt(style) {
        return STYLE_PROMPTS[style] || null;
    }
}

// Create a singleton instance
const backendService = new BackendService();
export default backendService; 