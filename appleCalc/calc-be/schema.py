#creating a pydatic schema
# Import the BaseModel class from the Pydantic library
from pydantic import BaseModel  

# Define a new class named 'ImageData' that inherits from BaseModel
class ImageData(BaseModel):  
    # Define a field named 'image', which is expected to be a string
    image: str  
    # Define a field named 'dict_of_vars', which is expected to be a dictionary
    dict_of_vars: dict  

