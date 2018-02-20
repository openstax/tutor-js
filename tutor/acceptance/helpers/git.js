const gitP = require('simple-git/promise');
const path = require('path');
const fs = require('fs-extra');
const { imagesDir } = require('./images-dir');
const chalk = require('chalk');

const repoURL = 'https://github.com/openstax/tutor-images.git';

function initialiseRepo(git) {
  console.log(chalk.yellow(`Cloning images repo to ${imagesDir}`));
  return git.clone(repoURL, imagesDir);
}

function getCurrentBranch() {
  const git = gitP(__dirname);
  return new Promise((resolve, reject) => {
    git.branchLocal((err, branch) => {
      if (err) { reject(err); }
      resolve(branch.current);
    });
  });
}

async function gitCommit() {
  const g = git();
  const currentBranchName = await getCurrentBranch();
  const branchInfo = await g.branch();
  if (branchInfo.all.includes(currentBranchName)) {
    await g.checkout(currentBranchName);
  } else {
    await g.checkoutLocalBranch(currentBranchName);
  }
  await g.add(['--all', '.']);
  await g.commit(`updated ${currentBranchName}`);
  await g.push('origin', currentBranchName);
}

async function gitInit() {
  await fs.ensureDir(imagesDir);
  const git = gitP(imagesDir);
  return git.cwd(imagesDir)
    .then(() => git.checkIsRepo())
    .then(isRepo => isRepo ? git : initialiseRepo(git))
    .then(() => git.fetch())
    .then(() => git);
}

function git() {
  process.exit(1)
  return gitP(imagesDir);
}

module.exports = { git, gitCommit, gitInit, getCurrentBranch };
