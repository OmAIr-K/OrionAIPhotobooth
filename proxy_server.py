from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import socket
import json
import logging
import os
from typing import Dict, Any, Tuple

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Configuration
BACKEND_HOST = 'localhost'
BACKEND_PORT = 9999
SOCKET_TIMEOUT = 1200  # 10 minutes timeout for long operations
BUFFER_SIZE = 16384  # Increased buffer size
OUTPUTS_DIR = '../outputs'  # Directory where generated images are stored

# Ensure the outputs directory exists
os.makedirs(OUTPUTS_DIR, exist_ok=True)

def send_to_backend(data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
    """
    Send data to backend and receive response
    """
    try:
        # Create a new connection for each request
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(SOCKET_TIMEOUT)
            s.connect((BACKEND_HOST, BACKEND_PORT))
            
            # Send command
            s.sendall(json.dumps(data).encode())
            logger.info(f"🚀 Sent command to backend: {data['command']}")
            
            # Wait for response with multiple reads if needed
            chunks = []
            while True:
                try:
                    chunk = s.recv(BUFFER_SIZE)
                    if not chunk:
                        break
                    chunks.append(chunk)
                except socket.timeout:
                    # If we have received some data, process it
                    if chunks:
                        break
                    logger.error("⏰ Socket read timed out with no data")
                    return {
                        "status": "error",
                        "error": "Backend operation timed out"
                    }, 504
            
            if not chunks:
                return {
                    "status": "error",
                    "error": "No response from backend"
                }, 500
            
            try:
                response = b''.join(chunks)
                response_data = json.loads(response.decode())
                
                # Validate response format
                if not isinstance(response_data, dict):
                    raise ValueError("Response must be a JSON object")
                
                if "status" not in response_data:
                    raise ValueError("Response missing 'status' field")
                
                if response_data["status"] not in ["success", "error", "processing"]:
                    raise ValueError("Invalid status value")
                
                if response_data["status"] == "success" and "image_path" not in response_data:
                    raise ValueError("Success response missing 'image_path'")
                
                if response_data["status"] == "error" and "error" not in response_data:
                    raise ValueError("Error response missing 'error' message")
                
                return response_data, 200 if response_data["status"] == "success" else 500
                
            except (json.JSONDecodeError, ValueError) as e:
                logger.error(f"Invalid response format: {e}")
                return {
                    "status": "error",
                    "error": f"Invalid response format from backend: {str(e)}"
                }, 500
                
    except ConnectionRefusedError:
        logger.error("❌ Backend server is not running")
        return {
            "status": "error",
            "error": "Backend server is not running"
        }, 503
    except socket.timeout:
        logger.error("⏰ Connection to backend timed out")
        return {
            "status": "error",
            "error": "Connection to backend timed out"
        }, 504
    except Exception as e:
        logger.error(f"💥 Unexpected error: {str(e)}")
        return {
            "status": "error",
            "error": str(e)
        }, 500

@app.route('/command', methods=['POST'])
def forward_command():
    """
    Forward commands from frontend to backend with proper error handling
    """
    try:
        command_data = request.json
        if not command_data:
            return jsonify({"status": "error", "error": "No command data provided"}), 400
        
        logger.info(f"📥 Received command: {command_data.get('command')}")
        response, status_code = send_to_backend(command_data)
        logger.info(f"📤 Sending response back to frontend")
        return jsonify(response), status_code
        
    except Exception as e:
        logger.error(f"💥 Error processing command: {str(e)}")
        return jsonify({
            "status": "error",
            "error": f"Error processing command: {str(e)}"
        }), 500

@app.route('/outputs/<path:filename>')
def serve_image(filename):
    """
    Serve generated images from the outputs directory
    """
    try:
        logger.info(f"🖼️ Serving image: {filename}")
        return send_from_directory(OUTPUTS_DIR, filename)
    except Exception as e:
        logger.error(f"❌ Error serving image {filename}: {str(e)}")
        return jsonify({
            "status": "error",
            "error": f"Error serving image: {str(e)}"
        }), 404

@app.route('/health', methods=['GET'])
def health_check():
    """
    Simple health check endpoint
    """
    try:
        # Try to connect to backend
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(2)  # Short timeout for health check
            s.connect((BACKEND_HOST, BACKEND_PORT))
            return jsonify({
                "status": "healthy",
                "message": "Proxy server is running and backend is reachable"
            }), 200
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "message": f"Backend server is not reachable: {str(e)}"
        }), 503

if __name__ == '__main__':
    logger.info("🚀 Starting proxy server on port 9998")
    app.run(host='localhost', port=9998) 