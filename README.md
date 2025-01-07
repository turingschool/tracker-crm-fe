<a id="readme-top"></a>
<div style="display: flex; align-items: center; justify-content: center; gap: 1rem;">
  <a href="https://turing.edu/">
    <img src="./src/Turing-logo.png" alt="Logo" width="80" height="80">
  </a>
  <h1 style="font-size: 3.5rem; margin: 0;">Tracker by Turing</h1>
</div>
<br />


<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#continuous-integration-ci">Continuous Integration (CI)</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#design-doc">Design Doc</a></li>
    <li><a href="#global-context">Global Context</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#core-contributors">Core Contributors</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![Product Name Screen Shot](/tracker-crm-fe/public/assets/Screenshot%202025-01-07%20at%201.37.15 PM.png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

* [![React][React.js]][React-url]
* [![TailwindCSS][TailwindCSS]][TailwindCSS-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![Cypress][Cypress]][Cypress-url]
* [![CircleCI][CircleCI]][CircleCI-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* npm

  ```
  npm install npm@latest -g
  ```

### Continuous Integration (CI)

This project uses CircleCI for Continuous Integration (CI). To set up CircleCI for this repository:

1. **Sign Up for CircleCI**:

    - Visit [CircleCI](https://circleci.com/) and log in using your GitHub account.

2. **Authorize CircleCI**:

    - Allow CircleCI to access this repository.

3. **Add the Configuration File**:
    - Ensure the `.circleci/config.yml` file is present in the repository.
    - The current configuration uses Cypress for testing:

      ```yaml
      version: 2.1
      orbs:
        cypress: cypress-io/cypress@3.1.1
      workflows:
        build:
          jobs:
            - cypress/run:
                cypress-command: npx cypress run --headless
                start-command: npm start
      ```

4. **Verify the CI Pipeline**:

    - Push your changes to the `main` branch.
    - Navigate to the CircleCI dashboard to confirm that tests run successfully.

For more information, see the [CircleCI Documentation](https://circleci.com/docs/).

### Installation

1. Get a free API Key at [https://example.com](https://example.com)
2. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Design Doc
Currently, we will be using Helvetica Neue Sans-Serif as our primary font, with the font size being set using vh/vw. 

Example: className="text-[5vw] font-[Helvetica Neue]"

(Note that most text should be Helvetica Neue by default, but if it isn't, setting it manually can be done as above.)

We will be refactoring to make use of MUI's SvgIcon icons, rather than images. Follow the following links for more information about how we'll be doing this:
https://mui.com/material-ui/getting-started/
https://mui.com/material-ui/material-icons/?query=home


We'll be using colors according to the image below.
![alt text](ColorGuide.png)

For a form container, we'll be using something like this:
`<div className="w-[50vw] mx-auto my-[2vh] p-[3vh] ">`

while for our Save Button, we'll be following this example.
`bg-cyan-600 text-white px-[2vw] py-[1vh] rounded w-[10vw] hover:bg-cyan-700 focus:ring-cyan-500 focus:ring-2`

For our form boxes, we'll be using this styling.
`<label htmlFor="email" className="block text-gray-700 font-medium mb-[1vh]"> Email </label> <input className="w-full px-[1vh] py-[1vh] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" name="email"/>`


When we get text that's too long for our designated page area, we will cut that text off after a certain point, then insert a "Read More" button. This will open a modal containing the full version of the previously-truncated text.

When creating tables and forms, we'll be alternating between white and grey-100 for the background, and when we wish to create a button or search bars, we'll generally style them like this unless specifically told otherwise: 

 `<button className='bg-cyan-600 text-white p-[1vh] rounded w-[10vw]'>Add New +</button>`

`<input className='p-[1vh] border-2 border-slate-800 rounded w-[12vw] h-full' />`

`<input className='p-[1vh] border-2 border-slate-800 rounded w-[12vw] h-full' />`

For an example of what this might look like in practice, see below.

![alt text](exampleDesign.png)

<!-- USER GLOBAL CONTEXT -->

## Global Context

### Implementing User Context With React's Context Hook

### Benefits

User Context has been implemented!! The use case for the context is getting access to a specific user's information and rather that doing a nightmare of imports and notations to get the info you need; you can call one line of code and get access to the session token for fetches and the loggedIn state for rendering! It keeps the code light, DRY, and easy to develope! Currently there are six pieces of info being given by the context. should there be a need / use case for adding more things to that we can add that at a later date! Please DM Charles for now and we can come up with a plan!

#### Right up front, here is a guide for implementation:

<font color='red'>**PRE REQS:**</font> <font color='#db5800'>The only requirement is that your component is being proprerly rendered in 'App.tsx' so make sure to check that first.</font>

1. Import useUserLoggedContext into your component page:
> <font color='#774b94'>import</font> <font color='yellow'>{</font> <font color='#0096db'>useUserLoggedContext</font> <font color='yellow'>}</font> <font color='#774b94'>from</font> <font color='#a84100'>'./context/UserLoggedContext.tsx'</font>;

2. Destructure the function call ***INSIDE*** your component declaration:
> <font color='#2555a8'>const</font> <font color='yellow'>{</font> <font color='#0096db'>    token, roles, isLoggedIn, userLogged, clearUserLogged</font> <font color='yellow'>}</font> = <font color='#a84100'>useUserLoggedContext</font><font color='#774b94'>()</font>;

3. Use the whatever part of the context you need!

<!-- ROADMAP -->
## Roadmap

### Feature 1 - Login

### Feature 2 - Home

### Feature 3 - Companies

The Companies section allows users to seamlessly manage a list of their companies. 

Key Functionalities Include:

- View All Companies:
Browse a comprehensive list of companies with detailed information such as company name, application status, and notes.
- View Company Details:
Click on a company to see detailed information on a dedicated page, including the company’s name, website, address, and notes. The details page also displays a list of associated contacts, making it easier to manage relationships and connections.
- Create a Company:
Add new companies by filling out a simple form with fields like name, website, address, and notes.
- Search for a Company:
Use the search bar to quickly find companies by name, enhancing efficiency and user experience.

![Companies Section Demo](/tracker-crm-fe/public/assets/companies.gif)

<!-- CONTRIBUTING -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Core Contributors:
<!-- 
HEY YOU!!!! Keep it in alphabetical by last name!!!
FORMAT: lastname, firstname 
  - github link 
  - linkedin link
  -->

**Banks, Charles**
- [Github](https://github.com/DRIF7ER)
- [LinkedIn](https://www.linkedin.com/in/charles-t-banks-jr-6b982b152//)

**Bloom, Stefan**
- [Github](https://github.com/stefanjbloom)
- [LinkedIn](https://www.linkedin.com/in/stefanjbloom/)

**Chirchirillo, Joe**
- [Github](https://github.com/jchirch)
- [LinkedIn](https://www.linkedin.com/in/joechirchirillo/)

**Cirbo, Candice**
- [Github](https://github.com/ccirbo)
- [LinkedIn](https://www.linkedin.com/in/candicecirbo/)

**Croy, Lito**
- [Github](https://github.com/litobot)
- [LinkedIn](https://www.linkedin.com/in/litocroy/)

**De La Rosa, Melchor**   
- [Github](https://github.com/MDelarosa1993)
- [LinkedIn](https://www.linkedin.com/in/melchordelarosa/)

**Delaney, Kyle**
- [Github](https://gist.github.com/kylomite)
- [LinkedIn](https://www.linkedin.com/in/kylehamptondelaney/)

**Galvin, Shane**
- [Github](https://github.com/sgalvin36)
- [LinkedIn](https://www.linkedin.com/in/shane-galvin36/)

**Hill, John**
- [Github](https://github.com/jphill19)
- [LinkedIn](https://www.linkedin.com/in/johnpierrehill/)

**Hotaling, Marshall**
- [Github](https://github.com/marshallhotaling)
- [LinkedIn](https://www.linkedin.com/in/marshall-hotaling-7b52a8304/)

**Macur, Jim**
- [Github](https://github.com/jimmacur)
- [LinkedIn](https://www.linkedin.com/in/jimmacur/)

**Messersmith, Renee**
- [Github](https://github.com/reneemes)
- [LinkedIn](https://www.linkedin.com/in/reneemessersmith/)

**O'Leary, Ryan**
- [Github](https://github.com/ROlearyPro)
- [LinkedIn](https://www.linkedin.com/in/ryan-o-leary-6a963b211/)

**Pintozzi, Erin - (Project Manager)**
- [Github](https://github.com/epintozzi)
- [LinkedIn](https://www.linkedin.com/in/erin-pintozzi/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[TailwindCSS]: https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white
[TailwindCSS-url]: https://tailwindcss.com/
[Cypress]: https://img.shields.io/badge/Cypress-17202C?style=for-the-badge&logo=cypress&logoColor=white
[Cypress-url]: https://www.cypress.io/
[CircleCI]: https://img.shields.io/badge/CircleCI-343434?style=for-the-badge&logo=circleci&logoColor=white
[CircleCI-url]: https://circleci.com/