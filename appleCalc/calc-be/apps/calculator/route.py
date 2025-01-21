# Import APIRouter from FastAPI for creating a route
from fastapi import APIRouter  
# Import base64 for decoding base64 image strings
import base64  
# Import BytesIO for handling in-memory binary streams
from io import BytesIO  
# Import the `analyze_image` function from a utility module
from apps.calculator.utils import analyze_image  
# Import the ImageData schema for validating incoming request data
from schema import ImageData  
# Import the Image module from the PIL library for image manipulation
from PIL import Image  

# Create an instance of APIRouter for defining API endpoints
router = APIRouter()  

# Define a POST route (endpoint) to process images
@router.post('')  
# Define an asynchronous function named `run` to handle incoming requests
async def run(data: ImageData):  
    # Decode the base64-encoded image string provided in `data.image`
    # Assumes the format is "data:image/png;base64,<base64_data>"
    image_data = base64.b64decode(data.image.split(",")[1])  
    
    # Create a BytesIO stream from the decoded image data for in-memory processing
    image_bytes = BytesIO(image_data)  
    
    # Open the image using PIL's Image module
    image = Image.open(image_bytes)  
    
    # Call the `analyze_image` function to process the image
    # Pass the image and the dictionary of variables (`data.dict_of_vars`) as arguments
    responses = analyze_image(image, dict_of_vars=data.dict_of_vars)  
    
    # Initialize an empty list to store processed response data
    data = []  
    
    # Iterate over the `responses` returned by `analyze_image`
    for response in responses:  
        # Append each response to the `data` list
        data.append(response)  
    
    # Print the last response (for debugging purposes)
    print('response in route: ', response)  
    
    # Return a JSON response indicating the operation's status
    # Include the processed data and a success message
    return {"message": "Image processed", "data": data, "status": "success"}  
