import json
import shutil
import datetime
import os
import re
from typing import List, Dict, Any, Annotated

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="YATRA API", version="1.0.0")

# Define allowed origins for CORS
origins = [
    "http://localhost:5173",  # Local frontend dev server
    # Add your Vercel deployment URL here after deployment
    # e.g., "https://your-project-name.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the base directory of the backend script
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")
DATA_FILE = os.path.join(BACKEND_DIR, "data.json")

# Create uploads directory if it doesn't exist
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

def read_data() -> Dict[str, Any]:
    try:
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # If the file doesn't exist or is empty/corrupt, return a default structure
        return {"destinations": [], "dashboard": {}, "reports": []}

def write_data(data: Dict[str, Any]):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

@app.get("/destinations")
def get_destinations() -> List[Dict[str, Any]]:
    data = read_data()
    return data.get("destinations", [])


@app.get("/dashboard")
def get_dashboard() -> Dict[str, Any]:
    data = read_data()
    return data.get("dashboard", {})


class JourneyPayload(BaseModel):
    purpose: str
    days: str
    budget: str
    group: str
    interests: List[str]
    transport: str
    accessibility: List[str]


@app.post("/journey")
def create_journey(payload: JourneyPayload) -> Dict[str, Any]:
    data = read_data()
    all_destinations = data.get("destinations", [])

    # --- Rule-based Recommendation Engine ---

    # 1. Filter by Interests
    possible_destinations = [
        dest for dest in all_destinations
        if not payload.interests or dest.get("category") in payload.interests
    ]
    if not possible_destinations:
        possible_destinations = all_destinations

    # 2. Score by Budget
    budget_scores = {"Value": 1, "Mid-range": 2, "Comfort": 3}
    user_budget_score = budget_scores.get(payload.budget, 2)

    for dest in possible_destinations:
        dest["score"] = 0
        budget_str = dest.get("budget", "0")
        # Use regex to find the first number in the budget string.
        price_match = re.search(r'[\d,]+', budget_str)
        dest_budget_score = 3  # Default to 'Comfort' if parsing fails
        if price_match:
            try:
                price = int(price_match.group().replace(',', ''))
                if price <= 4800:
                    dest_budget_score = 1  # Value
                elif price <= 6400:
                    dest_budget_score = 2 # Mid-range
            except (ValueError, IndexError):
                pass # Keep default score
        else:
            dest_budget_score = 3 # Keep default if no numbers found
        
        # Add points if budget matches
        if user_budget_score == dest_budget_score:
            dest["score"] += 2
        elif abs(user_budget_score - dest_budget_score) == 1:
            dest["score"] += 1

    # 3. Score by Group Type
    for dest in possible_destinations:
        if payload.group == "Family" and dest.get("difficulty") == "Easy":
            dest["score"] += 2
        if payload.group == "Solo" and dest.get("difficulty") == "Moderate":
            dest["score"] += 1
        if payload.group == "Couple" and dest.get("category") in ["Highlands", "Waterfalls"]:
            dest["score"] += 1
    
    # 4. Sort destinations by score
    possible_destinations.sort(key=lambda x: x.get("score", 0), reverse=True)

    # 5. Select number of destinations
    num_days = int(payload.days) if payload.days.isdigit() else 1
    num_destinations = min(len(possible_destinations), num_days)
    selected_destinations = possible_destinations[:num_destinations]
    
    # --- Itinerary Generation ---

    journey_days = []
    for i, dest in enumerate(selected_destinations):
        day_focus = f"Exploring {dest['category']} aspects of {dest['region']}"
        day_note = dest["story"]

        if 'Sacred landscapes' in payload.interests and dest.get('category') == 'Sacred':
            day_focus = "Sacred Rituals & Temple Architecture"
            day_note = f"Today is dedicated to the spiritual heart of {dest['name']}. We'll explore ancient temples, witness living rituals, and understand the cultural significance of this sacred place."
        elif 'Wildlife and forests' in payload.interests and dest.get('category') == 'Wildlife':
             day_focus = "Jungle Safari & Biodiversity"
             day_note = f"An early start for a safari into {dest['name']}. We'll look for key species and learn about the park's conservation efforts from local guides."

        journey_days.append({
            "day": f"Day {i+1}",
            "place": dest["name"],
            "focus": day_focus,
            "note": day_note
        })
    
    # Dynamic title and intro
    interest_str = ", ".join(payload.interests) if payload.interests else "culture"
    title = f"A {payload.days}-Day {payload.purpose} Journey in Jharkhand"
    intro = f"This itinerary, designed for a {payload.group.lower()} trip, focuses on {interest_str}. Your journey will be paced for comfort, using a {payload.transport.lower()} to connect you with the landscape."
    
    # Update dashboard stats
    for item in data.get("dashboard", {}).get("snapshot", {}).get("highlights", []):
        if item["label"] == "Journeys created":
            current_value = int(item.get("value", "0"))
            item["value"] = str(current_value + 1)
            break
            
    write_data(data)

    return {
        "title": title,
        "intro": intro,
        "days": journey_days,
    }

class ReportPayload(BaseModel):
    category: str
    severity: str
    description: str
    location: str
    imageName: str


@app.get("/reports")
def get_reports() -> List[Dict[str, Any]]:
    data = read_data()
    return data.get("reports", [])


@app.post("/report")
def create_report(
    category: Annotated[str, Form()],
    severity: Annotated[str, Form()],
    description: Annotated[str, Form()],
    location: Annotated[str, Form()],
    image: Annotated[UploadFile | None, File()] = None,
) -> Dict[str, Any]:
    data = read_data()
    
    # Generate unique ID
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    report_id = f"CW-{severity[:2].upper()}-{timestamp}"
    
    image_path = None
    if image and image.filename:
        # Save uploaded image
        # Sanitize filename to prevent path traversal
        safe_filename = os.path.basename(image.filename)
        image_path = os.path.join(UPLOADS_DIR, f"{report_id}-{safe_filename}")
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

    # Create new report entry
    new_report = {
        "id": report_id,
        "category": category,
        "severity": severity,
        "description": description,
        "location": location,
        "imagePath": image_path,
        "status": "Received",
        "createdAt": datetime.datetime.now().isoformat(),
    }
    data.get("reports", []).insert(0, new_report)

    # Update dashboard stats
    for item in data.get("dashboard", {}).get("snapshot", {}).get("highlights", []):
        if item["label"] == "Conservation alerts":
            item["value"] = str(int(item.get("value", 0)) + 1)
            break

    write_data(data)

    return {
        "reportId": report_id,
        "status": "Received",
        "steps": [
            {"label": "Received", "detail": "Your report has entered the civic review queue."},
            {"label": "Field review", "detail": "A local officer is assessing the concern and context."},
            {"label": "Response", "detail": "Updates will be shared with the reporting channel."},
        ],
    }
