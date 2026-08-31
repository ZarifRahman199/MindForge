const extraLanguages = require('./additionalLanguages');

module.exports = function (api) {
  api.cache(false);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      function addLanguageCourses({ types: t }) {
        return {
          visitor: {
            VariableDeclarator(path) {
              if (path.node.id && path.node.id.name === 'LANGUAGE_CONTENT' && path.node.init && path.node.init.type === 'ObjectExpression') {
                for (const [name, lessons] of Object.entries(extraLanguages)) {
                  const exists = path.node.init.properties.some(
                    (property) => property.key && property.key.type === 'Identifier' && property.key.name === name
                  );
                  if (!exists) {
                    path.node.init.properties.push(
                      t.objectProperty(
                        t.stringLiteral(name),
                        t.callExpression(t.identifier('L'), [t.valueToNode(lessons.map((words, index) => ({
                          title: ['Greetings', 'Numbers', 'Colors', 'Family', 'Food'][index],
                          words
                        })))])
                      )
                    );
                  }
                }
              }
            }
          }
        };
      }
    ]
  };
};