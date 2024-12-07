const { defineConfig } = require('cypress')


module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Ensure this function does not have unused or problematic code
    },
    baseUrl: 'http://localhost:3000', // Add your app's base URL if needed
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Adjust the test pattern if needed
  },
})