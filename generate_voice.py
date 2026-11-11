import asyncio
import os
import json
import edge_tts

VOICE = "en-US-AvaNeural" # Warm, youthful, natural feminine voice
TEXT = "Hello, gorgeous! Welcome to Nails by Sanu! Ready to find your perfect nail look? Let's make your nails beautiful!"
OUTPUT_FILE = "c:/Nail/public/audio/greeting.mp3"
TIMING_FILE = "c:/Nail/public/audio/greeting_timings.json"

os.makedirs("c:/Nail/public/audio", exist_ok=True)

async def main():
    print(f"Generating audio with voice: {VOICE}")
    communicate = edge_tts.Communicate(TEXT, VOICE, rate="+3%", pitch="+2Hz")
    
    events = []
    with open(OUTPUT_FILE, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                events.append({
                    "offset": chunk["offset"] / 10000000.0, # convert 100ns units to seconds
                    "duration": chunk["duration"] / 10000000.0,
                    "text": chunk["text"]
                })
    
    with open(TIMING_FILE, "w", encoding="utf-8") as tf:
        json.dump(events, tf, indent=2)
        
    print(f"Generated {OUTPUT_FILE} (size: {os.path.getsize(OUTPUT_FILE)} bytes)")
    print(f"Generated {TIMING_FILE} with {len(events)} word boundaries:")
    for ev in events:
        print(f"  {ev['offset']:.2f}s - {ev['offset'] + ev['duration']:.2f}s: {ev['text']}")

if __name__ == "__main__":
    asyncio.run(main())
