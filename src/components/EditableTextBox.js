const React = require('react');
const { useState, useEffect, useCallback } = React;
const { Box, Text, useInput, useApp } = require('ink');

const EditableTextBox = ({ 
  label, 
  initialValue = '', 
  onSave, 
  onCancel 
}) => {
  const [currentText, setCurrentText] = useState(initialValue);
  const [cursorPosition, setCursorPosition] = useState(initialValue.length);
  
  const currentLength = currentText.length;

  // Handle input
  useInput((input, key) => {
    // Save on Enter (not Ctrl+S)
    if (key.return) {
      onSave(currentText);
      return;
    }
    
    // Cancel on Escape
    if (key.escape) {
      onCancel();
      return;
    }
    
    // Handle backspace
    if (key.backspace || key.delete) {
      if (cursorPosition > 0) {
        const newText = currentText.slice(0, cursorPosition - 1) + currentText.slice(cursorPosition);
        setCurrentText(newText);
        setCursorPosition(cursorPosition - 1);
      }
      return;
    }
    
    // Handle arrow keys
    if (key.leftArrow) {
      setCursorPosition(Math.max(0, cursorPosition - 1));
      return;
    }
    if (key.rightArrow) {
      setCursorPosition(Math.min(currentText.length, cursorPosition + 1));
      return;
    }
    if (key.upArrow) {
      // Move cursor up one line
      const lines = currentText.split('\n');
      let charCount = 0;
      let currentLineIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= cursorPosition) {
          currentLineIndex = i;
          break;
        }
        charCount += lines[i].length + 1;
      }
      
      if (currentLineIndex > 0) {
        const currentCol = cursorPosition - charCount;
        const prevLineStart = charCount - lines[currentLineIndex - 1].length - 1;
        const newCol = Math.min(currentCol, lines[currentLineIndex - 1].length);
        setCursorPosition(prevLineStart + newCol);
      }
      return;
    }
    if (key.downArrow) {
      // Move cursor down one line
      const lines = currentText.split('\n');
      let charCount = 0;
      let currentLineIndex = 0;
      
      for (let i = 0; i < lines.length; i++) {
        if (charCount + lines[i].length >= cursorPosition) {
          currentLineIndex = i;
          break;
        }
        charCount += lines[i].length + 1;
      }
      
      if (currentLineIndex < lines.length - 1) {
        const currentCol = cursorPosition - charCount;
        const nextLineStart = charCount + lines[currentLineIndex].length + 1;
        const newCol = Math.min(currentCol, lines[currentLineIndex + 1].length);
        setCursorPosition(nextLineStart + newCol);
      }
      return;
    }
    
    // Handle regular text input
    if (input && !key.ctrl && !key.meta) {
      const newText = currentText.slice(0, cursorPosition) + input + currentText.slice(cursorPosition);
      setCurrentText(newText);
      setCursorPosition(cursorPosition + input.length);
    }
  });

  // Split text into lines for display
  const lines = currentText.split('\n');
  const displayLines = lines.length === 0 ? [''] : lines;
  
  // Calculate cursor position in terms of lines
  let cursorLine = 0;
  let cursorCol = cursorPosition;
  let charCount = 0;
  
  for (let i = 0; i < lines.length; i++) {
    if (charCount + lines[i].length >= cursorPosition) {
      cursorLine = i;
      cursorCol = cursorPosition - charCount;
      break;
    }
    charCount += lines[i].length + 1; // +1 for newline
  }
  
  // Handle cursor at end of text
  if (cursorPosition >= currentText.length) {
    cursorLine = lines.length - 1;
    cursorCol = lines[lines.length - 1].length;
  }

  return React.createElement(Box, { flexDirection: "column", padding: 1 }, [
    // Header
    React.createElement(Box, { marginBottom: 1, key: "header" }, [
      React.createElement(Text, { color: "cyan", bold: true, key: "label" }, label),
      React.createElement(Text, { color: "gray", key: "counter" }, ` (${currentLength} characters)`)
    ]),

    // Editable text box with blue border
    React.createElement(Box, { 
      borderStyle: "round", 
      borderColor: "blue", 
      padding: 1,
      minHeight: 7,
      width: 74,
      key: "textbox"
    }, 
      displayLines.slice(0, 5).map((line, index) => {
        const isCursorLine = index === cursorLine;
        
        return React.createElement(Box, { key: index, height: 1 },
          React.createElement(Text, null, [
            // Text before cursor
            isCursorLine ? line.slice(0, cursorCol) : line,
            
            // Cursor (only on cursor line)
            isCursorLine && React.createElement(Text, { 
              color: "white", 
              backgroundColor: "blue",
              key: "cursor"
            }, cursorCol < line.length ? line[cursorCol] : ' '),
            
            // Text after cursor
            isCursorLine && cursorCol < line.length && line.slice(cursorCol + 1)
          ].filter(Boolean))
        );
      })
    ),


    // Instructions
    React.createElement(Box, { marginTop: 1, key: "instructions" },
      React.createElement(Text, { color: "gray" },
        "Type to edit • Press Enter to save and continue • Escape to cancel"
      )
    )
  ].filter(Boolean));
};

module.exports = EditableTextBox;