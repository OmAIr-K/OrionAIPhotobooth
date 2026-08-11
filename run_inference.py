import torch
from pulid.pipeline import PuLIDPipeline
from pulid.utils import seed_everything
from PIL import Image
import numpy as np
import os
import sys
import socket
import json
import logging
import signal
from typing import Dict, Any, Optional
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
from google.oauth2 import service_account

# Resolve paths relative to this repo so the project is portable across machines
_REPO_ROOT = Path(__file__).resolve().parent
GOOGLE_CREDENTIALS_FILE = str(_REPO_ROOT / "AIPhotobooth" / "credentials.json")

SCOPES = ['https://www.googleapis.com/auth/drive']

def authenticate():
    try:
        credentials = service_account.Credentials.from_service_account_file(
            GOOGLE_CREDENTIALS_FILE,
            scopes=SCOPES
        )
        return build('drive', 'v3', credentials=credentials)
    except Exception as e:
        logging.error(f"Authentication failed: {e}")
        raise


def get_or_create_folder(service, folder_name):
    try:
        response = service.files().list(
            q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed = false",
            spaces='drive',
            fields='files(id, name)'
        ).execute()
        folders = response.get('files', [])
        if folders:
            return folders[0]['id']
        
        folder_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        folder = service.files().create(body=folder_metadata, fields='id').execute()
        return folder['id']
    except HttpError as error:
        logging.error(f"Folder error: {error}")
        raise

def upload_to_drive(file_path, folder_name):
    service = authenticate()

    if not os.path.exists(file_path):
        logging.error(f"Upload failed. File not found: {file_path}")
        return None

    try:
        folder_id = get_or_create_folder(service, folder_name)
        file_metadata = {
            'name': os.path.basename(file_path),
            'parents': [folder_id]
        }
        media = MediaFileUpload(file_path, resumable=True)
        uploaded_file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id'
        ).execute()

        file_id = uploaded_file.get('id')

        service.permissions().create(
            fileId=file_id,
            body={"role": "reader", "type": "anyone"},
        ).execute()

        return f"https://drive.google.com/uc?export=download&id={file_id}"
    except HttpError as error:
        logging.error(f"Upload error: {error}")
        return None


# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
HOST = 'localhost'
PORT = 9999
INPUT_DIR = Path("inputs")
OUTPUT_DIR = Path("outputs")
INPUT_DIR.mkdir(exist_ok=True)
OUTPUT_DIR.mkdir(exist_ok=True)

# Global variables for cleanup
server_socket = None
pipeline = None
is_running = True

def signal_handler(signum, frame):
    """Handle shutdown signals"""
    global is_running
    signal_name = signal.Signals(signum).name
    logger.info(f"\n🛑 Received signal {signal_name}")
    is_running = False
    cleanup_and_exit()

# Register signal handlers
signal.signal(signal.SIGINT, signal_handler)  # Ctrl+C
signal.signal(signal.SIGTERM, signal_handler)  # Termination request

# Initialize pipeline
try:
    pipeline = PuLIDPipeline()
    seed_everything(42)  # Set random seed for reproducibility
    logger.info("✨ Pipeline initialized successfully")
except Exception as e:
    logger.error(f"💥 Failed to initialize pipeline: {e}")
    sys.exit(1)

STYLE_PROMPTS = {
    'dumbeldore': "cinematic, portrait, as Dumbeldore",
    'iron_man': "cinematic, portrait, as Iron Man, without helmet",
    'jon_snow': "cinematic, portrait, as Jon Snow",
    'fire_queen': "cinematic, portrait, as a Fire Queen",
    'princess_hj': "cinematic, portrait, as a Princess, hijab",
    'mafia_boss': "cinematic, portrait, as Mafia Boss",
    'spider_woman': "cinematic, portrait, as Spider Woman",
    'basketball_star': "cinematic, portrait, as a Basketball Star",
    'captain_america': "cinematic, portrait, as Captain America",
    'spider_man': "cinematic, portrait, as Spider Man",
    'flash': "cinematic, portrait, as Flash, without face mask, lightning.",
    'gamer_fm': "cinematic, portrait, as a Gamer Girl, neon",
    'cyberpunk': "cinematic, portrait, as a Cyberpunk Man, Neon lights",
    'future_scientist': "cinematic, portrait, as a Future Scientist",
    'engineer_kid': "cinematic, portrait, as a Young Engineer",
    'anime_hero': "cinematic, portrait, as an Anime Hero, realistic",
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
    'custom': None
}

def find_latest_input_image() -> Optional[Path]:
    """Find the most recently added image in the input directory"""
    try:
        files = list(INPUT_DIR.glob("*.jp*g")) + list(INPUT_DIR.glob("*.png"))
        if not files:
            return None
        return max(files, key=lambda x: x.stat().st_mtime)
    except Exception as e:
        logger.error(f"🔍 Error finding latest input image: {e}")
        return None

