def convert_json_to_dialogues(json_data):
    dialogues = []

    for planet_id, planet_data in json_data.items():
        # Explorer greeting
        dialogues.append({
            "name": "Explorer",
            "text": planet_data.get("explorer_greeting", ""),
            "avatar": "explorer_avatar"  # Replace with actual avatar variable if available
        })

        # Virtual assistant greeting
        dialogues.append({
            "name": "ORION",
            "text": planet_data.get("virtual_assistant_greeting", ""),
            "avatar": "orion_avatar"  # Replace with actual avatar variable if available
        })

        # Orion greeting
        dialogues.append({
            "name": "ORION",
            "text": planet_data.get("orion_greeting", ""),
            "avatar": "orion_avatar"  # Replace with actual avatar variable if available
        })

        # Options and responses
        for option in planet_data.get("options", []):
            response_key = option.replace(" ", "_")
            if response_key in planet_data.get("responses", {}):
                response_text = planet_data["responses"][response_key]["text"]
                dialogues.append({
                    "name": "Explorer",
                    "text": option,
                    "avatar": "explorer_avatar"  # Replace with actual avatar variable if available
                })
                dialogues.append({
                    "name": "ORION",
                    "text": response_text,
                    "avatar": "orion_avatar"  # Replace with actual avatar variable if available
                })

    return dialogues

# Example usage with your JSON data
json_data = {
    "4": {
        "explorer_greeting": "Greetings, brave explorer! You've just landed on Kepler-7 b, a giant planet composed mainly of gas. Kepler-7 b, a massive world called a hot Jupiter, Kepler-7b was the first exoplanet to have its clouds mapped.",
        "virtual_assistant_greeting": "Dare to learn more? My virtual assistant, Orion, would be happy to help you!",
        "orion_greeting": "Hello there! I'm Orion, and I'm excited to share some fascinating facts.",
        "options": [
            "Is this planet habitable?",
            "Planet compared to Jupiter",
            "How long to travel here from earth?"
        ],
        "responses": {
            "Is_this_planet_habitable": {
                "text": "Kepler-7 b is not habitable. Kepler-7b's temperature was between 1,500 and 1,800 degrees Fahrenheit (820 and 980 degrees Celsius)."
            },
            "Planet_compared_to_Jupiter": {
                "text": "Kepler-7 b's mass is 0.441 Jupiters, and the radius is 1.622 x Jupiter."
            },
            "How_long_to_travel_here_from_earth": {
                "text": "A car with 60 miles per hour speed or about 96.5 km per hour needs 34 billion years. A jet with 600 miles per hour speed or about 965.6 km per hour needs 3 billion years. 3 thousand years at light speed."
            }
        }
    }
}

import json

# Convert JSON to dialogues
json_data = json.load(open("convo.json"))
dialogues = convert_json_to_dialogues(json_data)

# Print the result
for dialogue in dialogues:
    print(dialogue)
