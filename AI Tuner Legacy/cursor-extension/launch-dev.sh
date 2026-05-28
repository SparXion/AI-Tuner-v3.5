#!/bin/bash
# Launch Extension Development Host manually

echo "Compiling TypeScript..."
npm run compile

if [ $? -eq 0 ]; then
    echo "✅ Compilation successful!"
    echo ""
    echo "To launch the extension:"
    echo "1. Open the cursor-ai-tuner folder in Cursor"
    echo "2. Press Cmd+Shift+P"
    echo "3. Type: 'Debug: Start Debugging'"
    echo "4. Select 'Launch Extension' from the dropdown"
    echo ""
    echo "OR use the Run menu:"
    echo "Run → Start Debugging → Launch Extension"
else
    echo "❌ Compilation failed. Please fix errors and try again."
    exit 1
fi



