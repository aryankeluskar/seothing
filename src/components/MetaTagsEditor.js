const React = require('react');
const { useState, useEffect } = React;
const { Box, Text, useApp } = require('ink');
const EditableTextBox = require('./EditableTextBox');

const MetaTagsEditor = ({ generatedTags, onComplete }) => {
  const { exit } = useApp();
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);
  const [editedTags, setEditedTags] = useState({});

  // Field definitions with display names (no limits)
  const fields = [
    { key: 'title', label: 'Title' },
    { key: 'description', label: 'Description' },
    { key: 'ogTitle', label: 'Open Graph Title' },
    { key: 'ogDescription', label: 'Open Graph Description' },
    { key: 'canonicalPattern', label: 'Canonical URL Pattern' }
  ];

  // Handle keywords separately (convert array to string)
  const [keywordsString, setKeywordsString] = useState(() => {
    if (generatedTags.keywords) {
      return Array.isArray(generatedTags.keywords) 
        ? generatedTags.keywords.join(', ')
        : generatedTags.keywords;
    }
    return '';
  });

  const allFields = [
    { key: 'keywords', label: 'Keywords', value: keywordsString },
    ...fields.map(field => ({
      ...field,
      value: editedTags[field.key] !== undefined ? editedTags[field.key] : (generatedTags[field.key] || '')
    }))
  ];

  const currentField = allFields[currentFieldIndex];

  const handleSave = (value) => {
    console.log(`Saving field: ${currentField.key}, value: ${value}`);
    
    if (currentField.key === 'keywords') {
      // Convert comma-separated string back to array
      const keywords = value.split(',').map(k => k.trim()).filter(k => k);
      setEditedTags(prev => ({ ...prev, keywords }));
      setKeywordsString(value);
    } else {
      setEditedTags(prev => ({ ...prev, [currentField.key]: value }));
    }

    // Move to next field or complete
    if (currentFieldIndex < allFields.length - 1) {
      console.log(`Moving to next field: ${currentFieldIndex + 1}`);
      setCurrentFieldIndex(currentFieldIndex + 1);
    } else {
      // All fields completed
      const finalTags = {
        ...editedTags,
        [currentField.key]: currentField.key === 'keywords' 
          ? value.split(',').map(k => k.trim()).filter(k => k)
          : value
      };
      
      // Keep reasoning from original
      if (generatedTags.reasoning) {
        finalTags.reasoning = generatedTags.reasoning;
      }
      
      console.log('All fields completed, final tags:', finalTags);
      onComplete(finalTags);
    }
  };

  const handleCancel = () => {
    // Return original tags on cancel
    onComplete(generatedTags);
  };

  return React.createElement(Box, { flexDirection: "column", padding: 1 }, [
    // Progress indicator
    React.createElement(Box, { marginBottom: 1, key: "progress" },
      React.createElement(Text, { color: "cyan", bold: true },
        `📝 AI-Generated Meta Tags - Edit each field (${currentFieldIndex + 1}/${allFields.length})`
      )
    ),

    // Current field editor
    React.createElement(EditableTextBox, {
      label: currentField.label,
      initialValue: currentField.value,
      onSave: handleSave,
      onCancel: handleCancel,
      key: `editor-${currentFieldIndex}-${currentField.key}`
    }),

    // Show what's coming next
    currentFieldIndex < allFields.length - 1 && React.createElement(Box, { marginTop: 1, key: "next" },
      React.createElement(Text, { color: "gray" },
        `Next: ${allFields[currentFieldIndex + 1].label}`
      )
    ),

    // Progress bar
    React.createElement(Box, { marginTop: 1, key: "progressbar" },
      React.createElement(Text, { color: "gray" },
        `Progress: [${Array.from({ length: allFields.length }, (_, i) => 
          i <= currentFieldIndex ? '█' : '░'
        ).join('')}]`
      )
    )
  ].filter(Boolean));
};

module.exports = MetaTagsEditor;