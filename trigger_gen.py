import socket
import json

STYLE_PROMPTS = {
    'dumbeldore': "cinematic, portrait, as Dumbeldore",
    'iron_man': "cinematic, portrait, as Iron Man",
    'jon_snow': "cinematic, portrait, as Jon Snow",
    'fire_queen': "cinematic, portrait, as a Fire Queen",
    'princess_hj': "cinematic, portrait, as a Princess, hijab",
    'mafia_boss': "cinematic, portrait, as Mafia Boss",
    'spider_woman': "cinematic, portrait, as Spider Woman",
    'basketball_star': "cinematic, portrait, as a Basketball Star",
    'gamer_fm': "cinematic, portrait, as a Gamer Girl",
    'cyberpunk_hacker': "cinematic, portrait, as a Cyberpunk Hacker",
    'future_scientist': "cinematic, portrait, as a Future Scientist",
    'engineer_kid': "cinematic, portrait, as a Young Engineer",
    'anime_hero': "cinematic, portrait, as an Anime Hero",
    'space_knight': "cinematic, portrait, as a Space Knight",
    'villainess_fm': "cinematic, portrait, as a Villainess",
    'thomas_shelby' : "cinematic, portrait, as Thomas Shelby from Peaky Blinders",
    'ceo_dad': "cinematic, portrait, as a CEO Dad",
    'ninja': "cinematic, portrait, as a Ninja",
    'robot': "cinematic, portrait, as a Robot, dark",
    'vampire': "cinematic, portrait, as a Vampire",
    'ice_princess': "cinematic, portrait, as an Ice Princess",
    'superdad': "cinematic, portrait, as a Superdad",
    'dragon_tamer': "cinematic, portrait, as a Dragon Tamer",
    'pilot' : "cinematic, portrait, as a Jet Pilot, without helmet, goggles",
    'forest_elf': "cinematic, portrait, as a Forest Elf",
    'space_captain': "cinematic, portrait, as a Space Captain",
    'lightning_hero': "cinematic, portrait, as a Lightning Hero",
    'angel': "cinematic, portrait, as an Angel, wings, halo",
    'detective': "cinematic, portrait, as a Detective",
    'custom': None
}

def send_command(payload: dict):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.connect(('localhost', 9999))
            s.sendall(json.dumps(payload).encode())
            print("✅ Command sent to backend. Waiting for response...")

            response_data = s.recv(4096)
            if not response_data:
                print("⚠️ No response from server.")
                return

            response = json.loads(response_data.decode())
            if response.get("status") == "success":
                image_path = response.get("image_path")
                print(f"🖼️ Image generated and saved at: {image_path}")
            else:
                print("❌ Backend reported a failure.")
    except ConnectionRefusedError:
        print("❌ Unable to connect to the inference server. Is it running?")
    except Exception as e:
        print(f"❌ Error: {e}")


def main():
    while True:
        print("\n--- Trigger Image Generation ---")
        print("1. Start Generation")
        print("2. Exit Server")
        print("Q. Quit this client")

        action = input("Enter choice: ").strip().lower()

        if action == 'q':
            print("👋 Exiting client.")
            break
        elif action == '2':
            send_command({"command": "EXIT"})
        elif action == '1':
            print("\nAvailable styles:")
            for key in STYLE_PROMPTS:
                print(f" - {key}")

            style = input("Enter style key: ").strip().lower()
            if style not in STYLE_PROMPTS:
                print("❌ Invalid style. Try again.")
                continue

            custom_prompt = None
            if style == 'custom':
                custom_prompt = input("Enter your custom prompt: ").strip()
                if not custom_prompt:
                    print("❌ Prompt cannot be empty.")
                    continue

            payload = {
                "command": "START_GENERATION",
                "style": style,
                "custom_prompt": custom_prompt
            }
            send_command(payload)
        else:
            print("❌ Invalid choice. Enter 1, 2, or Q.")

if __name__ == "__main__":
    main()
