<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Tracker</h3>

  <p align="center">
    project_description
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    ·
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



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
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Here's a blank template to get started: To avoid retyping too much info. Do a search and replace with your text editor for the following: `github_username`, `repo_name`, `twitter_handle`, `linkedin_username`, `email_client`, `email`, `project_title`, `project_description`

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]
* ![Tailwind][tailwind]
* [![Typescript]][Angular-url]


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

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
4. Enter your API in `config.js`
   ```js
   const API_KEY = 'ENTER YOUR API';
   ```
5. Change git remote url to avoid accidental pushes to base project
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



For an example of what this might look like in practice, see below.





![alt text](exampleDesign.png)



<!-- USER GLOBAL CONTEXT -->

## Implementing User Context With React's Context Hook

### Benefits

User Context has been implemented!! The use case for the context is getting access to a specific user's information and rather that doing a nightmare of imports and notations to get the info you need; you can call one line of code and get access to the session token for fetches and the loggedIn state for rendering! It keeps the code light, DRY, and easy to develope! Currently there are six pieces of info being given by the context. should there be a need / use case for adding more things to that we can add that at a later date! Please DM Charles for now and we can come up with a plan!

### Right up front, here is a guide for implementation:

**$\text{\color{#f23030}PRE REQS:}$** $\text{\color{#f28730}The only requirement is that your component is being proprerly rendered in 'App.tsx' so make sure to check that first.}$

1. Import useUserLoggedContext into your component page:
   - $\text{\color{#9d7af5} import}\text{\color{#f5e97a} \\{ }\text{\color{#7adef5}useUserLoggedContext}\text{\color{#f5e97a} \\}}\text{\color{#9d7af5} from}\text{\color{#fca944} './context/UserLoggedContext.tsx'}$;

2. Destructure the function call ***INSIDE*** your component function:
   - $\text{\color{#2555a8} const}\text{\color{#f5e97a} \\{ }\text{\color{#0096db}token, roles, isLoggedIn, userData, userLogged, setUserData, clearUserLogged}\text{\color{#f5e97a} \\}}=\text{\color{#fca944} useUserLoggedContext}\text{\color{#9d7af5}()}$;

3. Use the whatever part of the context you need!

### Additional Information

&nbsp;&nbsp;&nbsp;&nbsp;*<ins>At the base level React's [createContext](https://react.dev/reference/react/createContext) function allows a component to share some kind of data with other components that are wrapped in the context.</ins>*

### Traditional Implementation

&nbsp;&nbsp;&nbsp;&nbsp;Calling createContext returns a context object. **The context object itself does not hold any information;** it represents *which* context other components can read or provide. Similar to how *useState* gives you a variable and a setter function that changes that variable; createContext gives you *two* functions, a $\text{\color{#7EE787}.Provider}$ and a **.Consumer**. The **.Consumer** function has been deemed a legacy way of consuming (using) the $\text{\color{#D1A7FD} value}$ distributed by the $\text{\color{#7EE787}.Provider}$ function, and so is no longer recommended. Instead the components that need access to the $\text{\color{#D1A7FD} value}$ that is destributed by the context will utilize the **useContext()** function to consume (use) the $\text{\color{#D1A7FD} value}$. Below is an example of the tradional implementation:

#### *<ins>AContextFile.tsx</ins>*

```coffeescript
import React, { createContext } from 'react';

export const AUserContextExample = createContext(null)
```
^ Here we have created our Context with a default value of $\text{\color{#79C0FF}null}$.

#### *<ins>AnAppFile.tsx</ins>*

```coffeescript
import React, { useState, useEffect, useContext } from 'react';
import AUserContextExample from '../contexts/AContextFile.tsx';

import aUserFetchCall from '../apiCalls/ApiCalls.tsx';
import <AnAwesomeComponent /> from '../components/AnAwesomeComponent.tsx';
import <AnEpicComponent /> from '../components/AnEpicComponent.tsx';
import <AnExtreameComponent /> from '../components/AnExtreameComponent.tsx';

async function App () {
  const [aUserState, setAUserState] = useState();

  useEffect(() => {
    const aFetchedUser = await aUserFetchCall();
    setAUserState(aFetchedUser);
  }, [])

  return (
    <aUserContextExample.Provider value={aUserState}>
      <div>
        <h1> Welcome To The Awesome App! </h1>
        <AnAwesomeComponent />
        <AnEpicComponent />
        <AnExtreameComponent />
      </div>
    </aUserContextExample.Provider>
  )
}
```
^ Here we are properly importing all the necessary pieces of our example application into our App component. As App is completing the mounting phase, we are initiating a fetch call to get a user and $\text{\color{#FFA657}set state}$ on the user object that is returned by the fetch call, $\text{\color{#D2A8FF}aUserFetchCall}{()}$. Upon App completing the mounting phase, it renders the JSX and passes the state variable, $\text{\color{#FFA657} aUserState}$ to the context $\text{\color{#D1A7FD} value}$ in the $\text{\color{#7EE787} aUserContextExample.Provider}$. The $\text{\color{#7EE787} aUserContextExample.Provider}$ is now ***providing*** its $\text{\color{#D1A7FD} value(s)}$ to the components that are nested inside it.

#### *<ins>AnAwesomeComponent.tsx</ins>*

```coffeescript
import React, { useContext } from 'react';
import AUserContextExample from '../contexts/AContextFile.tsx';

export Function AnAwesomeComponent () {
  const anAwesomeUser = useContext(AUserContextExample);

  return (
    <div>
      <h1>`Hello ${anAwesomeUser.name}! Welcome to the Awesome page!`</h1>
      <div>
        {
          anAwsomeUser.someSickAttributeToMap.map((srslyCoolThing) => {
            return (
              <div>
                <div>{srslyCoolThing.foReal}</div>
                <div>{srslyCoolThing.noCap}</div>
                <div>{srslyCoolThing.trulyGOATED}</div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
```
^ Over in $\text{\color{#FFA657}AnAwsomeComponent}$; we import the $\text{\color{#D2A8FF}useContext}{()}$ function, set up a variable that equates to the $\text{\color{#D2A8FF}useContext}{()}$ function and pass $\text{\color{#FFA657}AUserContextExample}$ to it which gives us access to the $\text{\color{#D1A7FD}value(s)}$ ***provided*** by $\text{\color{#7EE787}aUserContextExample.Provider}$! From there we have access to the data in the $\text{\color{#7db8ff}aUserState}$ variable we fetched and set back in App! With dot notation we can grab whatever pieces of data we need and call whatever methods or function we need with it here in this component.


#### *<ins>AnAppFile.tsx</ins>*

```JavaScript
```
 


<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1 - Login
- [ ] Feature 2 - Home
- [ ] Feature 3 - Companies

The Companies section allows users to seamlessly manage a list of their companies. 

Key functionalities include:
	•	View All Companies: Browse a comprehensive list of companies with detailed information such as company name, application status, and notes.
	•	Create a Company: Add new companies by filling out a simple form with fields like name, website, address, and notes.
	•	Search for a Company: Use the search bar to quickly find companies by name, enhancing efficiency and user experience.

![Companies Section Demo](/tracker-crm-fe/public/assets/companies.gif)

- [ ] Feature 4
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Core Contributors:
<!-- 
HEY YOU!!!! Keep it in alphabetical by last name!!!
FORMAT: lastname, firstname 
  - github link 
  - linkedin link
  -->

**Chirchirillo, Joe**
   - [Github](https://github.com/jchirch)
   - [LinkedIn](https://www.linkedin.com/in/joechirchirillo/)

**Messersmith, Renee**
   - [Github](https://github.com/reneemes)
   - [LinkedIn](https://www.linkedin.com/in/reneehessersmith/)

**Cirbo, Candice**
   - [Github](https://github.com/ccirbo)
   - [LinkedIn](https://www.linkedin.com/in/candicecirbo/)

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [Tracker](https://github.com/turingschool/tracker-crm-fe)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[tailwind]: https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[typescript]: https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 