def run_inference(
    input_image_path: Path,
    prompt: str,
    style: str,
    conn: socket.socket
) -> bool:
    """Run inference with proper error handling and progress updates"""
    try:
        # Load and process image
        input_image = Image.open(input_image_path).convert("RGB")
        input_np = np.array(input_image)

        # Configuration
        scale = 1.0
        id_scale = 0.7
        steps = 4
        height, width = 768, 576
        
        negative_prompt = (
            "flaws in the eyes, flaws in the face, flaws, lowres, non-HDRi, "
            "low quality, worst quality, artifacts noise, text, watermark, "
            "glitch, deformed, mutated, ugly, disfigured"
        )

        # Run generation
        image_embedding = pipeline.get_id_embedding(input_np)
        generated_image = pipeline.inference(
            prompt, (1, height, width), negative_prompt, image_embedding, id_scale, scale, steps
        )

        # Path to React frontend outputs folder (served / linked by the UI)
        REACT_PUBLIC_OUTPUT_DIR = _REPO_ROOT / "AIPhotobooth" / "outputs"
        REACT_PUBLIC_OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


        # Save output
        safe_style = style.replace(" ", "_").lower()
        output_path = REACT_PUBLIC_OUTPUT_DIR / f"{input_image_path.stem}_{safe_style}.jpg"
        generated_image[0].save(output_path)

         # Upload to Google Drive
        #folder_name = input_image_path.stem
        drive_url = upload_to_drive(output_path, folder_name="Pulid_outputs")

        # Send success response
        response = {
            "status": "success",
            "message": "Image generated successfully",
            "image_path": str(output_path),
            "drive_url": "https://drive.google.com/uc?id=...&export=download"
        }

        if drive_url:
            response["drive_url"] = drive_url
            logger.info(f"🌐 Image available at: {drive_url}")
        else:
            logger.warning("⚠️ Could not generate Drive download link")

        
        
        conn.sendall(json.dumps(response).encode() + b'\n')
        logger.info(f"✅ Generated image saved to: {output_path}")
        return True

    except Exception as e:
        error_msg = f"Error during inference: {str(e)}"
        logger.error(f"💥 {error_msg}")
        try:
            error_response = json.dumps({"status": "error", "error": error_msg})
            conn.sendall(error_response.encode() + b'\n')
        except Exception as send_error:
            logger.error(f"📡 Failed to send error response: {send_error}")
        return False

def cleanup_and_exit() -> None:
    """Clean up resources and exit"""
    global server_socket, pipeline, is_running
    
    if not is_running:  # Prevent double cleanup
        return
        
    try:
        logger.info("🧹 Cleaning up resources...")
        is_running = False
        
        # Close server socket if it exists
        if server_socket:
            try:
                server_socket.close()
                logger.info("🔌 Server socket closed")
            except Exception as e:
                logger.error(f"Error closing server socket: {e}")
        
        # Clean up pipeline
        if pipeline:
            try:
                del pipeline
                torch.cuda.empty_cache()
                logger.info("🧮 Pipeline cleaned up and GPU memory cleared")
            except Exception as e:
                logger.error(f"Error cleaning up pipeline: {e}")
        
        logger.info("👋 Exiting gracefully")
        
    except Exception as e:
        logger.error(f"🚨 Error during cleanup: {e}")
    finally:
        sys.exit(0)

def handle_client(conn: socket.socket, addr: tuple) -> None:
    """Handle individual client connections"""
    logger.info(f"🤝 Connected by {addr}")
    
    try:
        data = conn.recv(4096)
        if not data:
            return

        message = json.loads(data.decode())
        command = message.get("command")
        logger.info(f"📥 Received command: {command}")

        if command == "EXIT":
            logger.info("🚪 Exit command received")
            conn.sendall(json.dumps({"status": "success", "message": "Server shutting down"}).encode() + b'\n')
            cleanup_and_exit()
            
        elif command == "START_GENERATION":
            style = message.get("style")
            custom_prompt = message.get("custom_prompt")
            
            # Validate style
            if style not in STYLE_PROMPTS:
                error_msg = f"Unknown style key: {style}"
                logger.error(f"❌ {error_msg}")
                conn.sendall(json.dumps({"status": "error", "error": error_msg}).encode() + b'\n')
                return
                
            # Get prompt
            prompt = custom_prompt if style == "custom" else STYLE_PROMPTS[style]
            if not prompt:
                error_msg = "No prompt provided for custom style"
                logger.error(f"❌ {error_msg}")
                conn.sendall(json.dumps({"status": "error", "error": error_msg}).encode() + b'\n')
                return
                
            # Find input image
            input_image = find_latest_input_image()
            if not input_image:
                error_msg = "No input image found"
                logger.error(f"🔍 {error_msg}")
                conn.sendall(json.dumps({"status": "error", "error": error_msg}).encode() + b'\n')
                return
                
            logger.info(f"🎯 Starting generation with style: {style}")
            run_inference(input_image, prompt, style, conn)
            
        else:
            error_msg = f"Unknown command: {command}"
            logger.error(f"❓ {error_msg}")
            conn.sendall(json.dumps({"status": "error", "error": error_msg}).encode() + b'\n')
            
    except json.JSONDecodeError:
        error_msg = "Invalid JSON message received"
        logger.error(f"📛 {error_msg}")
        conn.sendall(json.dumps({"status": "error", "error": error_msg}).encode() + b'\n')
    except Exception as e:
        error_msg = f"Error handling client: {str(e)}"
        logger.error(f"💥 {error_msg}")
        try:
            conn.sendall(json.dumps({"status": "error", "error": error_msg}).encode() + b'\n')
        except:
            logger.error("📡 Failed to send error response")
    finally:
        conn.close()

def main() -> None:
    """Main server loop"""
    global server_socket, is_running
    
    try:
        server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server_socket.bind((HOST, PORT))
        server_socket.listen(1)  # Only allow one connection at a time
        
        logger.info(f"🚀 Server listening on {HOST}:{PORT}")
        
        while is_running:
            try:
                conn, addr = server_socket.accept()
                handle_client(conn, addr)
            except socket.error as e:
                if not is_running:  # If we're shutting down, ignore socket errors
                    break
                logger.error(f"Socket error: {e}")
                continue
                
    except KeyboardInterrupt:
        logger.info("\n❗ KeyboardInterrupt received")
    except Exception as e:
        logger.error(f"💥 Server error: {e}")
    finally:
        cleanup_and_exit()

if __name__ == "__main__":
    main()
