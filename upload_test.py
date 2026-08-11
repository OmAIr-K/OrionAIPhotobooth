import os
import logging
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.oauth2 import service_account

# ====== CONFIGURATION ======
# Path to your service account key JSON file (relative to repo root)
_REPO_ROOT = Path(__file__).resolve().parent
GOOGLE_CREDENTIALS_FILE = str(_REPO_ROOT / "AIPhotobooth" / "credentials.json")

# Scopes for full Drive access (needed to create folders and upload files)
SCOPES = ['https://www.googleapis.com/auth/drive']

# Enable logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


# ====== AUTHENTICATION ======
def authenticate():
    try:
        credentials = service_account.Credentials.from_service_account_file(
            GOOGLE_CREDENTIALS_FILE, scopes=SCOPES
        )
        service = build('drive', 'v3', credentials=credentials)
        logging.info("Authenticated with Google Drive API successfully.")
        return service
    except Exception as e:
        logging.error(f"Authentication failed: {e}")
        raise


# ====== FOLDER HANDLING ======
def get_or_create_folder(service, folder_name):
    try:
        response = service.files().list(
            q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false",
            spaces='drive',
            fields='files(id, name)',
            pageSize=1
        ).execute()
        folders = response.get('files', [])
        if folders:
            folder_id = folders[0]['id']
            logging.info(f"Found existing folder: {folder_name} (ID: {folder_id})")
            return folder_id

        folder_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        folder = service.files().create(body=folder_metadata, fields='id').execute()
        folder_id = folder.get('id')
        logging.info(f"Created new folder: {folder_name} (ID: {folder_id})")
        return folder_id
    except HttpError as error:
        logging.error(f"Error creating/getting folder: {error}")
        raise


# ====== FILE UPLOAD ======
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
        logging.info(f"File uploaded successfully. File ID: {file_id}")

        # Make file publicly readable
        service.permissions().create(
            fileId=file_id,
            body={'role': 'reader', 'type': 'anyone'},
        ).execute()

        # Direct download URL
        download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
        logging.info(f"Direct download URL: {download_url}")
        return download_url

    except HttpError as error:
        logging.error(f"Error uploading file: {error}")
        return None


# ====== MAIN TEST ======
if __name__ == "__main__":
    # Point this at any local image under the repo to smoke-test Drive upload
    image_path = _REPO_ROOT / "AIPhotobooth" / "outputs"
    candidates = list(image_path.glob("*.jpg")) + list(image_path.glob("*.png"))
    if not candidates:
        print(f"❌ No sample images found in {image_path}. Generate one first or set image_path manually.")
        raise SystemExit(1)
    image_path = candidates[0]

    download_link = upload_to_drive(str(image_path), folder_name="Pulid_outputs")

    if download_link:
        print("✅ File uploaded and accessible at:")
        print(download_link)
    else:
        print("❌ Upload failed.")
