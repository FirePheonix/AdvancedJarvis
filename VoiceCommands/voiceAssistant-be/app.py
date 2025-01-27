from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import webbrowser

# FBasic fask app initialization.
app = Flask(__name__)
CORS(app)

# Set your OpenAI API key
openai.api_key = "PUT_YOUR_KEY_DOWN_HERE_BUDDY"

@app.route('/query', methods=['POST'])
def process_query():
    data = request.json
    user_query = data.get('query')

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    try:
        # Send query to ChatGPT
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": user_query}]
        )
        answer = response["choices"][0]["message"]["content"]

        # Check if query is for opening websites
        if "open" in user_query.lower():
            website = None
            if "youtube" in user_query.lower():
                website = "https://www.youtube.com"
            elif "google" in user_query.lower():
                website = "https://www.google.com"
            elif "linkedin" in user_query.lower():
                website = "https://www.linkedin.com"
            elif "weather" in user_query.lower():
                website = "https://www.weather.com"
            elif "chatgpt" in user_query.lower():
                website = "https://chat.openai.com"

            if website:
                webbrowser.open_new_tab(website)
                return jsonify({"reply": f"Opening {website}..."})
            else:
                return jsonify({"reply": "I couldn't recognize the website. Please specify clearly."})

        return jsonify({"reply": answer})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
