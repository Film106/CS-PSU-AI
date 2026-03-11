
import os
import shutil

src_dir = r"c:\Users\สราวุธ ฯ\Downloads\psuai"
dst_dir = r"d:\CS"

files_to_copy = [
    "psu-ai.js",
    "psu-model.json",
    "psu-model.weights.bin",
    "training_data.json"
]

for f in files_to_copy:
    src = os.path.join(src_dir, f)
    dst = os.path.join(dst_dir, f)
    try:
        shutil.copy2(src, dst)
        print(f"Copied {f}")
    except Exception as e:
        print(f"Failed to copy {f}: {str(e)}")
