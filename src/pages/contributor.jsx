import React, { useState, useEffect } from 'react';
import logo from './logo.png';
import { MarkGithubIcon } from '@primer/octicons-react';
import './contributorPage.css';

const ContributorPage = () => {
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/repos/agamjotsingh18/pollitup/contributors')
      .then(response => response.json())
      .then(data => {
        setContributors(data);
      })
      .catch(error => {
        console.log('Error fetching contributors:', error);
      });
  }, []);

  return (
    <div className="contributorsContainer"> {/* Add the class name to the container div */}
      {contributors.map(contributor => (
        <div key={contributor.id} className="contributorItem"> {/* Add the class name to the item div */}
          <img src={contributor.avatar_url} alt={contributor.login} className="avatar" /> {/* Add the class name to the image */}
          <p className="username">{contributor.login}</p> {/* Add the class name to the paragraph */}
        </div>
      ))}
    </div>
  );
};


const Contributor = () => {
  return (
    <div className="container">
      <div className="logoContainer">
        <img src={logo} alt="Logo" className="logo" />
      </div>
      <div className="contentContainer">
        <h2 className="contributeTitle">Contribute</h2>
        <p className="motivation">
          "Make a difference. Share your expertise. Build together. Inspire innovation. Embrace open source collaboration."
        </p>
        <a href="https://github.com/agamjotsingh18/pollitup" target="_blank" rel="noopener noreferrer" className="githubButton">
          <MarkGithubIcon size={20} className="githubIcon" />
          GitHub
          <span className="startContributingText">Start Contributing</span>
        </a>
        <h1 className="pageHeading">CONTRIBUTORS</h1>
      </div>
      <ContributorPage />
    </div>
  );
};

export default Contributor;
