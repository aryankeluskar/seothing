const React = require('react');
const { render } = require('ink');
const MetaTagsEditor = require('./MetaTagsEditor');

const MetaTagsApp = ({ generatedTags, onComplete }) => {
  return React.createElement(MetaTagsEditor, {
    generatedTags: generatedTags,
    onComplete: onComplete
  });
};

// Function to run the meta tags editor
const runMetaTagsEditor = (generatedTags) => {
  return new Promise((resolve) => {
    const app = render(
      React.createElement(MetaTagsApp, {
        generatedTags: generatedTags,
        onComplete: (editedTags) => {
          app.unmount();
          resolve(editedTags);
        }
      })
    );
  });
};

module.exports = { MetaTagsApp, runMetaTagsEditor };