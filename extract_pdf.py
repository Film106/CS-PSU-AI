
import os
import PyPDF2

def extract_pdf_text(pdf_path):
    try:
        with open(pdf_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text
    except Exception as e:
        return f"Error: {str(e)}"

start_dir = r"c:\Users"
target_file = "PSU CS AI Track Recommender - Developer Integration Guide.pdf"

found_path = None
for root, dirs, files in os.walk(start_dir):
    if target_file in files:
        found_path = os.path.join(root, target_file)
        break

if found_path:
    content = extract_pdf_text(found_path)
    with open(r'd:\CS\pdf_content_utf8.txt', 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("FILE_NOT_FOUND")
