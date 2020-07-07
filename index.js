const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "What is your name?"
    },
    {
      type: "input",
      name: "title",
      message: "What is your job title?"
    },
    {
      type: "input",
      name: "location",
      message: "Where do you currently live?"
    },
    {
      type: "checkbox",
      name: "skills",
      message: "What technologies do you know?",
      choices: [
        "HTML", 
        "CSS", 
        "JavaScript", 
        "MySQL"
      ]
    },
    {
      type: "confirm",
      name: "hasGitHub",
      message: "Do you have a GitHub account?",
      default: "false"
    },
    {
      type: "input",
      name: "githubURL",
      message: "Enter your GitHub URL.",
      when: function(answers){
        return answers.hasGitHub;
      }
    },
    {
      type: "confirm",
      name: "hasLinkedIn",
      message: "Do you have a LinkedIn account?",
      default: "false"
    },
    {
      type: "input",
      name: "linkedinURL",
      message: "Enter your LinkedIn URL.",
      when: function(answers){
        return answers.hasLinkedIn;
      }
    },
    {
      type: "confirm",
      name: "includeEmail",
      message: "Would you like to include your email address?",
      default: "false"
    },
    {
      type: "input",
      name: "emailAddress",
      message: "Enter your email address.",
      //default: "",
      when: function(answers){
        return answers.includeEmail;
      }
    }
  ]);
}

function generateSkills(answers){
  let skillsHTML = '';
  let num = (answers.skills).length;
  for (var i=0; i<num; i++) {
    if(i !== (num - 1)){
      skillsHTML += answers.skills[i] + ', ';
    }else{
      skillsHTML += answers.skills[i];
    }
  };
  return skillsHTML;
}

function generateContactsMenu(answers) {
  let contactHTML = ``;
  if (answers.linkedinURL){
    const linkedInHTML = `<a href=${answers.linkedinURL} class="card-footer-item"><i class="fab fa-linkedin-in"></i>&nbsp;LinkedIn</a>`
    contactHTML += linkedInHTML;
  } else{
    contactHTML = contactHTML;
  };
  if (answers.githubURL){
    const gitHubHTML = `<a href=${answers.githubURL} class="card-footer-item" ><i class="fab fa-github-alt"></i>&nbsp;GitHub</a>`
    contactHTML += gitHubHTML;
  }else {
    contactHTML = contactHTML
  };
  if (answers.emailAddress){
    const theEmail = `${answers.emailAddress}`
    const emailToAdd = 'mailto:' + theEmail;
    const emailHTML = `<a href=${emailToAdd} class="card-footer-item"><i class="fas fa-at"></i>&nbsp;Email</a>`;
    contactHTML += emailHTML;
  }else {
    contactHTML = contactHTML;
  }
  return contactHTML;
}

const myHTMLPage = function(answers, skills, contacts) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${answers.name}'s Bio</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css">
  </head>
  <body>
    <section class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            ${answers.name}
          </h1>
          <h2 class="subtitle">
            Hi! My name is ${answers.name}.
          </h2>
          <div class="card">
            <header class="card-header">
              <p class="card-header-title">
                A bit about me
              </p>
            </header>
            <div class="card-content">
              <div class="content">
                <p>I am a ${answers.title} who lives in ${answers.location}. My skills include: ${skills}.</p>
                <p>I would love to work with you on your next project. Connect with me by using one of the links below.</p>
              </div>
            </div>
            <footer class="card-footer">
              ${contacts}
            </footer>
          </div>
        </div>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          Built with <strong>Bulma</strong> by <a href="${answers.emailAddress}">${answers.name}</a>.
        </p>
      </div>
    </footer>
    <script src="https://kit.fontawesome.com/edf69cb904.js" crossorigin="anonymous"></script>
  </body>
</html>`
}

async function start() {
  try {
    const answers = await promptUser();

    const skills = generateSkills(answers);

    const contacts = generateContactsMenu(answers);

    const html =  myHTMLPage(answers, skills, contacts);

    await writeFileAsync("index.html", html);

    console.log("Successfully created index.html");
  } catch(err) {
    console.log(err);
  }
}

start();