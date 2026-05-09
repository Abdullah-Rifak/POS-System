#!/usr/bin/env python3
import re
import sys

file_path = r'c:\Users\HP\Desktop\POS-System\frontend\src\pages\salesman\addStock.jsx'

try:
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    print("Original file size:", len(content))
    
    # Remove errant quotes
    content = content.replace("'   const handleSubmit", "   const handleSubmit")
    content = content.replace("  };'\n  const handleReturn", "  };\n  const handleReturn")
    
    # Replace axios references (case where URLs are already cleaned)
    content = re.sub(r'await axios\.', 'await axiosInstance.', content)
    content = re.sub(r'axios\.', 'axiosInstance.', content)
    
    # Replace console.error with Logger.error
    content = re.sub(r'console\.error\(', 'Logger.error(', content)
    
    # Clean up any remaining hardcoded URLs
    content = re.sub(r'"http://localhost:5000', '"', content)
    content = re.sub(r"'http://localhost:5000", "'", content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✓ File fixed successfully")
    print("  - Removed errant quotes")
    print("  - Replaced axios with axiosInstance")
    print("  - Replaced console.error with Logger.error")
    print("  - Cleaned up hardcoded URLs")
    print("New file size:", len(content))
    
except Exception as e:
    print(f"✗ Error: {e}", file=sys.stderr)
    sys.exit(1)
