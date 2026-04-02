import json
import os
import time

DATA_DIR = r"C:\Users\Gator\.gemini\antigravity"
CONFIG_PATH = os.path.join(DATA_DIR, ".antigravity", "memory_config.json")

def get_config():
    with open(CONFIG_PATH, "r") as f:
        return json.load(f)

def load_json(filename, default):
    path = os.path.join(DATA_DIR, filename)
    if os.path.exists(path):
        try:
            with open(path, "r") as f:
                return json.load(f)
        except:
            return default
    return default

def save_json(filename, data):
    path = os.path.join(DATA_DIR, filename)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def add_memory(role, content, weight, tags):
    config = get_config()
    working_file = config.get("working_memory_file", "agent_memory_working.json")
    mem = load_json(working_file, [])
    
    timestamp = time.time()
    entry = {
        "id": f"{int(timestamp * 1000)}_{len(mem)}",
        "role": role,
        "content": content,
        "weight": max(0.0, min(1.0, float(weight))),
        "timestamp": timestamp,
        "tags": tags[:20]
    }
    mem.append(entry)
    save_json(working_file, mem)

if __name__ == "__main__":
    add_memory("user", "approved deployment scripts", 0.9, ["deploy", "vercel"])
    add_memory("agent", "Wrapped up Project Wood v0.1. Completed Phase 1, Phase 2, and Phase 3 of backend sprint. Awaiting Vercel deployment.", 0.8, ["milestone", "completion", "nextjs", "project-wood"])
    print("Memory updated successfully.")
