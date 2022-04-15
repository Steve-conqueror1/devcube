const readline = require('readline');
const fs = require('fs');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function input(prompt) {
  return new Promise((callbackFn, errorFn) => {
    rl.question(
      prompt,
      (uinput) => {
        callbackFn(uinput);
      },
      () => {
        errorFn();
      }
    );
  });
}

const params = {};

const setParams = async () => {
  params.filename = await input('o- ');
  params.ids = (await input('p- ')).split('');
  rl.close();
};

const writeToJSON = (path, content) => {
  fs.appendFile(path, JSON.stringify(content), (err) => {
    console.log('Error occured while trying to write to the file', err);
  });
};

const getRequiredData = (dataObj) => {
  const { id, name, description } = dataObj;
  return { id, name, description };
};

const getProjects = async () => {
  await setParams();
  const path = `./${params.filename}.json`;

  const savedData = [];

  for (const id of params.ids) {
    try {
      const data = await axios.get(`${process.env.API_URL}/projects/${id}`, {
        headers: {
          'Shortcut-Token': process.env.SHORTCUT_API_TOKEN,
        },
      });

      const { data: projects } = data;
      const copiedProjFilelds = getRequiredData(projects);
      savedData.push(copiedProjFilelds);
    } catch (e) {
      console.log('Erorr Occured', e.message);
    }
  }

  writeToJSON(path, savedData);
};

getProjects();
